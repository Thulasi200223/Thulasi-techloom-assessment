import { useEffect, useState } from "react";

function COD() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        totalAmount: total,
        paymentMethod: "Cash on Delivery",
        customer: form
      })
    });

    localStorage.removeItem("cart");
    alert("Order placed successfully (COD)");
    window.location.href = "/orders";
  };

  return (
    <div className="checkout-page">
      <h2>Cash on Delivery</h2>

      <div className="checkout-grid">
        {/* CUSTOMER DETAILS */}
        <div className="checkout-card">
          <h3>Delivery Details</h3>

          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />
        </div>

        {/* ORDER SUMMARY */}
        <div className="checkout-card">
          <h3>Order Summary</h3>

          {cart.map((i, idx) => (
            <p key={idx}>
              {i.name} × {i.qty} — Rs. {i.price * i.qty}
            </p>
          ))}

          <h4>Total: Rs. {total}</h4>
          <button onClick={placeOrder}>Confirm Order</button>
        </div>
      </div>
    </div>
  );
}

export default COD;
