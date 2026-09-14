import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

function Navbar({ onMenuToggle }) {
  const [showLocations, setShowLocations] = useState(false);
  const [location, setLocation] = useState("Colombo");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const locations = [
    "Colombo 01 - Fort",
    "Colombo 02 - Slave Island",
    "Colombo 03 - Kollupitiya",
    "Colombo 04 - Bambalapitiya",
    "Colombo 05 - Havelock Town",
    "Colombo 06 - Wellawatte",
    "Colombo 07 - Cinnamon Gardens",
    "Colombo 08 - Borella",
    "Colombo 09 - Dematagoda",
    "Colombo 10 - Pettah",
    "Colombo 11 - Modara",
    "Colombo 12 - Hulftsdorp",
    "Colombo 13 - Kotahena",
    "Colombo 14 - Grandpass",
    "Colombo 15 - Mutwal"
  ];

  /* LOAD SAVED DATA */
  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    const loggedUser = localStorage.getItem("loggedUser");
    const adminToken = localStorage.getItem("adminToken");

    if (savedLocation) setLocation(savedLocation);
    if (loggedUser) setUser(loggedUser);
    if (adminToken === "admin_logged_in") setIsAdmin(true);
  }, []);

  /* CLOSE LOCATION DROPDOWN */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowLocations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectLocation = (place) => {
    setLocation(place);
    localStorage.setItem("location", place);
    setShowLocations(false);
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "/login";
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  /* 🔍 SEARCH – FINAL */
  const doSearch = () => {
    if (search.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        {onMenuToggle && (
          <button className="hamburger" onClick={onMenuToggle}>☰</button>
        )}

        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-main">LankaFresh</span>
          <span className="logo-sub">MART</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="nav-search">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
        />
        <span className="search-icon" onClick={doSearch}>🔍</span>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <div className="nav-location" ref={dropdownRef}>
          <button
            className="location-btn"
            onClick={() => setShowLocations(!showLocations)}
          >
            📍 {location} ▾
          </button>

          {showLocations && (
            <div className="location-dropdown">
              {locations.map((place, i) => (
                <div
                  key={i}
                  className="location-item"
                  onClick={() => selectLocation(place)}
                >
                  {place}
                </div>
              ))}
            </div>
          )}
        </div>

        <a href="/cart" className="icon-btn">🛒</a>

        {isAdmin && (
          <>
            <a href="/admin" className="admin-btn">🛠 Admin</a>
            <button onClick={adminLogout} className="logout-btn">
              Admin Logout
            </button>
          </>
        )}

        {!isAdmin && user ? (
          <>
            <span className="nav-user">Hi, {user}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          !isAdmin && <a href="/login" className="login-btn">Login / Sign Up</a>
        )}
      </div>
    </header>
  );
}

export default Navbar;
