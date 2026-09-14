require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== MONGODB ===== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error", err));

/* ===== MODELS ===== */
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", UserSchema);

const OrderSchema = new mongoose.Schema({
  customer: Object,
  items: Array,
  totalAmount: Number,
  paymentMethod: String,
  status: { type: String, default: "Pending" }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

/* ===== TEST ===== */
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

/* ===== SIGNUP ===== */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    await User.create({ name, email, password });
    res.json({ message: "Signup success ✅" });

  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ===== LOGIN ===== */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid login" });
  res.json(user);
});

/* ===== PLACE ORDER ===== */
app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json({ message: "Order placed ✅", order });
  } catch {
    res.status(500).json({ message: "Order failed" });
  }
});

/* ===== GET ORDERS ===== */
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

/* ===== START SERVER ===== */
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on ${process.env.PORT}`)
);
