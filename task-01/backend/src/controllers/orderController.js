const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");


/* =====================================================
   CONSTANTS
===================================================== */

const RESERVATION_DURATION_MS = 5 * 60 * 1000;


/* =====================================================
   CUSTOM ERROR
===================================================== */

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);

    this.statusCode = statusCode;
  }
}


/* =====================================================
   VALIDATE MONGODB ID
===================================================== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


/* =====================================================
   VALIDATE CUSTOMER
===================================================== */

const validateCustomer = (customer) => {
  if (!customer) {
    throw new AppError(
      "Customer information is required",
      400
    );
  }

  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "city",
    "address"
  ];

  for (const field of requiredFields) {
    if (
      !customer[field] ||
      typeof customer[field] !== "string" ||
      customer[field].trim() === ""
    ) {
      throw new AppError(
        `Customer ${field} is required`,
        400
      );
    }
  }
};


/* =====================================================
   VALIDATE PAYMENT METHOD
===================================================== */

const validatePaymentMethod = (paymentMethod) => {
  const allowedMethods = [
    "Cash",
    "Card"
  ];

  if (
    !allowedMethods.includes(paymentMethod)
  ) {
    throw new AppError(
      "Invalid payment method. Use Cash or Card",
      400
    );
  }
};


/* =====================================================
   VALIDATE PAYMENT OUTCOME
===================================================== */

const validatePaymentOutcome = (outcome) => {
  const allowedOutcomes = [
    "success",
    "failed",
    "timeout"
  ];

  if (
    !allowedOutcomes.includes(outcome)
  ) {
    throw new AppError(
      "Invalid payment outcome",
      400
    );
  }
};


/* =====================================================
   COMBINE DUPLICATE PRODUCTS

   Example:

   Input:

   [
     { product: "ABC", quantity: 2 },
     { product: "ABC", quantity: 3 }
   ]

   Output:

   [
     { product: "ABC", quantity: 5 }
   ]
===================================================== */

const combineOrderItems = (items) => {
  if (!Array.isArray(items)) {
    throw new AppError(
      "Items must be an array",
      400
    );
  }

  if (items.length === 0) {
    throw new AppError(
      "Order must contain at least one product",
      400
    );
  }


  const combinedItems = new Map();


  for (const item of items) {

    if (!item) {
      throw new AppError(
        "Invalid order item",
        400
      );
    }


    const {
      product,
      quantity
    } = item;


    if (!product) {
      throw new AppError(
        "Product ID is required",
        400
      );
    }


    if (!isValidObjectId(product)) {
      throw new AppError(
        `Invalid product ID: ${product}`,
        400
      );
    }


    const parsedQuantity =
      Number(quantity);


    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      throw new AppError(
        "Quantity must be a positive integer",
        400
      );
    }


    const productId =
      product.toString();


    if (
      combinedItems.has(productId)
    ) {

      combinedItems.set(
        productId,

        combinedItems.get(productId) +
        parsedQuantity
      );

    } else {

      combinedItems.set(
        productId,
        parsedQuantity
      );

    }

  }


  return Array.from(
    combinedItems.entries()
  ).map(

    ([product, quantity]) => ({

      product,
      quantity

    })

  );
};


/* =====================================================
   RESTORE ORDER STOCK

   This function is called inside
   an existing MongoDB transaction.
===================================================== */

const restoreOrderStock = async (
  order,
  session
) => {

  for (
    const item of order.items
  ) {

    const product =
      await Product.findByIdAndUpdate(

        item.product,

        {
          $inc: {
            stock: Number(
              item.quantity
            )
          }
        },

        {
          new: true,
          session
        }

      );


    /*
      If product was deleted,
      transaction will still keep
      order history intact.

      We do not throw an error here
      because the product may have
      been deleted after order creation.
    */

    if (!product) {

      console.warn(
        `Product ${item.product} not found while restoring stock`
      );

    }

  }

};


/* =====================================================
   CREATE ORDER

   FLOW:

   1. Validate request
   2. Combine duplicate products
   3. Start transaction
   4. Atomically reserve stock
   5. Calculate total using DB price
   6. Create Reserved order
   7. Commit transaction

   CONCURRENCY SAFETY:

   Product stock is decremented using:

   stock >= requested quantity

   inside findOneAndUpdate.

   This prevents overselling during
   simultaneous purchase requests.
===================================================== */

