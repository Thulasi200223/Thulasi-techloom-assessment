const express = require("express");

const router = express.Router();

const {
  createOrder,
  processPayment,
  cancelOrder,
  getOrders,
  getOrderById
} = require("../controllers/orderController");


/* ==========================================
   CREATE ORDER
   POST /api/orders
========================================== */

router.post(
  "/",
  createOrder
);


/* ==========================================
   PROCESS PAYMENT
   POST /api/orders/:id/payment
========================================== */

router.post(
  "/:id/payment",
  processPayment
);


/* ==========================================
   CANCEL ORDER
   POST /api/orders/:id/cancel
========================================== */

router.post(
  "/:id/cancel",
  cancelOrder
);


/* ==========================================
   GET ALL ORDERS
   GET /api/orders
========================================== */

router.get(
  "/",
  getOrders
);


/* ==========================================
   GET SINGLE ORDER
   GET /api/orders/:id
========================================== */

router.get(
  "/:id",
  getOrderById
);


/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;