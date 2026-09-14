import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Package,
} from "lucide-react";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      const itemId = item._id || item.id;

      if (itemId === id) {
        const availableStock = Number(item.stock);

        if (
          !Number.isNaN(availableStock) &&
          availableStock > 0 &&
          item.quantity >= availableStock
        ) {
          alert(`Only ${availableStock} items available in stock`);
          return item;
        }

        return {
          ...item,
          quantity: Number(item.quantity || 1) + 1,
        };
      }

      return item;
    });

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) => {
        const itemId = item._id || item.id;

        if (itemId === id) {
          return {
            ...item,
            quantity: Number(item.quantity || 1) - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => {
      const itemId = item._id || item.id;

      return itemId !== id;
    });

    updateCart(updatedCart);
  };

  const clearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (confirmed) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  const subtotal = cart.reduce((total, item) => {
    return (
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1)
    );
  }, 0);

  const totalItems = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  /* =========================
     EMPTY CART
  ========================= */

  if (cart.length === 0) {
    return (
      <div className="customer-page cart-page">

        <div className="customer-container">

          <div className="empty-cart">

            <div className="empty-cart-icon">
              <ShoppingBag size={58} />
            </div>

            <span className="page-eyebrow">
              YOUR SHOPPING BAG
            </span>

            <h2>Your Cart is Empty</h2>

            <p>
              Looks like you haven't added anything yet.
              Explore our products and find something you love.
            </p>

            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/shop")}
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =========================
     CART PAGE
  ========================= */

  return (
    <div className="customer-page cart-page">

      <div className="customer-container">

        {/* HEADER */}

        <div className="cart-header">

          <div>

            <span className="page-eyebrow">
              YOUR SHOPPING BAG
            </span>

            <h1>Shopping Cart</h1>

            <p>
              Review your items and complete your order securely.
            </p>

          </div>


          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >

            <Trash2 size={17} />

            Clear Cart

          </button>

        </div>


        {/* MAIN LAYOUT */}

        <div className="cart-layout">


          {/* =========================
              CART ITEMS
          ========================= */}

          <section className="cart-items-card">

            <div className="cart-card-header">

              <div>

                <h2>Cart Items</h2>

                <p>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}{" "}
                  in your cart
                </p>

              </div>


              <span className="cart-count">
                {cart.length}
              </span>

            </div>


            <div className="cart-items">

              {cart.map((item) => {

                const itemId =
                  item._id || item.id;

                const quantity =
                  Number(item.quantity || 1);

                const price =
                  Number(item.price || 0);

                return (

                  <div
                    className="cart-item"
                    key={itemId}
                  >


                    {/* PRODUCT IMAGE */}

                    <div className="cart-image">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : null}


                      <div className="image-placeholder">

                        <Package size={35} />

                      </div>

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="cart-item-info">

                      <span className="cart-category">

                        {item.category ||
                          "General"}

                      </span>


                      <h3>

                        {item.name}

                      </h3>


                      <p className="item-price">

                        Rs.{" "}

                        {price.toLocaleString()}

                      </p>


                      {item.stock !== undefined && (

                        <span className="stock-info">

                          {item.stock > 0
                            ? `${item.stock} available`
                            : "Stock information unavailable"}

                        </span>

                      )}

                    </div>


                    {/* QUANTITY */}

                    <div className="cart-item-actions">

                      <span className="quantity-label">

                        Quantity

                      </span>


                      <div className="quantity-control">

                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            decreaseQuantity(
                              itemId
                            )
                          }
                        >

                          <Minus size={16} />

                        </button>


                        <span>

                          {quantity}

                        </span>


                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            increaseQuantity(
                              itemId
                            )
                          }
                        >

                          <Plus size={16} />

                        </button>

                      </div>


                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeItem(itemId)
                        }
                      >

                        <Trash2 size={16} />

                        Remove

                      </button>

                    </div>


                    {/* TOTAL */}

                    <div className="cart-item-total">

                      <span>
                        Item Total
                      </span>


                      <strong>

                        Rs.{" "}

                        {(
                          price * quantity
                        ).toLocaleString()}

                      </strong>

                    </div>

                  </div>

                );

              })}

            </div>


            {/* CONTINUE SHOPPING */}

            <button
              className="continue-shopping-link"
              onClick={() =>
                navigate("/shop")
              }
            >

              <ArrowLeft size={17} />

              Continue Shopping

            </button>

          </section>


          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <aside className="cart-summary">

            <span className="page-eyebrow">
              ORDER SUMMARY
            </span>


            <h2>
              Order Details
            </h2>


            <div className="summary-divider" />


            <div className="summary-row">

              <span>
                Items ({totalItems})
              </span>


              <strong>

                Rs.{" "}

                {subtotal.toLocaleString()}

              </strong>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>


              <strong className="free-text">
                FREE
              </strong>

            </div>


            <div className="summary-divider" />


            <div className="summary-total">

              <span>
                Total Amount
              </span>


              <strong>

                Rs.{" "}

                {subtotal.toLocaleString()}

              </strong>

            </div>


            {/* CHECKOUT */}

            <button
              className="proceed-checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >

              Proceed to Checkout

              <span>
                →
              </span>

            </button>


            {/* SECURITY */}

            <div className="secure-order">

              <ShieldCheck size={20} />


              <p>

                Secure order processing.
                Your information is protected.

              </p>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Cart;