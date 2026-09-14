import { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, ordersResponse] =
        await Promise.all([
          axios.get("https://thulasi-techloom-assessment-zmzi.vercel.app/api/products"),
axios.get("https://thulasi-techloom-assessment-zmzi.vercel.app/api/orders"),
        ]);

      setProducts(productsResponse.data.products || []);
      setOrders(ordersResponse.data.orders || []);

    } catch (err) {
      console.error(err);

      setError(
        "Unable to load dashboard data. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // REAL CALCULATIONS

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + (product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) => (product.stock || 0) <= 10
  );

  const totalSales = orders.reduce(
    (total, order) => total + (order.totalAmount || 0),
    0
  );

  const totalOrders = orders.length;

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading your business data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <AlertTriangle size={28} />

        <div>
          <h3>Connection Error</h3>
          <p>{error}</p>

          <button onClick={fetchDashboardData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Welcome Section */}

      <section className="welcome-section">

        <div>
          <p className="welcome-label">
            BUSINESS OVERVIEW
          </p>

          <h2>
            Welcome back, Administrator 👋
          </h2>

          <p className="welcome-text">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="welcome-date">
          <span>LIVE DATA</span>
          <div className="live-indicator"></div>
        </div>

      </section>


      {/* Statistics */}

      <section className="stats-grid">

        {/* PRODUCTS */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="dashboard-icon purple">
              <Package size={21} />
            </div>

            <ArrowUpRight size={18} className="card-arrow" />

          </div>

          <p>Total Products</p>

          <h3>{totalProducts}</h3>

          <span className="card-description">
            Products in your catalog
          </span>

        </div>


        {/* INVENTORY */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="dashboard-icon blue">
              <Boxes size={21} />
            </div>

            <ArrowUpRight size={18} className="card-arrow" />

          </div>

          <p>Total Inventory</p>

          <h3>{totalStock}</h3>

          <span className="card-description">
            Total units available
          </span>

        </div>


        {/* ORDERS */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="dashboard-icon orange">
              <ShoppingCart size={21} />
            </div>

            <ArrowUpRight size={18} className="card-arrow" />

          </div>

          <p>Total Orders</p>

          <h3>{totalOrders}</h3>

          <span className="card-description">
            Orders processed
          </span>

        </div>


        {/* SALES */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="dashboard-icon green">
              <DollarSign size={21} />
            </div>

            <TrendingUp
              size={18}
              className="growth-icon"
            />

          </div>

          <p>Total Sales</p>

          <h3>
            Rs. {totalSales.toLocaleString()}
          </h3>

          <span className="card-description">
            Total revenue generated
          </span>

        </div>

      </section>


      {/* Dashboard Content */}

      <section className="dashboard-content-grid">

        {/* RECENT PRODUCTS */}

        <div className="dashboard-box">

          <div className="box-header">

            <div>
              <h3>Recent Products</h3>

              <p>
                Latest products from your inventory
              </p>
            </div>

            <button className="text-button">
              View all →
            </button>

          </div>


          {products.length === 0 ? (

            <div className="empty-dashboard">
              <Package size={38} />

              <h4>No products yet</h4>

              <p>
                Add your first product to get started.
              </p>
            </div>

          ) : (

            <div className="recent-products-list">

              {products.slice(0, 5).map((product) => (

                <div
                  className="recent-product-row"
                  key={product._id}
                >

                  <div className="product-initial">

                    {product.name
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>


                  <div className="recent-product-info">

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category ||
                        "Uncategorized"}
                    </span>

                  </div>


                  <div className="recent-product-price">

                    Rs.{" "}

                    {Number(
                      product.price || 0
                    ).toLocaleString()}

                  </div>


                  <span
                    className={
                      product.stock <= 10
                        ? "stock-status low"
                        : "stock-status healthy"
                    }
                  >

                    {product.stock} units

                  </span>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* LOW STOCK */}

        <div className="dashboard-box low-stock-box">

          <div className="box-header">

            <div>
              <h3>Inventory Alert</h3>

              <p>
                Products requiring attention
              </p>
            </div>

            <AlertTriangle
              size={20}
              className="alert-icon"
            />

          </div>


          <div className="low-stock-number">

            {lowStockProducts.length}

          </div>


          <p className="low-stock-description">

            product
            {lowStockProducts.length !== 1
              ? "s"
              : ""}{" "}

            currently have low stock levels.

          </p>


          <div className="low-stock-list">

            {lowStockProducts
              .slice(0, 3)
              .map((product) => (

                <div
                  className="low-stock-item"
                  key={product._id}
                >

                  <span>
                    {product.name}
                  </span>

                  <strong>
                    {product.stock} left
                  </strong>

                </div>

              ))}

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;