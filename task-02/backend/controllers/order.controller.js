const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// =====================================================
// CREATE ORDER
// Reserve stock before payment
// =====================================================
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      items,
      totalAmount,
      paymentMethod = "Cash",
      customer = {},
      idempotencyKey,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Prevent duplicate order
    if (idempotencyKey) {
      const existingOrder = await Order.findOne({ idempotencyKey });

      if (existingOrder) {
        return res.status(200).json({
          message: "Existing order returned",
          order: existingOrder,
        });
      }
    }

    await session.startTransaction();

    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = Number(item.id);
      const quantity = Number(item.qty || item.quantity || 1);

      if (!productId || quantity <= 0) {
        throw new Error("Invalid product or quantity");
      }

      // Atomically reserve stock
      const product = await Product.findOneAndUpdate(
        {
          id: productId,
          $expr: {
            $gte: [
              { $subtract: ["$stock", { $ifNull: ["$reservedStock", 0] }] },
              quantity,
            ],
          },
        },
        {
          $inc: {
            reservedStock: quantity,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!product) {
        throw new Error(
          `Insufficient stock for product ${productId}`
        );
      }

      const price = Number(product.price);
      const lineTotal = price * quantity;

      calculatedTotal += lineTotal;

      orderItems.push({
        id: product.id,
        name: product.name,
        price: price,
        qty: quantity,
        image: product.image,
      });
    }

    // Server-side total validation
    if (
      totalAmount !== undefined &&
      Math.abs(Number(totalAmount) - calculatedTotal) > 0.01
    ) {
      throw new Error("Invalid order total");
    }

    const reservationExpiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    const order = new Order({
      customer,
      items: orderItems,
      totalAmount: calculatedTotal,
      paymentMethod,
      status: "Reserved",

      stockReserved: true,
      reservationExpiresAt,

      paymentStatus: "Pending",

      idempotencyKey: idempotencyKey || undefined,
    });

    await order.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: "Order created and stock reserved",
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Create order error:", error);

    res.status(400).json({
      message: error.message || "Order creation failed",
    });
  } finally {
    session.endSession();
  }
};


// =====================================================
// MOCK PAYMENT
// success / failure / timeout
// =====================================================
const processPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const {
      result = "success",
      paymentId,
    } = req.body;

    await session.startTransaction();

    const order = await Order.findById(id).session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    // Duplicate payment prevention
    if (order.paymentStatus === "Success") {
      await session.commitTransaction();

      return res.status(200).json({
        message: "Payment already completed",
        order,
      });
    }

    if (
      order.paymentStatus === "Failed" ||
      order.paymentStatus === "Timeout"
    ) {
      throw new Error("Payment already processed");
    }

    // Reservation expired
    if (
      order.reservationExpiresAt &&
      new Date() > new Date(order.reservationExpiresAt)
    ) {
      await releaseReservedStock(order, session);

      order.status = "Expired";
      order.paymentStatus = "Timeout";
      order.stockReserved = false;

      await order.save({ session });
      await session.commitTransaction();

      return res.status(400).json({
        message: "Stock reservation expired",
        order,
      });
    }

    // ---------------- SUCCESS ----------------
    if (result === "success") {
      for (const item of order.items) {
        const product = await Product.findOne({
          id: Number(item.id),
        }).session(session);

        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        const qty = Number(item.qty || item.quantity || 1);

        // Convert reserved stock into sold stock
        product.stock = Math.max(
          0,
          Number(product.stock || 0) - qty
        );

        product.reservedStock = Math.max(
          0,
          Number(product.reservedStock || 0) - qty
        );

        product.available = product.stock > 0;

        await product.save({ session });
      }

      order.status = "Paid";
      order.paymentStatus = "Success";
      order.paymentId =
        paymentId || `MOCK-${Date.now()}`;
      order.stockReserved = false;

      await order.save({ session });

      await session.commitTransaction();

      return res.status(200).json({
        message: "Payment successful",
        order,
      });
    }

    // ---------------- FAILURE / TIMEOUT ----------------
    if (result === "failure" || result === "timeout") {
      await releaseReservedStock(order, session);

      order.status =
        result === "timeout" ? "Expired" : "Failed";

      order.paymentStatus =
        result === "timeout" ? "Timeout" : "Failed";

      order.stockReserved = false;

      await order.save({ session });

      await session.commitTransaction();

      return res.status(200).json({
        message:
          result === "timeout"
            ? "Payment timeout"
            : "Payment failed",
        order,
      });
    }

    throw new Error("Invalid payment result");
  } catch (error) {
    await session.abortTransaction();

    console.error("Payment error:", error);

    res.status(400).json({
      message: error.message || "Payment failed",
    });
  } finally {
    session.endSession();
  }
};


// =====================================================
// RELEASE RESERVED STOCK
// =====================================================
const releaseReservedStock = async (order, session) => {
  for (const item of order.items) {
    const qty = Number(item.qty || item.quantity || 1);

    const product = await Product.findOne({
      id: Number(item.id),
    }).session(session);

    if (product) {
      product.reservedStock = Math.max(
        0,
        Number(product.reservedStock || 0) - qty
      );

      product.available =
        Number(product.stock || 0) -
          Number(product.reservedStock || 0) >
        0;

      await product.save({ session });
    }
  }
};


// =====================================================
// GET ALL ORDERS
// =====================================================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};


// =====================================================
// GET SINGLE ORDER
// =====================================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};


// =====================================================
// ORDER HISTORY
// =====================================================
const getOrderHistory = async (req, res) => {
  try {
    const email = req.params.email;

    const orders = await Order.find({
      "customer.email": email,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Order history error:", error);

    res.status(500).json({
      message: "Failed to fetch order history",
    });
  }
};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
    });
  }
};


// =====================================================
// CANCEL ORDER
// Restore stock
// =====================================================
const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const order = await Order.findById(req.params.id)
      .session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === "Cancelled") {
      await session.commitTransaction();

      return res.json({
        message: "Order already cancelled",
        order,
      });
    }

    // If stock is still reserved
    if (order.stockReserved) {
      await releaseReservedStock(order, session);
    } else {
      // Paid order: restore sold stock
      for (const item of order.items) {
        const qty = Number(item.qty || item.quantity || 1);

        const product = await Product.findOne({
          id: Number(item.id),
        }).session(session);

        if (product) {
          product.stock =
            Number(product.stock || 0) + qty;

          product.available = true;

          await product.save({ session });
        }
      }
    }

    order.status = "Cancelled";
    order.stockReserved = false;

    await order.save({ session });

    await session.commitTransaction();

    res.json({
      message: "Order cancelled and stock restored",
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Cancel error:", error);

    res.status(400).json({
      message: error.message || "Cancellation failed",
    });
  } finally {
    session.endSession();
  }
};


// =====================================================
// REFUND
// =====================================================
const refundOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.paymentStatus !== "Success") {
      return res.status(400).json({
        message: "Only successful payments can be refunded",
      });
    }

    if (order.refundStatus === "Refunded") {
      return res.json({
        message: "Already refunded",
        order,
      });
    }

    order.paymentStatus = "Refunded";
    order.refundStatus = "Refunded";
    order.status = "Cancelled";

    await order.save();

    res.json({
      message: "Refund simulated successfully",
      order,
    });
  } catch (error) {
    console.error("Refund error:", error);

    res.status(500).json({
      message: "Refund failed",
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  createOrder,
  processPayment,
  getOrders,
  getOrderById,
  getOrderHistory,
  updateOrderStatus,
  cancelOrder,
  refundOrder,
};