import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===== CONTEXTS ===== */
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";

/* ===== MAIN PAGES ===== */
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";

/* ===== CHECKOUT FLOW ===== */
import Checkout from "./pages/Checkout";
import COD from "./pages/COD";
import CardPayment from "./pages/CardPayment";
import OrderHistory from "./pages/OrderHistory";

/* ===== AUTH ===== */
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* ===== ADMIN ===== */
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <CartProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            {/* ===== USER SIDE ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />

            {/* ===== CHECKOUT ===== */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/cod" element={<COD />} />
            <Route path="/checkout/card" element={<CardPayment />} />
            <Route path="/orders" element={<OrderHistory />} />

            {/* ===== AUTH ===== */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ===== ADMIN ===== */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </CartProvider>
  );
}

export default App;
