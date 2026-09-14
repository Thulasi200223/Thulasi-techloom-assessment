import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  MonitorSmartphone,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        
        {/* Brand */}
        <div className="brand">
          <div className="brand-logo">
            <MonitorSmartphone size={26} />
          </div>

          <div className="brand-text">
            <h2>POSFLOW</h2>
            <p>SMART COMMERCE</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          <p className="menu-label">MAIN</p>

          <NavLink
            to="/"
            end
            className="nav-link"
            onClick={closeSidebar}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <p className="menu-label">MANAGEMENT</p>

          <NavLink
            to="/products"
            className="nav-link"
            onClick={closeSidebar}
          >
            <Package size={20} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/inventory"
            className="nav-link"
            onClick={closeSidebar}
          >
            <Boxes size={20} />
            <span>Inventory</span>
          </NavLink>

          <p className="menu-label">SALES</p>

          <NavLink
            to="/pos"
            className="nav-link"
            onClick={closeSidebar}
          >
            <ShoppingCart size={20} />
            <span>Point of Sale</span>
          </NavLink>

          <NavLink
            to="/orders"
            className="nav-link"
            onClick={closeSidebar}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </NavLink>

        </nav>

        {/* Sidebar Bottom */}
        <div className="sidebar-footer">
          <div className="online-status">
            <span className="online-dot"></span>
            <span>System Online</span>
          </div>

          <p>POSFLOW v1.0</p>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;