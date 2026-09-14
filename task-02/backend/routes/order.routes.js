const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ SAVE ORDER
router.post("/", async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;

    const newOrder = new Order({
      items,
      totalAmount,
      paymentMethod
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Order save failed" });
  }
});

module.exports = router;
