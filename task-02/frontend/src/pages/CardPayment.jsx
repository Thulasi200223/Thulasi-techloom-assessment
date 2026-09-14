import { useEffect, useState } from "react";

function CardPayment() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    card: "",
    expiry: "",
    cvv: ""
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const payNow = async () => {
    if (!form.name || !form.card || !form.cvv) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        totalAmount: total,
        paymentMethod: "Card Payment",
        customer: form
      })
    });

    localStorage.removeItem("cart");
    alert("Payment successful");
    window.location.href = "/orders";
  };

  return (
    <div className="checkout-page">
      <h2>Card Payment</h2>

      <div className="checkout-grid">
        {/* CUSTOMER + CARD */}
        <div className="checkout-card">
          <h3>Billing Details</h3>

          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />

          <h4>Card Details</h4>
          <input name="card" placeholder="Card Number" onChange={handleChange} />
          <input name="expiry" placeholder="MM/YY" onChange={handleChange} />
          <input name="cvv" placeholder="CVV" onChange={handleChange} />
        </div>

        {/* SUMMARY */}
        <div className="checkout-card">
          <h3>Order Summary</h3>

          {cart.map((i, idx) => (
            <p key={idx}>
              {i.name} × {i.qty} — Rs. {i.price * i.qty}
            </p>
          ))}

          <h4>Total: Rs. {total}</h4>
          <button onClick={payNow}>Pay Now</button>
        </div>
      </div>
    </div>
  );
}

export default CardPayment;
