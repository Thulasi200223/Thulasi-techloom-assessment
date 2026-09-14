import { useEffect, useState } from "react";
import "../styles/admin.css";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  /* 🔐 PROTECT ADMIN ROUTE */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  /* 📦 FETCH ORDERS */
  useEffect(() => {
    fetch("http://localhost:5001/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Orders fetch error:", err));
  }, []);

  /* 🔄 UPDATE ORDER STATUS */
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5001/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status } : order
      )
    );
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Orders management here</p>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total (Rs.)</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order._id.slice(-6)}</td>

                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.name} × {item.qty}
                    </div>
                  ))}
                </td>

                <td>{order.totalAmount}</td>
                <td>{order.paymentMethod}</td>

                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
