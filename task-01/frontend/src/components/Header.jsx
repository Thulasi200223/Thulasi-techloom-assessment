import { Search, Bell, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const pageNames = {
    "/": "Dashboard",
    "/products": "Products",
    "/inventory": "Inventory",
    "/pos": "Point of Sale",
    "/orders": "Orders",
  };

  const pageTitle = pageNames[location.pathname] || "Dashboard";

  return (
    <header className="header">

      {/* Left */}
      <div className="header-left">
        <div className="header-title">
          <p className="breadcrumb">
            POSFLOW / {pageTitle.toUpperCase()}
          </p>

          <h1>{pageTitle}</h1>
        </div>
      </div>

      {/* Right */}
      <div className="header-right">

        {/* Search */}
        <div className="global-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
          />
        </div>

        {/* Notification */}
        <button className="header-icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        {/* Admin */}
        <div className="admin-menu">
          <div className="admin-avatar">
            A
          </div>

          <div className="admin-info">
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>

          <ChevronDown
            size={16}
            className="admin-arrow"
          />
        </div>

      </div>

    </header>
  );
}

export default Header;