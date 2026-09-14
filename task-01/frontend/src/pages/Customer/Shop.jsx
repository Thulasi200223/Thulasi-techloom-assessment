import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Shop() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH PRODUCTS FROM BACKEND
  // ==============================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5001/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      const productData = data.products || [];

      setProducts(productData);
      setFilteredProducts(productData);

    } catch (err) {
      console.error("Error fetching products:", err);

      setError(
        "Unable to load products. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // LOAD PRODUCTS
  // ==============================

  useEffect(() => {
    fetchProducts();
  }, []);


  // ==============================
  // SEARCH PRODUCTS
  // ==============================

  useEffect(() => {
    const searchText = search.toLowerCase().trim();

    const searchResults = products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      return (
        productName.includes(searchText) ||
        category.includes(searchText)
      );
    });

    setFilteredProducts(searchResults);

  }, [search, products]);


  // ==============================
  // ADD PRODUCT TO CART
  // ==============================

  const addToCart = (product) => {

    if (product.stock <= 0) {
      alert("Sorry! This product is out of stock.");
      return;
    }


    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];


    const existingProduct = existingCart.find(
      (item) => item._id === product._id
    );


    let updatedCart;


    // PRODUCT ALREADY EXISTS
    if (existingProduct) {

      if (
        existingProduct.quantity >= product.stock
      ) {

        alert(
          `Only ${product.stock} item(s) available in stock.`
        );

        return;
      }


      updatedCart = existingCart.map((item) => {

        if (item._id === product._id) {

          return {
            ...item,
            quantity: item.quantity + 1,
          };

        }

        return item;

      });

    }

    // NEW PRODUCT
    else {

      updatedCart = [

        ...existingCart,

        {
          _id: product._id,
          name: product.name,
          price: Number(product.price),
          stock: Number(product.stock),
          category:
            product.category || "General",
          image: product.image || "",
          quantity: 1,
        },

      ];

    }


    // SAVE CART
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );


    alert(
      `${product.name} added to cart! 🛒`
    );

  };


  return (

    <div className="customer-page shop-page">

      <div className="customer-container">


        {/* =========================
            SHOP HEADER
        ========================= */}

        <div className="shop-header">

          <div className="shop-header-content">

            <span className="page-eyebrow">
              EXPLORE OUR STORE
            </span>


            <h1>
              Discover Amazing Products
            </h1>


            <p>
              Browse our collection and find what you need.
            </p>

          </div>


          <button
            className="view-cart-top-btn"
            onClick={() => navigate("/cart")}
          >
            🛒 View Cart
          </button>

        </div>



        {/* =========================
            SEARCH TOOLBAR
        ========================= */}

        <div className="shop-toolbar">


          <div className="shop-search">

            <span className="search-icon">
              🔍
            </span>


            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="product-count">

            {filteredProducts.length}

            {" "}

            {filteredProducts.length === 1
              ? "Product"
              : "Products"
            }

          </div>

        </div>



        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <div className="shop-message">

            <div className="loader"></div>


            <p>
              Loading amazing products...
            </p>

          </div>

        )}



        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (

          <div className="shop-message error-message">


            <div className="message-icon">
              ⚠️
            </div>


            <h2>
              Unable to Load Products
            </h2>


            <p>
              {error}
            </p>


            <button
              className="retry-btn"
              onClick={fetchProducts}
            >
              Try Again
            </button>


          </div>

        )}



        {/* =========================
            PRODUCTS
        ========================= */}

        {!loading && !error && (

          <>

            {/* NO PRODUCTS */}

            {filteredProducts.length === 0 ? (

              <div className="shop-message">


                <div className="message-icon">
                  📦
                </div>


                <h2>
                  No Products Found
                </h2>


                <p>
                  Try searching for something else.
                </p>


              </div>

            ) : (


              /* PRODUCT GRID */

              <div className="shop-products-grid">


                {filteredProducts.map((product) => (


                  <div
                    className="shop-product-card"
                    key={product._id}
                  >


                    {/* PRODUCT IMAGE */}

                    <div className="shop-product-image">


                      {product.image ? (

                       <img
  src={
    product.image
      ? product.image.startsWith("http")
        ? product.image
        : `http://localhost:5001/${product.image}`
      : ""
  }
  alt={product.name}
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
/>

                      ) : (

                        <div className="shop-product-placeholder">

                          📦

                        </div>

                      )}


                      {/* STOCK BADGE */}

                      {product.stock <= 0 ? (

                        <span className="stock-badge out">

                          Out of Stock

                        </span>

                      ) : product.stock <= 5 ? (

                        <span className="stock-badge low">

                          Only {product.stock} left

                        </span>

                      ) : (

                        <span className="stock-badge available">

                          In Stock

                        </span>

                      )}


                    </div>



                    {/* =========================
                        PRODUCT DETAILS
                    ========================= */}

                    <div className="shop-product-info">


                      {/* CATEGORY */}

                      <span className="product-category">

                        {product.category || "General"}

                      </span>



                      {/* PRODUCT NAME */}

                      <h3>

                        {product.name}

                      </h3>



                      {/* PRICE */}

                      <div className="product-price">

                        Rs.{" "}

                        {Number(
                          product.price || 0
                        ).toLocaleString()}

                      </div>



                      {/* STOCK */}

                      <div className="product-stock">

                        Available:{" "}

                        <strong>

                          {product.stock}

                        </strong>

                      </div>



                      {/* ADD TO CART */}

                      <button

                        className="add-cart-btn"

                        disabled={
                          product.stock <= 0
                        }

                        onClick={() =>
                          addToCart(product)
                        }

                      >

                        {product.stock <= 0
                          ? "Out of Stock"
                          : "Add to Cart 🛒"
                        }

                      </button>


                    </div>


                  </div>


                ))}


              </div>


            )}


          </>

        )}


      </div>

    </div>

  );

}


export default Shop;