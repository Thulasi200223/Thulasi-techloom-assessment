const Product = require("../models/Product");

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// GET single product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;

    // Numeric ID: 43, 46, etc.
    if (!Number.isNaN(Number(id))) {
      product = await Product.findOne({
        id: Number(id),
      });
    }

    // MongoDB ObjectId fallback
    if (!product && /^[0-9a-fA-F]{24}$/.test(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        message: `Product not found: ${id}`,
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

// CREATE product
const createProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const product = await Product.create({
      id,
      name,
      description,
      price,
      category,
      image,
      stock: stock ?? 0,
      reservedStock: 0,
      available: (stock ?? 0) > 0,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;

    if (!Number.isNaN(Number(id))) {
      product = await Product.findOne({
        id: Number(id),
      });
    }

    if (!product && /^[0-9a-fA-F]{24}$/.test(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        message: `Product not found: ${id}`,
      });
    }

    Object.assign(product, req.body);

    if (product.stock !== undefined) {
      product.available = product.stock > 0;
    }

    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;

    if (!Number.isNaN(Number(id))) {
      product = await Product.findOne({
        id: Number(id),
      });
    }

    if (!product && /^[0-9a-fA-F]{24}$/.test(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        message: `Product not found: ${id}`,
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};