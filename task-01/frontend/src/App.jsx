import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import POS from "./pages/POS";

// CUSTOMER PAGES
import Shop from "./pages/Customer/Shop";
import Cart from "./pages/Customer/Cart";
import Checkout from "./pages/Customer/Checkout";

import "./App.css";

import CheckoutSuccess from "./pages/Customer/CheckoutSuccess";


function AdminLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrapper">
        <Header />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* CUSTOMER SIDE */}
        {/* ========================= */}

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* IMPORTANT CHECKOUT ROUTE */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
  path="/checkout-success"
  element={<CheckoutSuccess />}
/>


        {/* ========================= */}
        {/* ADMIN SIDE */}
        {/* ========================= */}

        <Route
          path="/"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />


        <Route
          path="/products"
          element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          }
        />


        <Route
          path="/orders"
          element={
            <AdminLayout>
              <Orders />
            </AdminLayout>
          }
        />


        <Route
          path="/inventory"
          element={
            <AdminLayout>
              <Inventory />
            </AdminLayout>
          }
        />


        <Route
          path="/pos"
          element={
            <AdminLayout>
              <POS />
            </AdminLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;