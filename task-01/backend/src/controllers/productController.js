const mongoose = require("mongoose");

const Product = require("../models/Product");


/* =====================================================
   CREATE PRODUCT
   POST /api/products
===================================================== */

const createProduct = async (req, res) => {

  try {

    const {
      name,
      description,
      price,
      stock,
      category,
      image
    } = req.body;


    /* ================================================
       CREATE PRODUCT
    ================================================= */

    const product = await Product.create({

      name,

      description,

      price,

      stock,

      category,

      image

    });


    res.status(201).json({

      success: true,

      message:
        "Product created successfully",

      product

    });


  } catch (error) {


    /* ================================================
       VALIDATION ERROR
    ================================================= */

    if (error.name === "ValidationError") {

      return res.status(400).json({

        success: false,

        message:
          Object.values(error.errors)
            .map((item) => item.message)
            .join(", ")

      });

    }


    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


/* =====================================================
   GET ALL PRODUCTS
   GET /api/products
===================================================== */

const getProducts = async (req, res) => {

  try {

    const products =
      await Product.find()
        .sort({

          createdAt: -1

        });


    res.status(200).json({

      success: true,

      count:
        products.length,

      products

    });


  } catch (error) {


    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


/* =====================================================
   GET SINGLE PRODUCT
   GET /api/products/:id
===================================================== */

const getProductById = async (req, res) => {

  try {


    /* ================================================
       VALIDATE MONGODB ID
    ================================================= */

    if (

      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid product ID"

      });

    }


    const product =
      await Product.findById(
        req.params.id
      );


    /* ================================================
       PRODUCT NOT FOUND
    ================================================= */

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product not found"

      });

    }


    res.status(200).json({

      success: true,

      product

    });


  } catch (error) {


    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


/* =====================================================
   UPDATE PRODUCT
   PUT /api/products/:id
===================================================== */

const updateProduct = async (req, res) => {

  try {


    /* ================================================
       VALIDATE MONGODB ID
    ================================================= */

    if (

      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid product ID"

      });

    }


    /* ================================================
       ALLOWED FIELDS

       Prevent updating unwanted fields.
    ================================================= */

    const allowedFields = [

      "name",

      "description",

      "price",

      "stock",

      "category",

      "image"

    ];


    const updateData = {};


    allowedFields.forEach((field) => {

      if (

        req.body[field] !== undefined

      ) {

        updateData[field] =
          req.body[field];

      }

    });


    /* ================================================
       UPDATE PRODUCT
    ================================================= */

    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        updateData,

        {

          new: true,

          runValidators: true

        }

      );


    /* ================================================
       PRODUCT NOT FOUND
    ================================================= */

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product not found"

      });

    }


    res.status(200).json({

      success: true,

      message:
        "Product updated successfully",

      product

    });


  } catch (error) {


    /* ================================================
       VALIDATION ERROR
    ================================================= */

    if (error.name === "ValidationError") {

      return res.status(400).json({

        success: false,

        message:

          Object.values(
            error.errors
          )

            .map(
              (item) =>
                item.message
            )

            .join(", ")

      });

    }


    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


/* =====================================================
   DELETE PRODUCT
   DELETE /api/products/:id
===================================================== */

const deleteProduct = async (req, res) => {

  try {


    /* ================================================
       VALIDATE MONGODB ID
    ================================================= */

    if (

      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid product ID"

      });

    }


    /* ================================================
       DELETE PRODUCT
    ================================================= */

    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );


    /* ================================================
       PRODUCT NOT FOUND
    ================================================= */

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product not found"

      });

    }


    res.status(200).json({

      success: true,

      message:
        "Product deleted successfully"

    });


  } catch (error) {


    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


/* =====================================================
   EXPORT CONTROLLERS
===================================================== */

module.exports = {

  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct

};