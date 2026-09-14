const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

paymentMethod: {
  type: String,
  enum: ["COD", "CARD", "Cash", "Card"],
  required: true,
},

    status: {
      type: String,
      enum: [
        "Pending",
        "Reserved",
        "Processing",
        "Paid",
        "Completed",
        "Cancelled",
        "Expired",
        "Failed",
      ],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Success",
        "Failed",
        "Timeout",
        "Refunded",
      ],
      default: "Pending",
    },

paymentId: { type: String, sparse: true, default: null },
checkoutSessionId: { type: String, sparse: true, default: null },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    stockReserved: {
      type: Boolean,
      default: false,
    },

    reservationExpiresAt: {
      type: Date,
      default: null,
    },

    refundStatus: {
      type: String,
      enum: ["Not Requested", "Refunded"],
      default: "Not Requested",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ reservationExpiresAt: 1 });
orderSchema.index({ "customer.email": 1 });

module.exports = mongoose.model("Order", orderSchema);