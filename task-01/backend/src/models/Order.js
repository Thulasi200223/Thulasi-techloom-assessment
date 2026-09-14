const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);


const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },

        message: "Order must contain at least one item"
      }
    },


    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },


    status: {
      type: String,

      enum: [
        "Pending",
        "Reserved",
        "Paid",
        "Cancelled",
        "Expired",
        "Failed"
      ],

      default: "Pending",

      index: true
    },


    reservationExpiresAt: {
      type: Date,
      default: null,

      index: true
    },


    paymentMethod: {
      type: String,

      enum: [
        "Cash",
        "Card"
      ],

      required: true
    },


    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Success",
        "Failed",
        "Timeout"
      ],

      default: "Pending"
    },


    // Prevent duplicate order submissions
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true
    },


    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      },

      city: {
        type: String,
        required: true,
        trim: true
      },

      address: {
        type: String,
        required: true,
        trim: true
      }
    }

  },

  {
    timestamps: true
  }
);


// Useful indexes
orderSchema.index({
  status: 1,
  reservationExpiresAt: 1
});


module.exports = mongoose.model(
  "Order",
  orderSchema
);