const createOrder = async (
  req,
  res
) => {

  let session;


  try {

    const {
      items,
      paymentMethod,
      customer
    } = req.body;


    /* ==========================================
       VALIDATE PAYMENT METHOD
    ========================================== */

    validatePaymentMethod(
      paymentMethod
    );


    /* ==========================================
       VALIDATE CUSTOMER
    ========================================== */

    validateCustomer(
      customer
    );


    /* ==========================================
       VALIDATE AND COMBINE ITEMS
    ========================================== */

    const combinedItems =
      combineOrderItems(items);


    /* ==========================================
       START SESSION
    ========================================== */

    session =
      await mongoose.startSession();


    let createdOrder;


    /* ==========================================
       START TRANSACTION
    ========================================== */

    await session.withTransaction(
      async () => {


        let totalAmount = 0;


        const orderItems = [];


        /* ======================================
           PROCESS EACH PRODUCT
        ====================================== */

        for (
          const item of combinedItems
        ) {


          /*
             ATOMIC STOCK RESERVATION

             This query succeeds ONLY when:

             product exists
             AND
             stock >= requested quantity

             This is important for
             simultaneous requests.
          */

          const product =
            await Product.findOneAndUpdate(

              {
                _id: item.product,

                stock: {
                  $gte: item.quantity
                }
              },

              {
                $inc: {
                  stock:
                    -item.quantity
                }
              },

              {
                new: true,
                session
              }

            );


          /* ====================================
             STOCK / PRODUCT VALIDATION
          ==================================== */

          if (!product) {


            /*
               Check whether product exists.

               This gives a better error
               message to the frontend.
            */

            const existingProduct =
              await Product.findById(
                item.product
              ).session(session);


            if (!existingProduct) {

              throw new AppError(
                `Product not found: ${item.product}`,
                404
              );

            }


            throw new AppError(
              `Insufficient stock for ${existingProduct.name}`,
              400
            );

          }


          /* ====================================
             SERVER-SIDE PRICE
          ==================================== */

          const productPrice =
            Number(product.price);


          const quantity =
            Number(item.quantity);


          /* ====================================
             CALCULATE TOTAL
          ==================================== */

          totalAmount +=
            productPrice * quantity;


          /* ====================================
             ADD ORDER ITEM
          ==================================== */

          orderItems.push({

            product:
              product._id,

            quantity,

            price:
              productPrice

          });

        }


        /* ======================================
           RESERVATION EXPIRY
        ====================================== */

        const reservationExpiresAt =
          new Date(

            Date.now() +
            RESERVATION_DURATION_MS

          );


        /* ======================================
           CREATE ORDER
        ====================================== */

        const orders =
          await Order.create(

            [

              {

                items:
                  orderItems,

                totalAmount,

                status:
                  "Reserved",

                reservationExpiresAt,

                paymentMethod,

                paymentStatus:
                  "Pending",

                customer: {

                  fullName:
                    customer.fullName.trim(),

                  email:
                    customer.email
                      .trim()
                      .toLowerCase(),

                  phone:
                    customer.phone.trim(),

                  city:
                    customer.city.trim(),

                  address:
                    customer.address.trim()

                }

              }

            ],

            {
              session
            }

          );


        createdOrder =
          orders[0];

      }

    );


    /* ==========================================
       SUCCESS RESPONSE
    ========================================== */

    return res.status(201).json({

      success: true,

      message:
        "Order created and stock reserved successfully",

      order:
        createdOrder

    });


  } catch (error) {


    console.error(
      "Create Order Error:",
      error
    );


    const statusCode =
      error.statusCode || 500;


    return res.status(
      statusCode
    ).json({

      success: false,

      message:

        statusCode === 500

          ? "Unable to create order"

          : error.message

    });


  } finally {


    if (session) {

      await session.endSession();

    }

  }

};


/* =====================================================
   PROCESS PAYMENT

   MOCK PAYMENT OUTCOMES:

   success
   failed
   timeout


   PAYMENT SUCCESS:

   Reserved -> Paid


   PAYMENT FAILED:

   Reserved -> Failed
   Stock restored


   PAYMENT TIMEOUT:

   Reserved -> Expired
   Stock restored


   DUPLICATE PAYMENT:

   Only orders with:

   paymentStatus === Pending

   can be processed.
===================================================== */

