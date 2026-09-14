import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  ShoppingBag,
  CheckCircle,
  Loader2,
} from "lucide-react";


function Checkout() {

  const navigate = useNavigate();


  /* ============================= */
  /* CART */
  /* ============================= */

  const [cart, setCart] = useState(() => {

    try {

      return JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    } catch {

      return [];

    }

  });


  /* ============================= */
  /* CUSTOMER DETAILS */
  /* ============================= */

  const [customer, setCustomer] = useState({

    fullName: "",

    email: "",

    phone: "",

    city: "",

    address: "",

  });


  /* ============================= */
  /* PAYMENT */
  /* ============================= */

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");


  /* ============================= */
  /* STATES */
  /* ============================= */

  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const [orderPlaced, setOrderPlaced] =
    useState(false);


  const [orderData, setOrderData] =
    useState(null);


  /* ============================= */
  /* CALCULATE TOTAL */
  /* ============================= */

  const subtotal = cart.reduce(

    (total, item) => {

      return (

        total +

        Number(item.price || 0) *

        Number(item.quantity || 1)

      );

    },

    0

  );


  const delivery = 0;


  const total = subtotal + delivery;


  /* ============================= */
  /* INPUT CHANGE */
  /* ============================= */

  const handleChange = (e) => {

    const {

      name,

      value

    } = e.target;


    setCustomer({

      ...customer,

      [name]: value,

    });

  };


  /* ============================= */
  /* PLACE ORDER */
  /* ============================= */

  const placeOrder = async () => {


    /* EMPTY CART */

    if (cart.length === 0) {

      alert(
        "Your cart is empty"
      );

      navigate("/shop");

      return;

    }


    /* VALIDATE NAME */

    if (!customer.fullName.trim()) {

      setError(
        "Please enter your full name"
      );

      return;

    }


    /* VALIDATE EMAIL */

    if (!customer.email.trim()) {

      setError(
        "Please enter your email address"
      );

      return;

    }


    /* VALIDATE PHONE */

    if (!customer.phone.trim()) {

      setError(
        "Please enter your phone number"
      );

      return;

    }


    /* VALIDATE CITY */

    if (!customer.city.trim()) {

      setError(
        "Please enter your city"
      );

      return;

    }


    /* VALIDATE ADDRESS */

    if (!customer.address.trim()) {

      setError(
        "Please enter your delivery address"
      );

      return;

    }


    try {


      setLoading(true);


      setError("");


      /* ============================= */
      /* PREPARE ORDER ITEMS */
      /* ============================= */

      const items = cart.map(

        (item) => ({

          product:

            item._id ||

            item.id,

          quantity:

            Number(item.quantity),

        })

      );


      /* ============================= */
      /* API REQUEST */
      /* ============================= */

      const response = await fetch(

        "https://thulasi-techloom-assessment-zmzi.vercel.app/api/orders",

        {

          method: "POST",

          headers: {

            "Content-Type":

              "application/json",

          },


        body: JSON.stringify({
  items,
  paymentMethod,
  customer,
}),

        }

      );


      const data = await response.json();


      /* ============================= */
      /* ERROR */
      /* ============================= */

      if (!response.ok) {

        throw new Error(

          data.message ||

          "Failed to place order"

        );

      }


      /* ============================= */
      /* SUCCESS */
      /* ============================= */

      setOrderData(

        data.order

      );


      /* CLEAR CART */

      localStorage.removeItem(

        "cart"

      );


      setCart([]);


      /* SHOW SUCCESS */

      setOrderPlaced(true);


    } catch (error) {


      console.error(

        "Order Error:",

        error

      );


      setError(

        error.message ||

        "Something went wrong. Please try again."

      );


    } finally {


      setLoading(false);


    }

  };


  /* ============================= */
  /* SUCCESS PAGE */
  /* ============================= */

  if (orderPlaced) {

    return (

      <div className="customer-page checkout-page">


        <div className="customer-container">


          <div className="order-success">


            <div className="success-icon">

              <CheckCircle
                size={75}
              />

            </div>


            <h1>

              Order Placed Successfully!

            </h1>


            <p>

              Thank you for your purchase.

              Your order has been received successfully.

            </p>


            {orderData && (

              <div className="order-success-details">


                <p>

                  <strong>

                    Order ID:

                  </strong>

                  {" "}

                  {orderData._id}

                </p>


                <p>

                  <strong>

                    Total Amount:

                  </strong>

                  {" "}

                  Rs.{" "}

                  {Number(

                    orderData.totalAmount

                  ).toLocaleString()}

                </p>


                <p>

                  <strong>

                    Payment Status:

                  </strong>

                  {" "}

                  {orderData.paymentStatus}

                </p>


              </div>

            )}


            <button

              className="continue-shopping-btn"

              onClick={() =>

                navigate("/shop")

              }

            >

              Continue Shopping

            </button>


          </div>


        </div>


      </div>

    );

  }


  /* ============================= */
  /* EMPTY CART */
  /* ============================= */

  if (cart.length === 0) {

    return (

      <div className="customer-page checkout-page">


        <div className="customer-container">


          <div className="empty-cart">


            <ShoppingBag
              size={60}
            />


            <h2>

              Your cart is empty

            </h2>


            <p>

              Add some products before
              proceeding to checkout.

            </p>


            <button

              className="continue-shopping-btn"

              onClick={() =>

                navigate("/shop")

              }

            >

              Go to Shop

            </button>


          </div>


        </div>


      </div>

    );

  }


  /* ============================= */
  /* CHECKOUT PAGE */
  /* ============================= */

  return (

    <div className="customer-page checkout-page">


      <div className="customer-container">


        {/* ============================= */}
        {/* HEADER */}
        {/* ============================= */}

        <div className="checkout-header">


          <button

            className="back-to-cart-btn"

            onClick={() =>

              navigate("/cart")

            }

          >

            <ArrowLeft size={18} />

            Back to Cart

          </button>


          <div>


            <span className="page-eyebrow">

              SECURE CHECKOUT

            </span>


            <h1>

              Checkout

            </h1>


            <p>

              Complete your order securely.

            </p>


          </div>


        </div>


        {/* ============================= */}
        {/* ERROR */}
        {/* ============================= */}

        {error && (

          <div className="checkout-error">

            {error}

          </div>

        )}


        {/* ============================= */}
        {/* CHECKOUT LAYOUT */}
        {/* ============================= */}

        <div className="checkout-layout">


          {/* ============================= */}
          {/* LEFT SIDE */}
          {/* ============================= */}

          <div className="checkout-form-section">


            {/* CUSTOMER INFO */}

            <div className="checkout-card">


              <h2>

                Customer Information

              </h2>


              <div className="form-grid">


                {/* FULL NAME */}

                <div className="form-group">


                  <label>

                    Full Name *

                  </label>


                  <input

                    type="text"

                    name="fullName"

                    value={customer.fullName}

                    onChange={handleChange}

                    placeholder="Enter your full name"

                  />


                </div>


                {/* EMAIL */}

                <div className="form-group">


                  <label>

                    Email Address *

                  </label>


                  <input

                    type="email"

                    name="email"

                    value={customer.email}

                    onChange={handleChange}

                    placeholder="Enter your email"

                  />


                </div>


                {/* PHONE */}

                <div className="form-group">


                  <label>

                    Phone Number *

                  </label>


                  <input

                    type="text"

                    name="phone"

                    value={customer.phone}

                    onChange={handleChange}

                    placeholder="Enter your phone number"

                  />


                </div>


                {/* CITY */}

                <div className="form-group">


                  <label>

                    City *

                  </label>


                  <input

                    type="text"

                    name="city"

                    value={customer.city}

                    onChange={handleChange}

                    placeholder="Enter your city"

                  />


                </div>


              </div>


            </div>


            {/* ============================= */}
            {/* DELIVERY */}
            {/* ============================= */}

            <div className="checkout-card">


              <div className="checkout-section-title">


                <Truck size={22} />


                <h2>

                  Delivery Address

                </h2>


              </div>


              <div className="form-group full-width">


                <label>

                  Address *

                </label>


                <textarea

                  name="address"

                  value={customer.address}

                  onChange={handleChange}

                  placeholder="Enter your complete delivery address"

                  rows="4"

                />


              </div>


            </div>


            {/* ============================= */}
            {/* PAYMENT */}
            {/* ============================= */}

            <div className="checkout-card">


              <div className="checkout-section-title">


                <CreditCard size={22} />


                <h2>

                  Payment Method

                </h2>


              </div>


              <div className="payment-options">


                {/* CASH */}

                <button

                  type="button"

                  className={

                    paymentMethod === "Cash"

                      ? "payment-option active"

                      : "payment-option"

                  }

                  onClick={() =>

                    setPaymentMethod("Cash")

                  }

                >

                  💵 Cash on Delivery

                </button>


                {/* CARD */}

                <button

                  type="button"

                  className={

                    paymentMethod === "Card"

                      ? "payment-option active"

                      : "payment-option"

                  }

                  onClick={() =>

                    setPaymentMethod("Card")

                  }

                >

                  💳 Credit / Debit Card

                </button>


              </div>


              <p className="payment-note">


                Selected Payment Method:

                <strong>

                  {" "}

                  {paymentMethod}

                </strong>


              </p>


            </div>


          </div>


          {/* ============================= */}
          {/* RIGHT SIDE */}
          {/* ============================= */}

          <aside className="checkout-summary">


            <div className="checkout-summary-card">


              <div className="checkout-summary-header">


                <span>

                  ORDER SUMMARY

                </span>


                <h2>

                  Your Order

                </h2>


              </div>


              {/* PRODUCTS */}

              <div className="checkout-products">


                {cart.map((item) => (


                  <div

                    className="checkout-product"

                    key={

                      item._id ||

                      item.id

                    }

                  >


                    <div>


                      <strong>

                        {item.name}

                      </strong>


                      <span>

                        Qty: {item.quantity}

                      </span>


                    </div>


                    <strong>


                      Rs.{" "}


                      {(

                        Number(item.price) *

                        Number(item.quantity)

                      ).toLocaleString()}


                    </strong>


                  </div>


                ))}


              </div>


              {/* SUMMARY */}

              <div className="checkout-summary-details">


                <div>


                  <span>

                    Subtotal

                  </span>


                  <strong>


                    Rs.{" "}

                    {subtotal.toLocaleString()}


                  </strong>


                </div>


                <div>


                  <span>

                    Delivery

                  </span>


                  <strong className="free-text">

                    FREE

                  </strong>


                </div>


              </div>


              {/* TOTAL */}

              <div className="checkout-total">


                <span>

                  Total Amount

                </span>


                <strong>


                  Rs.{" "}

                  {total.toLocaleString()}


                </strong>


              </div>


              {/* PLACE ORDER */}

              <button

                className="place-order-btn"

                onClick={placeOrder}

                disabled={loading}

              >


                {loading ? (

                  <>


                    <Loader2

                      size={19}

                      className="loading-spinner"

                    />


                    Processing...


                  </>

                ) : (

                  <>


                    <ShoppingBag size={19} />


                    Place Order


                  </>

                )}


              </button>


              {/* SECURITY */}

              <div className="secure-payment">


                <ShieldCheck size={20} />


                <span>

                  Secure and protected checkout

                </span>


              </div>


            </div>


          </aside>


        </div>


      </div>


    </div>

  );

}


export default Checkout;