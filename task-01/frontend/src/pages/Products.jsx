import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Package,
  Trash2,
  RefreshCw,
  X,
  Pencil,
} from "lucide-react";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  // =========================
  // GET PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://thulasi-techloom-assessment-zmzi.vercel.app/api/products"
      );

      const productData = response.data.products || [];

      setProducts(productData);
      setFilteredProducts(productData);

    } catch (err) {
      console.error(err);

      setError(
        "Unable to load products. Please make sure the backend server is running."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  // =========================
  // SEARCH PRODUCTS
  // =========================

  useEffect(() => {

    const result = products.filter((product) => {

      const productName =
        product.name?.toLowerCase() || "";

      const productCategory =
        product.category?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();

      return (
        productName.includes(searchText) ||
        productCategory.includes(searchText)
      );

    });

    setFilteredProducts(result);

  }, [search, products]);


  // =========================
  // HANDLE FORM INPUT
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  };


  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {

    setEditingProduct(null);

    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    });

    setShowModal(true);

  };


  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (product) => {

    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      description: product.description || "",
    });

    setShowModal(true);

  };


  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {

    setShowModal(false);

    setEditingProduct(null);

    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    });

  };


  // =========================
  // CREATE / UPDATE PRODUCT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };


      // UPDATE PRODUCT

      if (editingProduct) {

        await axios.put(
          `https://thulasi-techloom-assessment-zmzi.vercel.app/api/products/${editingProduct._id}`,
          productData
        );

      }

      // CREATE PRODUCT

      else {

        await axios.post(
          "https://thulasi-techloom-assessment-zmzi.vercel.app/api/products",
          productData
        );

      }


      closeModal();

      fetchProducts();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to save product"
      );

    }

  };


  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `https://thulasi-techloom-assessment-zmzi.vercel.app/api/products/${id}`
      );

      fetchProducts();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to delete product"
      );

    }

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="page-loading">

        <div className="spinner"></div>

        <p>Loading products...</p>

      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (

      <div className="dashboard-error">

        <Package size={28} />

        <div>

          <h3>Connection Error</h3>

          <p>{error}</p>

          <button onClick={fetchProducts}>
            Try Again
          </button>

        </div>

      </div>

    );

  }


  return (

    <div className="products-page">


      {/* =====================
          PAGE HEADER
      ===================== */}

      <div className="page-header">

        <div>

          <p className="page-label">
            PRODUCT MANAGEMENT
          </p>

          <h2>Products</h2>

          <p className="page-subtitle">
            Manage your store products and inventory.
          </p>

        </div>


        <button
          className="primary-action-button"
          onClick={openAddModal}
        >

          <Plus size={18} />

          Add Product

        </button>

      </div>



      {/* =====================
          TOOLBAR
      ===================== */}

      <div className="products-toolbar">


        {/* SEARCH */}

        <div className="products-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by product or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* REFRESH */}

        <button
          className="refresh-products-button"
          onClick={fetchProducts}
        >

          <RefreshCw size={18} />

          Refresh

        </button>

      </div>



      {/* =====================
          SUMMARY
      ===================== */}

      <div className="products-summary">

        <span>
          Showing{" "}
          <strong>
            {filteredProducts.length}
          </strong>{" "}
          products
        </span>


        <span>
          Total Products:{" "}
          <strong>
            {products.length}
          </strong>
        </span>

      </div>



      {/* =====================
          PRODUCTS GRID
      ===================== */}

      {filteredProducts.length === 0 ? (

        <div className="products-empty">

          <Package size={50} />

          <h3>No products found</h3>

          <p>
            Add a product or try a different search.
          </p>

          <button
            className="primary-action-button"
            onClick={openAddModal}
          >

            <Plus size={17} />

            Add Your First Product

          </button>

        </div>

      ) : (

        <div className="products-grid">

          {filteredProducts.map((product) => (

            <div
              className="product-card"
              key={product._id}
            >


              {/* PRODUCT TOP */}

              <div className="product-card-top">


                <div className="product-card-icon">

                  <Package size={25} />

                </div>


                <div className="product-card-actions">


                  {/* EDIT */}

                  <button
                    className="edit-product-button"
                    onClick={() =>
                      openEditModal(product)
                    }
                    title="Edit Product"
                  >

                    <Pencil size={16} />

                  </button>


                  {/* DELETE */}

                  <button
                    className="delete-product-button"
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                    title="Delete Product"
                  >

                    <Trash2 size={17} />

                  </button>

                </div>

              </div>



              {/* PRODUCT INFORMATION */}

              <div className="product-card-info">


                <span className="product-category">

                  {product.category ||
                    "Uncategorized"}

                </span>


                <h3>

                  {product.name}

                </h3>


                <p>

                  {product.description ||
                    "No description available."}

                </p>

              </div>



              {/* PRODUCT FOOTER */}

              <div className="product-card-footer">


                <div>

                  <span>Price</span>

                  <strong>

                    Rs.{" "}

                    {Number(
                      product.price || 0
                    ).toLocaleString()}

                  </strong>

                </div>



                <div className="product-stock">

                  <span>Stock</span>

                  <strong
                    className={
                      product.stock <= 10
                        ? "low-stock-text"
                        : ""
                    }
                  >

                    {product.stock}

                  </strong>

                </div>


              </div>


            </div>

          ))}

        </div>

      )}



      {/* =====================
          ADD / EDIT MODAL
      ===================== */}

      {showModal && (

        <div className="modal-overlay">

          <div className="product-modal">


            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <p>
                  PRODUCT MANAGEMENT
                </p>

                <h3>

                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}

                </h3>

              </div>


              <button
                className="modal-close-button"
                onClick={closeModal}
              >

                <X size={20} />

              </button>

            </div>



            {/* FORM */}

            <form onSubmit={handleSubmit}>


              {/* PRODUCT NAME */}

              <div className="form-group">

                <label>
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>



              {/* PRICE + STOCK */}

              <div className="form-row">


                <div className="form-group">

                  <label>
                    Price (Rs.) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                  />

                </div>



                <div className="form-group">

                  <label>
                    Stock Quantity *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                  />

                </div>


              </div>



              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  placeholder="Example: Electronics"
                  value={formData.category}
                  onChange={handleChange}
                />

              </div>



              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter product description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />

              </div>



              {/* ACTIONS */}

              <div className="modal-actions">


                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="primary-action-button"
                >

                  {editingProduct
                    ? (
                      <>
                        <Pencil size={17} />
                        Update Product
                      </>
                    )
                    : (
                      <>
                        <Plus size={17} />
                        Add Product
                      </>
                    )}

                </button>


              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );
}

export default Products;