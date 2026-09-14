import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  CreditCard,
  RefreshCw,
  X,
  User,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

import "./Orders.css";


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = "http://localhost:5001/api";


/* =========================================================
   INITIAL CUSTOMER
========================================================= */

const INITIAL_CUSTOMER = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  address: ""
};


/* =========================================================
   POS COMPONENT
========================================================= */

function POS() {

  /* =======================================================
     PRODUCTS
  ======================================================= */

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] =
    useState([]);


  /* =======================================================
     CART
  ======================================================= */

  const [cart, setCart] = useState([]);


  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");


  /* =======================================================
     PAYMENT
  ======================================================= */

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [paymentOutcome, setPaymentOutcome] =
    useState("success");


  /* =======================================================
     CUSTOMER
  ======================================================= */

  const [customer, setCustomer] =
    useState(INITIAL_CUSTOMER);


  /* =======================================================
     UI STATES
  ======================================================= */

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [processing, setProcessing] = useState(false);

  const [paymentProcessing, setPaymentProcessing] =
    useState(false);


  /* =======================================================
     MODALS
  ======================================================= */

  const [showCheckoutModal, setShowCheckoutModal] =
    useState(false);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);


  /* =======================================================
     LAST ORDER
  ======================================================= */

  const [lastOrder, setLastOrder] = useState(null);


  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  const fetchProducts = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/products`
      );

      const data = response.data?.products || [];

      setProducts(data);

      setFilteredProducts(data);

    } catch (err) {

      console.error(
        "Failed to load products:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load products. Please make sure the backend server is running."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =======================================================
     INITIAL PRODUCT LOAD
  ======================================================= */

  useEffect(() => {

    fetchProducts();

  }, []);


  /* =======================================================
     SEARCH FILTER
  ======================================================= */

  useEffect(() => {

    const keyword =
      search.trim().toLowerCase();


    if (!keyword) {

      setFilteredProducts(products);

      return;

    }


    const filtered =
      products.filter((product) => {

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


    setFilteredProducts(filtered);

  }, [search, products]);


  /* =======================================================
     ADD PRODUCT TO CART
  ======================================================= */

  const addToCart = (product) => {

    const stock =
      Number(product.stock) || 0;


    if (stock <= 0) {

      alert(
        `${product.name} is out of stock.`
      );

      return;

    }


    const existingItem =
      cart.find(
        (item) =>
          item._id === product._id
      );


    if (existingItem) {

      if (
        existingItem.quantity >= stock
      ) {

        alert(
          `Only ${stock} unit(s) of ${product.name} are available.`
        );

        return;

      }


      setCart((currentCart) =>

        currentCart.map((item) =>

          item._id === product._id

            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }

            : item

        )

      );

      return;

    }


    setCart((currentCart) => [

      ...currentCart,

      {
        ...product,
        quantity: 1
      }

    ]);

  };


  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (productId) => {

    setCart((currentCart) =>

      currentCart.map((item) => {

        if (
          item._id !== productId
        ) {

          return item;

        }


        const product =
          products.find(
            (product) =>
              product._id === productId
          );


        const stock =
          Number(product?.stock) || 0;


        if (
          item.quantity >= stock
        ) {

          alert(
            `Only ${stock} unit(s) are available.`
          );

          return item;

        }


        return {

          ...item,

          quantity:
            item.quantity + 1

        };

      })

    );

  };


  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (productId) => {

    setCart((currentCart) =>

      currentCart
        .map((item) => {

          if (
            item._id !== productId
          ) {

            return item;

          }


          return {

            ...item,

            quantity:
              item.quantity - 1

          };

        })

        .filter(
          (item) =>
            item.quantity > 0
        )

    );

  };


  /* =======================================================
     REMOVE CART ITEM
  ======================================================= */

  const removeFromCart = (productId) => {

    setCart((currentCart) =>

      currentCart.filter(
        (item) =>
          item._id !== productId
      )

    );

  };


  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {

    if (
      cart.length === 0
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        "Are you sure you want to clear this order?"
      );


    if (
      confirmed
    ) {

      setCart([]);

    }

  };


  /* =======================================================
     TOTAL ITEMS
  ======================================================= */

  const totalItems =
    useMemo(() => {

      return cart.reduce(

        (sum, item) =>

          sum +
          Number(
            item.quantity || 0
          ),

        0

      );

    }, [cart]);


  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal =
    useMemo(() => {

      return cart.reduce(

        (sum, item) =>

          sum +
          Number(item.price || 0) *
          Number(item.quantity || 0),

        0

      );

    }, [cart]);


  /*
     Backend total is based on product price * quantity.
     Therefore the POS total must match the backend.
  */

  const total = subtotal;


  /* =======================================================
     CUSTOMER INPUT
  ======================================================= */

  const handleCustomerChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setCustomer(
      (currentCustomer) => ({

        ...currentCustomer,

        [name]: value

      })
    );

  };


  /* =======================================================
     CUSTOMER VALIDATION
  ======================================================= */

  const validateCustomer = () => {

    const requiredFields = [

      {
        name: "fullName",
        label: "Full Name"
      },

      {
        name: "email",
        label: "Email"
      },

      {
        name: "phone",
        label: "Phone"
      },

      {
        name: "city",
        label: "City"
      },

      {
        name: "address",
        label: "Address"
      }

    ];


    for (
      const field of requiredFields
    ) {

      const value =
        customer[field.name];


      if (
        !value ||
        !value.trim()
      ) {

        alert(
          `${field.label} is required.`
        );

        return false;

      }

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailRegex.test(
        customer.email.trim()
      )
    ) {

      alert(
        "Please enter a valid email address."
      );

      return false;

    }


    const phoneDigits =
      customer.phone.replace(
        /\D/g,
        ""
      );


    if (
      phoneDigits.length < 7
    ) {

      alert(
        "Please enter a valid phone number."
      );

      return false;

    }


    return true;

  };


  /* =======================================================
     OPEN CUSTOMER CHECKOUT
  ======================================================= */

  const handleCheckout = () => {

    if (
      cart.length === 0
    ) {

      alert(
        "Please add at least one product."
      );

      return;

    }


    setShowCheckoutModal(true);

  };


  /* =======================================================
     CLOSE CUSTOMER CHECKOUT
  ======================================================= */

  const closeCheckoutModal = () => {

    if (
      processing
    ) {

      return;

    }


    setShowCheckoutModal(false);

  };


  /* =======================================================
     CREATE ORDER
  ======================================================= */

  const createOrder = async () => {

    if (
      processing
    ) {

      return;

    }


    if (
      cart.length === 0
    ) {

      alert(
        "Please add at least one product."
      );

      return;

    }


    if (
      !validateCustomer()
    ) {

      return;

    }


    try {

      setProcessing(true);


      /* ===============================================
         BUILD ORDER ITEMS
      =============================================== */

      const orderItems =
        cart.map((item) => ({

          product:
            item._id,

          quantity:
            Number(item.quantity)

        }));


      /* ===============================================
         CREATE RESERVED ORDER
      =============================================== */

      const response =
        await axios.post(

          `${API_BASE_URL}/orders`,

          {

            items:
              orderItems,

            paymentMethod,

            customer: {

              fullName:
                customer.fullName.trim(),

              email:
                customer.email
                  .trim()
                  .toLowerCase(),

              phone:
                customer.phone.trim(),

              city:
                customer.city.trim(),

              address:
                customer.address.trim()

            }

          }

        );


      const createdOrder =
        response.data?.order;


      if (
        !createdOrder
      ) {

        throw new Error(
          "Order was created but no order data was returned."
        );

      }


      setLastOrder(
        createdOrder
      );


      setShowCheckoutModal(
        false
      );


      setShowPaymentModal(
        true
      );


    } catch (err) {

      console.error(
        "Create order failed:",
        err
      );


      alert(

        err.response?.data?.message ||

        err.message ||

        "Unable to create order."

      );

    } finally {

      setProcessing(false);

    }

  };


  /* =======================================================
     PROCESS PAYMENT
  ======================================================= */

  const processPayment = async () => {

    if (
      !lastOrder?._id
    ) {

      alert(
        "No order is available for payment."
      );

      return;

    }


    if (
      paymentProcessing
    ) {

      return;

    }


    try {

      setPaymentProcessing(true);


      const response =
        await axios.post(

          `${API_BASE_URL}/orders/${lastOrder._id}/payment`,

          {
            outcome:
              paymentOutcome
          }

        );


      const updatedOrder =
        response.data?.order;


      if (
        updatedOrder
      ) {

        setLastOrder(
          updatedOrder
        );

      }


      /* ===============================================
         PAYMENT SUCCESS
      =============================================== */

      if (
        paymentOutcome ===
        "success"
      ) {

        alert(
          "Payment successful. Order confirmed."
        );


        setShowPaymentModal(
          false
        );


        setCart([]);


        setCustomer(
          INITIAL_CUSTOMER
        );


        setPaymentOutcome(
          "success"
        );


        await fetchProducts();


        return;

      }


      /* ===============================================
         PAYMENT FAILED / TIMEOUT
      =============================================== */

      alert(

        response.data?.message ||

        "Payment was not completed."

      );


      setShowPaymentModal(
        false
      );


      setCart([]);


      setCustomer(
        INITIAL_CUSTOMER
      );


      setPaymentOutcome(
        "success"
      );


      await fetchProducts();


    } catch (err) {

      console.error(
        "Payment processing failed:",
        err
      );


      alert(

        err.response?.data?.message ||

        err.message ||

        "Unable to process payment."

      );

    } finally {

      setPaymentProcessing(false);

    }

  };


  /* =======================================================
     CANCEL ORDER
  ======================================================= */

  const cancelOrder = async () => {

    if (
      !lastOrder?._id
    ) {

      return;

    }


    if (
      ![
        "Pending",
        "Reserved"
      ].includes(
        lastOrder.status
      )
    ) {

      alert(
        `This order cannot be cancelled because its status is ${lastOrder.status}.`
      );

      return;

    }


    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );


    if (
      !confirmed
    ) {

      return;

    }


    try {

      const response =
        await axios.post(

          `${API_BASE_URL}/orders/${lastOrder._id}/cancel`

        );


      const cancelledOrder =
        response.data?.order;


      if (
        cancelledOrder
      ) {

        setLastOrder(
          cancelledOrder
        );

      }


      setShowPaymentModal(
        false
      );


      setCart([]);


      setCustomer(
        INITIAL_CUSTOMER
      );


      setPaymentOutcome(
        "success"
      );


      await fetchProducts();


      alert(
        "Order cancelled successfully. Stock has been restored."
      );


    } catch (err) {

      console.error(
        "Cancel order failed:",
        err
      );


      alert(

        err.response?.data?.message ||

        err.message ||

        "Unable to cancel order."

      );

    }

  };


  /* =======================================================
     CLOSE PAYMENT MODAL
  ======================================================= */

  const closePaymentModal = () => {

    if (
      paymentProcessing
    ) {

      return;

    }


    setShowPaymentModal(
      false
    );

  };


  /* =======================================================
     INPUT STYLE
  ======================================================= */

  const inputStyle = {

    width: "100%",

    padding: "12px 14px",

    backgroundColor: "#ffffff",

    color: "#111827",

    border: "1px solid #d1d5db",

    borderRadius: "10px",

    outline: "none",

    fontSize: "14px",

    boxSizing: "border-box"

  };


  /* =======================================================
     TEXTAREA STYLE
  ======================================================= */

  const textareaStyle = {

    ...inputStyle,

    resize: "vertical",

    minHeight: "100px"

  };


  /* =======================================================
     SELECT STYLE
  ======================================================= */

  const selectStyle = {

    ...inputStyle,

    cursor: "pointer"

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading
  ) {

    return (

      <div className="page-loading">

        <div className="spinner"></div>

        <p>
          Loading products...
        </p>

      </div>

    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error
  ) {

    return (

      <div className="dashboard-error">

        <Package size={30} />

        <div>

          <h3>
            Unable to load products
          </h3>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchProducts
            }
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /* =======================================================
     MAIN UI
  ======================================================= */

  return (

    <div className="pos-page">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="page-heading">

        <div>

          <p className="breadcrumb">
            POSFLOW / POINT OF SALE
          </p>

          <h1>
            Point of Sale
          </h1>

          <p className="page-subtitle">
            Create orders quickly and manage customer purchases.
          </p>

        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >

          <button
            type="button"
            className="refresh-products-button"
            onClick={
              fetchProducts
            }
          >

            <RefreshCw size={17} />

            Refresh

          </button>


          <div className="pos-live-badge">

            <span className="live-dot"></span>

            POS Online

          </div>

        </div>

      </div>


      {/* ===================================================
          MAIN POS LAYOUT
      =================================================== */}

      <div className="pos-layout">


        {/* =================================================
            PRODUCTS SECTION
        ================================================= */}

        <section className="pos-products-section">


          <div className="pos-toolbar">

            <div>

              <h2>
                Products
              </h2>

              <p>
                Select products to add them to the order.
              </p>

            </div>


            <div className="pos-search">

              <Search size={18} />

              <input

                type="text"

                placeholder="Search products..."

                value={
                  search
                }

                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }

              />

            </div>

          </div>


          {/* =============================================
              PRODUCT GRID
          ============================================= */}

          <div className="pos-product-grid">

            {filteredProducts.length === 0 ? (

              <div className="pos-empty-products">

                <Package size={45} />

                <h3>
                  No products found
                </h3>

                <p>
                  Try another product or category.
                </p>

              </div>

            ) : (

              filteredProducts.map(
                (product) => {

                  const stock =
                    Number(
                      product.stock
                    ) || 0;


                  return (

                    <button

                      key={
                        product._id
                      }

                      type="button"

                      className={`pos-product-card ${
                        stock <= 0
                          ? "pos-product-disabled"
                          : ""
                      }`}

                      onClick={() =>
                        addToCart(
                          product
                        )
                      }

                      disabled={
                        stock <= 0
                      }

                    >

                      <div className="pos-product-icon">

                        <Package
                          size={23}
                        />

                      </div>


                      <div className="pos-product-info">

                        <span className="pos-product-category">

                          {
                            product.category ||
                            "General"
                          }

                        </span>


                        <h3>
                          {product.name}
                        </h3>


                        <div className="pos-product-bottom">

                          <strong>

                            Rs.{" "}

                            {Number(
                              product.price ||
                              0
                            ).toLocaleString()}

                          </strong>


                          <span
                            className={
                              stock <= 5
                                ? "stock-low"
                                : "stock-good"
                            }
                          >

                            {stock} in stock

                          </span>

                        </div>

                      </div>


                      <span className="add-product-btn">

                        <Plus
                          size={17}
                        />

                      </span>

                    </button>

                  );

                }

              )

            )}

          </div>

        </section>


        {/* =================================================
            CART SECTION
        ================================================= */}

        <aside className="pos-cart">


          {/* =============================================
              CART HEADER
          ============================================= */}

          <div className="cart-header">

            <div>

              <p className="cart-label">
                CURRENT ORDER
              </p>

              <h2>

                Cart

                <span>
                  {totalItems}
                </span>

              </h2>

            </div>


            <button

              type="button"

              className="clear-cart-btn"

              onClick={
                clearCart
              }

              disabled={
                cart.length === 0
              }

            >
              Clear

            </button>

          </div>


          {/* =============================================
              CART ITEMS
          ============================================= */}

          <div className="cart-items">

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Select products from the catalog to begin creating an order.
                </p>

              </div>

            ) : (

              cart.map(
                (item) => (

                  <div
                    className="cart-item"
                    key={
                      item._id
                    }
                  >


                    <div className="cart-item-icon">

                      <Package
                        size={18}
                      />

                    </div>


                    <div className="cart-item-details">

                      <h4>
                        {item.name}
                      </h4>

                      <span>

                        Rs.{" "}

                        {Number(
                          item.price ||
                          0
                        ).toLocaleString()}

                      </span>

                    </div>


                    <div className="cart-item-actions">


                      <div className="quantity-controls">


                        <button

                          type="button"

                          onClick={() =>
                            decreaseQuantity(
                              item._id
                            )
                          }

                        >

                          <Minus
                            size={14}
                          />

                        </button>


                        <span>
                          {item.quantity}
                        </span>


                        <button

                          type="button"

                          onClick={() =>
                            increaseQuantity(
                              item._id
                            )
                          }

                        >

                          <Plus
                            size={14}
                          />

                        </button>


                      </div>


                      <button

                        type="button"

                        className="remove-item-btn"

                        onClick={() =>
                          removeFromCart(
                            item._id
                          )
                        }

                      >

                        <Trash2
                          size={15}
                        />

                      </button>


                    </div>


                  </div>

                )

              )

            )}

          </div>


          {/* =============================================
              CART SUMMARY
          ============================================= */}

          <div className="cart-summary">


            <div className="summary-row">

              <span>
                Items
              </span>

              <strong>
                {totalItems}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>

                Rs.{" "}

                {subtotal.toLocaleString()}

              </strong>

            </div>


            <div className="summary-divider"></div>


            <div className="total-row">

              <span>
                Total
              </span>

              <strong>

                Rs.{" "}

                {total.toLocaleString()}

              </strong>

            </div>


            {/* =========================================
                PAYMENT METHOD
            ========================================= */}

            <div className="payment-section">

              <label>
                Payment Method
              </label>


              <div className="payment-options">


                <button

                  type="button"

                  className={
                    paymentMethod ===
                    "Cash"

                      ? "payment-option active"

                      : "payment-option"
                  }

                  onClick={() =>
                    setPaymentMethod(
                      "Cash"
                    )
                  }

                >

                  💵 Cash

                </button>


                <button

                  type="button"

                  className={
                    paymentMethod ===
                    "Card"

                      ? "payment-option active"

                      : "payment-option"
                  }

                  onClick={() =>
                    setPaymentMethod(
                      "Card"
                    )
                  }

                >

                  💳 Card

                </button>


              </div>

            </div>


            {/* =========================================
                CREATE ORDER BUTTON
            ========================================= */}

            <button

              type="button"

              className="checkout-btn"

              onClick={
                handleCheckout
              }

              disabled={
                cart.length === 0 ||
                processing
              }

            >

              <CreditCard
                size={18}
              />

              Create Order • Rs.{" "}

              {total.toLocaleString()}

            </button>


          </div>


        </aside>

      </div>


      {/* ===================================================
          CUSTOMER CHECKOUT MODAL
      =================================================== */}

      {showCheckoutModal && (

        <div className="modal-overlay">


          <div className="product-modal">


            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <div className="modal-header">

              <div>

                <p>
                  ORDER CHECKOUT
                </p>

                <h3>
                  Customer Information
                </h3>

              </div>


              <button

                type="button"

                className="modal-close-button"

                onClick={
                  closeCheckoutModal
                }

                disabled={
                  processing
                }

              >

                <X
                  size={20}
                />

              </button>

            </div>


            {/* =============================================
                CUSTOMER FORM
            ============================================= */}

            <form

              onSubmit={(event) => {

                event.preventDefault();

                createOrder();

              }}

            >


              {/* =========================================
                  FULL NAME
              ========================================= */}

              <div className="form-group">

                <label>

                  <User
                    size={14}
                  />

                  Full Name *

                </label>


                <input

                  type="text"

                  name="fullName"

                  value={
                    customer.fullName
                  }

                  onChange={
                    handleCustomerChange
                  }

                  placeholder="Enter customer name"

                  style={
                    inputStyle
                  }

                  required

                />

              </div>


              {/* =========================================
                  EMAIL + PHONE
              ========================================= */}

              <div className="form-row">


                <div className="form-group">

                  <label>

                    <Mail
                      size={14}
                    />

                    Email *

                  </label>


                  <input

                    type="email"

                    name="email"

                    value={
                      customer.email
                    }

                    onChange={
                      handleCustomerChange
                    }

                    placeholder="customer@gmail.com"

                    style={
                      inputStyle
                    }

                    required

                  />

                </div>


                <div className="form-group">

                  <label>

                    <Phone
                      size={14}
                    />

                    Phone *

                  </label>


                  <input

                    type="tel"

                    name="phone"

                    value={
                      customer.phone
                    }

                    onChange={
                      handleCustomerChange
                    }

                    placeholder="0771234567"

                    style={
                      inputStyle
                    }

                    required

                  />

                </div>


              </div>


              {/* =========================================
                  CITY
              ========================================= */}

              <div className="form-group">

                <label>
                  City *
                </label>


                <input

                  type="text"

                  name="city"

                  value={
                    customer.city
                  }

                  onChange={
                    handleCustomerChange
                  }

                  placeholder="Colombo"

                  style={
                    inputStyle
                  }

                  required

                />

              </div>


              {/* =========================================
                  ADDRESS
              ========================================= */}

              <div className="form-group">

                <label>

                  <MapPin
                    size={14}
                  />

                  Address *

                </label>


                <textarea

                  name="address"

                  value={
                    customer.address
                  }

                  onChange={
                    handleCustomerChange
                  }

                  placeholder="Enter customer address"

                  rows="4"

                  style={
                    textareaStyle
                  }

                  required

                />

              </div>


              {/* =========================================
                  ORDER SUMMARY
              ========================================= */}

              <div
                style={{
                  marginTop: "18px",
                  marginBottom: "20px",
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    marginBottom: "9px"
                  }}
                >

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {paymentMethod}
                  </strong>

                </div>


                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px"
                  }}
                >

                  <span>
                    Order Total
                  </span>

                  <strong>
                    Rs.{" "}
                    {total.toLocaleString()}
                  </strong>

                </div>

              </div>


              {/* =========================================
                  FORM ACTIONS
              ========================================= */}

              <div className="modal-actions">


                <button

                  type="button"

                  className="cancel-button"

                  onClick={
                    closeCheckoutModal
                  }

                  disabled={
                    processing
                  }

                >
                  Cancel
                </button>


                <button

                  type="submit"

                  className="primary-action-button"

                  disabled={
                    processing
                  }

                >

                  <CreditCard
                    size={17}
                  />

                  {processing
                    ? "Creating Order..."
                    : "Reserve & Continue"}

                </button>


              </div>


            </form>


          </div>

        </div>

      )}


      {/* ===================================================
          PAYMENT MODAL
      =================================================== */}

      {showPaymentModal &&
        lastOrder && (

          <div className="modal-overlay">


            <div className="product-modal">


              {/* ===========================================
                  PAYMENT HEADER
              =========================================== */}

              <div className="modal-header">

                <div>

                  <p>
                    MOCK PAYMENT
                  </p>

                  <h3>
                    Complete Payment
                  </h3>

                </div>


                <button

                  type="button"

                  className="modal-close-button"

                  onClick={
                    closePaymentModal
                  }

                  disabled={
                    paymentProcessing
                  }

                >

                  <X
                    size={20}
                  />

                </button>

              </div>


              {/* ===========================================
                  ORDER DETAILS
              =========================================== */}

              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  marginBottom: "20px"
                }}
              >


                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                    marginBottom: "10px"
                  }}
                >

                  <span>
                    Order ID
                  </span>

                  <strong
                    style={{
                      wordBreak: "break-all",
                      textAlign: "right"
                    }}
                  >
                    {lastOrder._id}
                  </strong>

                </div>


                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px"
                  }}
                >

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {lastOrder.paymentMethod}
                  </strong>

                </div>


                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >

                  <span>
                    Amount
                  </span>

                  <strong>
                    Rs.{" "}
                    {Number(
                      lastOrder.totalAmount ||
                      0
                    ).toLocaleString()}
                  </strong>

                </div>


              </div>


              {/* ===========================================
                  SIMULATED OUTCOME
              =========================================== */}

              <div className="form-group">

                <label>
                  Simulated Payment Outcome
                </label>


                <select

                  value={
                    paymentOutcome
                  }

                  onChange={(event) =>
                    setPaymentOutcome(
                      event.target.value
                    )
                  }

                  disabled={
                    paymentProcessing
                  }

                  style={
                    selectStyle
                  }

                >

                  <option value="success">
                    Success
                  </option>

                  <option value="failed">
                    Failed
                  </option>

                  <option value="timeout">
                    Timeout
                  </option>

                </select>

              </div>


              {/* ===========================================
                  RESERVATION MESSAGE
              =========================================== */}

              <div
                style={{
                  padding: "14px",
                  marginBottom: "20px",
                  background: "#eff6ff",
                  color: "#1e3a8a",
                  borderRadius: "10px",
                  fontSize: "13px",
                  lineHeight: "1.6"
                }}
              >

                <strong>
                  Reserved stock:
                </strong>{" "}

                This order currently holds the
                requested stock.

                Failed or timeout payment will
                release the reserved stock.

              </div>


              {/* ===========================================
                  PAYMENT ACTIONS
              =========================================== */}

              <div className="modal-actions">


                <button

                  type="button"

                  className="cancel-button"

                  onClick={
                    cancelOrder
                  }

                  disabled={
                    paymentProcessing
                  }

                >

                  Cancel Order

                </button>


                <button

                  type="button"

                  className="primary-action-button"

                  onClick={
                    processPayment
                  }

                  disabled={
                    paymentProcessing
                  }

                >

                  <CreditCard
                    size={17}
                  />

                  {paymentProcessing
                    ? "Processing Payment..."
                    : "Process Payment"}

                </button>


              </div>


            </div>

          </div>

      )}


      {/* ===================================================
          LAST ORDER STATUS
      =================================================== */}

      {lastOrder &&
        !showPaymentModal && (

          <div
            style={{
              marginTop: "20px",
              padding: "18px 20px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >

            <div>

              <small
                style={{
                  color: "#6b7280",
                  letterSpacing: "0.08em"
                }}
              >
                LAST ORDER
              </small>

              <h4
                style={{
                  margin:
                    "6px 0"
                }}
              >
                #{lastOrder._id}
              </h4>

              <span
                style={{
                  color: "#6b7280"
                }}
              >
                Status:{" "}

                <strong
                  style={{
                    color: "#111827"
                  }}
                >
                  {lastOrder.status}
                </strong>

              </span>

            </div>


            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap"
              }}
            >

              <strong>

                Rs.{" "}

                {Number(
                  lastOrder.totalAmount ||
                  0
                ).toLocaleString()}

              </strong>


              {[
                "Pending",
                "Reserved"
              ].includes(
                lastOrder.status
              ) && (

                <button

                  type="button"

                  className="cancel-button"

                  onClick={
                    cancelOrder
                  }

                >

                  Cancel Order

                </button>

              )}

            </div>


          </div>

        )}

    </div>

  );

}


export default POS;