const processPayment = async (
  req,
  res
) => {

  let session;


  try {


    const {
      outcome
    } = req.body;


    /* ==========================================
       VALIDATE ORDER ID
    ========================================== */

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {

      throw new AppError(
        "Invalid order ID",
        400
      );

    }


    /* ==========================================
       VALIDATE OUTCOME
    ========================================== */

    validatePaymentOutcome(
      outcome
    );


    /* ==========================================
       START SESSION
    ========================================== */

    session =
      await mongoose.startSession();


    let responseData;


    /* ==========================================
       TRANSACTION
    ========================================== */

    await session.withTransaction(
      async () => {


        /* ======================================
           GET ORDER
        ====================================== */

        const order =
          await Order.findById(
            req.params.id
          ).session(session);


        if (!order) {

          throw new AppError(
            "Order not found",
            404
          );

        }


        /* ======================================
           PREVENT DUPLICATE PAYMENT
        ====================================== */

        if (
          order.paymentStatus !==
          "Pending"
        ) {

          throw new AppError(
            "Payment has already been processed",
            400
          );

        }


        /* ======================================
           VALID ORDER STATUS
        ====================================== */

        if (
          order.status !== "Reserved" &&
          order.status !== "Pending"
        ) {

          throw new AppError(
            `Order cannot be paid in ${order.status} status`,
            400
          );

        }


        /* ======================================
           CHECK RESERVATION EXPIRY
        ====================================== */

        const now =
          new Date();


        if (

          order.reservationExpiresAt &&

          now >
          order.reservationExpiresAt

        ) {


          /*
             Restore stock
          */

          await restoreOrderStock(
            order,
            session
          );


          /*
             Update order
          */

          order.status =
            "Expired";


          order.paymentStatus =
            "Timeout";


          order.reservationExpiresAt =
            null;


          await order.save({
            session
          });


          responseData = {

            statusCode: 400,

            success: false,

            message:
              "Order reservation has expired. Stock has been restored.",

            order

          };


          return;

        }


        /* ======================================
           PAYMENT SUCCESS
        ====================================== */

        if (
          outcome === "success"
        ) {


          order.status =
            "Paid";


          order.paymentStatus =
            "Success";


          order.reservationExpiresAt =
            null;


          await order.save({
            session
          });


          responseData = {

            statusCode: 200,

            success: true,

            message:
              "Payment successful",

            order

          };


          return;

        }


        /* ======================================
           PAYMENT FAILED
        ====================================== */

        if (
          outcome === "failed"
        ) {


          /*
             Restore stock
          */

          await restoreOrderStock(
            order,
            session
          );


          /*
             Update order
          */

          order.status =
            "Failed";


          order.paymentStatus =
            "Failed";


          order.reservationExpiresAt =
            null;


          await order.save({
            session
          });


          responseData = {

            statusCode: 200,

            success: false,

            message:
              "Payment failed. Stock has been restored.",

            order

          };


          return;

        }


        /* ======================================
           PAYMENT TIMEOUT
        ====================================== */

        if (
          outcome === "timeout"
        ) {


          /*
             Restore stock
          */

          await restoreOrderStock(
            order,
            session
          );


          /*
             Update order
          */

          order.status =
            "Expired";


          order.paymentStatus =
            "Timeout";


          order.reservationExpiresAt =
            null;


          await order.save({
            session
          });


          responseData = {

            statusCode: 200,

            success: false,

            message:
              "Payment timed out. Stock has been restored.",

            order

          };


        }

      }

    );


    /* ==========================================
       RESPONSE
    ========================================== */

    return res.status(
      responseData.statusCode
    ).json({

      success:
        responseData.success,

      message:
        responseData.message,

      order:
        responseData.order

    });


  } catch (error) {


    console.error(
      "Payment Error:",
      error
    );


    const statusCode =
      error.statusCode || 500;


    return res.status(
      statusCode
    ).json({

      success: false,

      message:

        statusCode === 500

          ? "Unable to process payment"

          : error.message

    });


  } finally {


    if (session) {

      await session.endSession();

    }

  }

};


