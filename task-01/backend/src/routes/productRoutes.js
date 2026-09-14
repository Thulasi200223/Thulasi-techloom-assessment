const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");


/* =====================================================
   CREATE PRODUCT
   POST /api/products
===================================================== */

router.post(
  "/",
  createProduct
);


/* =====================================================
   GET ALL PRODUCTS
   GET /api/products
===================================================== */

router.get(
  "/",
  getProducts
);


/* =====================================================
   GET SINGLE PRODUCT
   GET /api/products/:id
===================================================== */

router.get(
  "/:id",
  getProductById
);


/* =====================================================
   UPDATE PRODUCT
   PUT /api/products/:id
===================================================== */

router.put(
  "/:id",
  updateProduct
);


/* =====================================================
   DELETE PRODUCT
   DELETE /api/products/:id
===================================================== */

router.delete(
  "/:id",
  deleteProduct
);


/* =====================================================
   EXPORT ROUTER
===================================================== */

module.exports = router;