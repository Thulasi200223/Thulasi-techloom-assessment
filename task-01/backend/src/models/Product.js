const mongoose = require("mongoose");


/* =====================================================
   PRODUCT SCHEMA
===================================================== */

const productSchema = new mongoose.Schema(

  {

    /* =================================================
       PRODUCT NAME
    ================================================= */

    name: {

      type: String,

      required: [
        true,
        "Product name is required"
      ],

      trim: true,

      minlength: [
        2,
        "Product name must be at least 2 characters"
      ],

      maxlength: [
        100,
        "Product name cannot exceed 100 characters"
      ]

    },


    /* =================================================
       DESCRIPTION
    ================================================= */

    description: {

      type: String,

      default: "",

      trim: true,

      maxlength: [
        1000,
        "Description cannot exceed 1000 characters"
      ]

    },


    /* =================================================
       PRICE
    ================================================= */

    price: {

      type: Number,

      required: [
        true,
        "Product price is required"
      ],

      min: [
        0,
        "Product price cannot be negative"
      ]

    },


    /* =================================================
       STOCK
    ================================================= */

    stock: {

      type: Number,

      required: true,

      default: 0,

      min: [
        0,
        "Stock cannot be negative"
      ],

      validate: {

        validator: Number.isInteger,

        message:
          "Stock must be a whole number"

      }

    },


    /* =================================================
       CATEGORY
    ================================================= */

    category: {

      type: String,

      default: "General",

      trim: true,

      maxlength: [
        50,
        "Category cannot exceed 50 characters"
      ]

    },


    /* =================================================
       PRODUCT IMAGE URL
    ================================================= */

    image: {

      type: String,

      default: "",

      trim: true

    }

  },


  /* ===================================================
     OPTIONS
  =================================================== */

  {

    timestamps: true

  }

);


/* =====================================================
   PRODUCT MODEL
===================================================== */

const Product = mongoose.model(

  "Product",

  productSchema

);


/* =====================================================
   EXPORT
===================================================== */

module.exports = Product;