import { useState } from "react";
import "../styles/checkout.css";

function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const [payment, setPayment] = useState("COD");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: ""
  });

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          paymentMethod: payment,
          customer: form
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      localStorage.removeItem("cart");
      alert("Order placed successfully");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="checkout-container">
      {/* LEFT */}
      <div className="checkout-left">
        <h2>Secure Checkout</h2>

        <h3>Customer Information</h3>

        <input
          type="text"
          placeholder="Full Name *"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone *"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Address *"
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="City"
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <h3>Payment Method</h3>

        <label>
          <input
            type="radio"
            checked={payment === "COD"}
            onChange={() => setPayment("COD")}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            checked={payment === "CARD"}
            onChange={() => setPayment("CARD")}
          />
          Card Payment
        </label>

        {payment === "CARD" && (
          <div className="card-box">
            <input type="text" placeholder="Card Number" />
            <input type="text" placeholder="Expiry MM/YY" />
            <input type="password" placeholder="CVV" />
          </div>
        )}

        <button className="place-order" onClick={placeOrder}>
          PLACE ORDER
        </button>
      </div>

      {/* RIGHT */}
      <div className="checkout-right">
        <h3>Order Summary</h3>

        {cart.map((item) => (
          <div className="summary-item" key={item.id}>
            <img
              src={item.image}
              alt={item.name}
            />
            <div>
              <p>{item.name}</p>
              <small>Qty: {item.qty}</small>
            </div>
            <strong>Rs. {item.price * item.qty}</strong>
          </div>
        ))}

        <hr />
        <h2>Total: Rs. {total}</h2>
      </div>
    </div>
  );
}

export default Checkout;
