import { useEffect, useState } from "react";
import "../styles/orders.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((o) => (
          <div className="order-card" key={o._id}>
            <div className="order-header">
              <span>Order #{o._id.slice(-6)}</span>
              <span className={`status ${o.status.toLowerCase()}`}>
                {o.status}
              </span>
            </div>

            <div className="order-body">
              {o.items.map((i, idx) => (
                <p key={idx}>
                  {i.name} × {i.qty} — Rs. {i.price * i.qty}
                </p>
              ))}
            </div>

            <div className="order-footer">
              <p>Payment: {o.paymentMethod}</p>
              <p>Total: Rs. {o.totalAmount}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