/* =====================================================
   CANCEL ORDER

   ALLOWED:

   Pending
   Reserved


   NOT ALLOWED:

   Paid
   Cancelled
   Expired
   Failed


   WHEN CANCELLED:

   Stock is restored.
===================================================== */

const cancelOrder = async (
  req,
  res
) => {

  let session;


  try {


    /* ==========================================
       VALIDATE ORDER ID
    ========================================== */

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {

      throw new AppError(
        "Invalid order ID",
        400
      );

    }


    /* ==========================================
       START SESSION
    ========================================== */

    session =
      await mongoose.startSession();


    let cancelledOrder;


    /* ==========================================
       TRANSACTION
    ========================================== */

    await session.withTransaction(
      async () => {


        /* ======================================
           GET ORDER
        ====================================== */

        const order =
          await Order.findById(
            req.params.id
          ).session(session);


        if (!order) {

          throw new AppError(
            "Order not found",
            404
          );

        }


        /* ======================================
           PREVENT PAID ORDER CANCELLATION
        ====================================== */

        if (
          order.status === "Paid"
        ) {

          throw new AppError(
            "Paid order cannot be cancelled",
            400
          );

        }


        /* ======================================
           PREVENT INVALID CANCELLATION
        ====================================== */

        const invalidStatuses = [

          "Cancelled",
          "Expired",
          "Failed"

        ];


        if (
          invalidStatuses.includes(
            order.status
          )
        ) {

          throw new AppError(
            `Order cannot be cancelled because it is ${order.status}`,
            400
          );

        }


        /* ======================================
           VALIDATE CANCELLABLE STATUS
        ====================================== */

        if (

          order.status !== "Reserved" &&

          order.status !== "Pending"

        ) {

          throw new AppError(
            `Order cannot be cancelled in ${order.status} status`,
            400
          );

        }


        /* ======================================
           RESTORE STOCK
        ====================================== */

        await restoreOrderStock(
          order,
          session
        );


        /* ======================================
           UPDATE ORDER
        ====================================== */

        order.status =
          "Cancelled";


        /*
           Payment was never completed.

           Keep payment status as Pending.
        */

        order.reservationExpiresAt =
          null;


        await order.save({
          session
        });


        cancelledOrder =
          order;

      }

    );


    /* ==========================================
       SUCCESS RESPONSE
    ========================================== */

    return res.status(200).json({

      success: true,

      message:
        "Order cancelled and stock restored successfully",

      order:
        cancelledOrder

    });


  } catch (error) {


    console.error(
      "Cancel Order Error:",
      error
    );


    const statusCode =
      error.statusCode || 500;


    return res.status(
      statusCode
    ).json({

      success: false,

      message:

        statusCode === 500

          ? "Unable to cancel order"

          : error.message

    });


  } finally {


    if (session) {

      await session.endSession();

    }

  }

};


/* =====================================================
   GET ALL ORDERS
===================================================== */

const getOrders = async (
  req,
  res
) => {

  try {


    const orders =
      await Order.find()

        .populate(

          "items.product",

          "name price stock category description"

        )

        .sort({

          createdAt:
            -1

        });


    return res.status(200).json({

      success: true,

      count:
        orders.length,

      orders

    });


  } catch (error) {


    console.error(
      "Get Orders Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to retrieve orders"

    });

  }

};


/* =====================================================
   GET SINGLE ORDER
===================================================== */

const getOrderById = async (
  req,
  res
) => {

  try {


    /* ==========================================
       VALIDATE ID
    ========================================== */

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid order ID"

      });

    }


    /* ==========================================
       GET ORDER
    ========================================== */

    const order =
      await Order.findById(
        req.params.id
      )

        .populate(

          "items.product",

          "name price stock category description"

        );


    /* ==========================================
       NOT FOUND
    ========================================== */

    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found"

      });

    }


    /* ==========================================
       SUCCESS
    ========================================== */

    return res.status(200).json({

      success: true,

      order

    });


  } catch (error) {


    console.error(
      "Get Order Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to retrieve order"

    });

  }

};


/* =====================================================
   EXPORTS
===================================================== */

module.exports = {

  createOrder,

  processPayment,

  cancelOrder,

  getOrders,

  getOrderById

};