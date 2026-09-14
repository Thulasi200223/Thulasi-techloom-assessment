const express = require("express");
const router = express.Router();

const {
  createOrder,
  processPayment,
  getOrders,
  getOrderById,
  getOrderHistory,
  updateOrderStatus,
  cancelOrder,
  refundOrder,
} = require("../controllers/order.controller");

// Create order + reserve stock
router.post("/", createOrder);

// Mock payment
router.post("/:id/payment", processPayment);

// Get all orders
router.get("/", getOrders);

// Get order history by email
router.get("/history/:email", getOrderHistory);

// Get single order
router.get("/:id", getOrderById);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Cancel order
router.post("/:id/cancel", cancelOrder);
router.put("/:id/cancel", cancelOrder);

// Refund order
router.post("/:id/refund", refundOrder);
router.put("/:id/refund", refundOrder);

module.exports = router;