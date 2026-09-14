const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = require("../src/app");

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;

  console.log("MongoDB connected successfully");
}

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Backend error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};