import { useEffect, useMemo, useState } from "react";
import {
  Package,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  TrendingDown
} from "lucide-react";

import { productAPI } from "../services/api";

import "./Inventory.css";


function Inventory() {

  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [refreshing, setRefreshing] = useState(false);


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const fetchProducts = async () => {

    try {

      setError("");

      const response =
        await productAPI.getAll();

      setProducts(
        response.products || []
      );

    } catch (err) {

      console.error(
        "Inventory fetch error:",
        err
      );

      setError(
        err.message ||
        "Failed to load inventory"
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchProducts();

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await fetchProducts();

  };


  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {

      const name =
        String(product.name || "")
          .toLowerCase();

      const category =
        String(product.category || "")
          .toLowerCase();

      return (
        name.includes(keyword) ||
        category.includes(keyword)
      );

    });

  }, [products, search]);


  // =====================================================
  // INVENTORY STATISTICS
  // =====================================================

  const totalProducts =
    products.length;


  const totalStock =
    products.reduce(
      (sum, product) =>
        sum +
        Number(product.stock || 0),
      0
    );


  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 10
    ).length;


  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) <= 0
    ).length;


  // =====================================================
  // STOCK STATUS
  // =====================================================

  const getStockStatus = (stock) => {

    const quantity =
      Number(stock || 0);

    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className: "inventory-status-out",
        icon: <AlertTriangle size={14} />
      };
    }

    if (quantity <= 10) {
      return {
        label: "Low Stock",
        className: "inventory-status-low",
        icon: <TrendingDown size={14} />
      };
    }

    return {
      label: "In Stock",
      className: "inventory-status-good",
      icon: <CheckCircle2 size={14} />
    };

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="inventory-page">

        <div className="inventory-loading">

          <RefreshCw
            size={28}
            className="inventory-spinner"
          />

          <p>
            Loading inventory...
          </p>

        </div>

      </div>
    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="inventory-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="inventory-page-header">

        <div>

          <div className="inventory-breadcrumb">
            POSFLOW / INVENTORY
          </div>

          <h1>
            Inventory
          </h1>

          <p>
            Monitor current stock levels and
            product availability.
          </p>

        </div>


        <button
          className="inventory-refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "inventory-spinner"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="inventory-error">

          <AlertTriangle size={18} />

          <span>
            {error}
          </span>

          <button
            onClick={fetchProducts}
          >
            Try Again
          </button>

        </div>

      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="inventory-stats">

        <div className="inventory-stat-card">

          <div className="inventory-stat-icon purple">
            <Package size={21} />
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>
          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon blue">
            <Boxes size={21} />
          </div>

          <div>
            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>
          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon orange">
            <TrendingDown size={21} />
          </div>

          <div>
            <span>
              Low Stock
            </span>

            <strong>
              {lowStockProducts}
            </strong>
          </div>

        </div>


        <div className="inventory-stat-card">

          <div className="inventory-stat-icon red">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>
              Out of Stock
            </span>

            <strong>
              {outOfStockProducts}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          INVENTORY TABLE CARD
      ================================================= */}

      <div className="inventory-card">

        <div className="inventory-card-header">

          <div>

            <h2>
              Stock Overview
            </h2>

            <p>
              Current stock level for every product
            </p>

          </div>


          <div className="inventory-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

        </div>


        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredProducts.length === 0 ? (

          <div className="inventory-empty">

            <Package size={42} />

            <h3>
              No products found
            </h3>

            <p>
              Try a different search term.
            </p>

          </div>

        ) : (

          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Available Stock
                  </th>

                  <th>
                    Reserved
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.map(
                  (product) => {

                    const stock =
                      Number(
                        product.stock || 0
                      );

                    const reserved =
                      Number(
                        product.reservedStock || 0
                      );

                    const status =
                      getStockStatus(stock);


                    return (

                      <tr
                        key={
                          product._id ||
                          product.id
                        }
                      >

                        <td>

                          <div className="inventory-product">

                            <div className="inventory-product-image">

                              {product.image ? (

                                <img
                                  src={product.image}
                                  alt={product.name}
                                />

                              ) : (

                                <Package
                                  size={22}
                                />

                              )}

                            </div>


                            <div>

                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                ID:{" "}
                                {product.id ||
                                  product._id}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="inventory-category">

                            {product.category ||
                              "General"}

                          </span>

                        </td>


                        <td>

                          <strong>
                            Rs.{" "}
                            {Number(
                              product.price || 0
                            ).toLocaleString()}
                          </strong>

                        </td>


                        <td>

                          <strong
                            className={
                              stock <= 0
                                ? "stock-number stock-zero"
                                : stock <= 10
                                ? "stock-number stock-low"
                                : "stock-number"
                            }
                          >
                            {stock}
                          </strong>

                        </td>


                        <td>

                          <span className="reserved-number">
                            {reserved}
                          </span>

                        </td>


                        <td>

                          <span
                            className={`inventory-status ${status.className}`}
                          >

                            {status.icon}

                            {status.label}

                          </span>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}


export default Inventory;