import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    const updated = cart.map((i) =>
      i.id === id ? { ...i, qty } : i
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div className="cart-row" key={item.id}>
          {/* IMAGE */}
          <img src={item.image} alt={item.name} />

          {/* DETAILS */}
          <div className="cart-info">
            <h4>{item.name}</h4>
            <p className="unit">Rs. {item.price}</p>

            <div className="cart-actions">
              <div className="qty">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>

              <p className="line-total">
                Rs. {item.price * item.qty}
              </p>

              <button
                className="remove"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Total: Rs. {total}</h3>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
