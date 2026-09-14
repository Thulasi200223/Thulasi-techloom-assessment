import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import AnimatedBanner from "../components/AnimatedBanner";

/* 🔥 IMAGE IMPORTS */
import offer1 from "../assets/offer1.jpg";
import offer2 from "../assets/offer2.jpg";
import offer3 from "../assets/offer3.jpg";
import offer4 from "../assets/offer4.jpg";
import offer5 from "../assets/offer5.jpg";

/* 🔥 SECTIONS */
import BrandSection from "../components/BrandSection";
import Footer from "../components/Footer";

function Home() {
  /* ================= STATE ================= */
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showLocations, setShowLocations] = useState(false);
  const [location, setLocation] = useState("Colombo");
  const [user, setUser] = useState(null);

  /* 🔍 SEARCH */
  const [search, setSearch] = useState("");

  const locationRef = useRef(null);
  const navigate = useNavigate();

  /* ================= SLIDER DATA ================= */
  const slides = [
    { img: offer1, title: "Start Your Day Fresh", cat: "fresh" },
    { img: offer2, title: "Bakery Items", cat: "bakery" },
    { img: offer3, title: "Feel the Chill", cat: "beverages" },
    { img: offer4, title: "Fresh Vegetables", cat: "fresh" },
    { img: offer5, title: "Crunchy Happiness in Every Bite", cat: "bakery" }
  ];

  /* ================= LOCATIONS ================= */
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

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  /* ================= LOAD SAVED DATA ================= */
  useEffect(() => {
    const savedLocation = localStorage.getItem("location");
    const loggedUser = localStorage.getItem("loggedUser");
    if (savedLocation) setLocation(savedLocation);
    if (loggedUser) setUser(loggedUser);
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FUNCTIONS ================= */
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const goCategory = (cat) => {
    navigate(`/products?category=${cat}`);
  };

  const goOffer = (cat) => {
    navigate(`/products?category=${cat}`);
  };

  const nextSlide = () => {
    setSlideIndex((slideIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIndex((slideIndex - 1 + slides.length) % slides.length);
  };

  const selectLocation = (place) => {
    setLocation(place);
    localStorage.setItem("location", place);
    setShowLocations(false);
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "/login";
  };

  /* 🔥 SEARCH FUNCTION (FINAL) */
  const doSearch = () => {
    if (search.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  /* ================= JSX ================= */
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={toggleMenu}>☰</button>

          <div className="logo" onClick={() => navigate("/")}>
            <span className="logo-main">LankaFresh</span>
            <span className="logo-sub">MART</span>
          </div>
        </div>

        {/* 🔍 SEARCH (WORKING) */}
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

        <div className="nav-right">
          <div className="nav-location" ref={locationRef}>
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

          {user ? (
            <>
              <span className="nav-user">Hi, {user}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <a href="/login" className="login-btn">Login / Sign Up</a>
          )}
        </div>
      </header>

      {/* ================= SIDE MENU ================= */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <div className="side-header">
          <span>Shop by Category</span>
          <button onClick={toggleMenu}>✖</button>
        </div>

        <ul className="category-list">
          <li onClick={() => goCategory("beverages")}>🥤 Beverages</li>
          <li onClick={() => goCategory("bakery")}>🥐 Bakery</li>
          <li onClick={() => goCategory("christmas")}>🎄 Christmas</li>
          <li onClick={() => goCategory("coffee")}>☕ Coffee</li>
          <li onClick={() => goCategory("deals")}>🔥 Deals</li>
          <li onClick={() => goCategory("dairy")}>🥛 Dairy</li>
          <li onClick={() => goCategory("fresh")}>🥦 Fresh</li>
          <li onClick={() => goCategory("frozen")}>❄️ Frozen</li>
          <li onClick={() => goCategory("grocery")}>🛒 Grocery</li>
          <li onClick={() => goCategory("beauty")}>🧼 Beauty</li>
          <li onClick={() => goCategory("household")}>🏠 Household</li>
          <li onClick={() => goCategory("baby")}>👶 Baby</li>
        </ul>
      </div>

      {/* ================= OFFER SLIDER ================= */}
      <section className="offer-slider">
        {slides.map((slide, i) => (
          <div key={i} className={`slide ${i === slideIndex ? "active" : ""}`}>
            <img src={slide.img} alt={slide.title} />
            <div className="offer-text">
              <h2>{slide.title}</h2>
              <button onClick={() => goOffer(slide.cat)}>Shop Now</button>
            </div>
          </div>
        ))}
        <button className="slider-arrow left" onClick={prevSlide}>❮</button>
        <button className="slider-arrow right" onClick={nextSlide}>❯</button>
      </section>

      {/* ================= CATEGORY GRID ================= */}
      <section className="category-grid-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {[
            ["beverages","Beverages","🥤"],
            ["bakery","Bakery","🥐"],
            ["christmas","Christmas","🎄"],
            ["coffee","Coffee","☕"],
            ["deals","Deals","🔥"],
            ["dairy","Dairy","🥛"],
            ["fresh","Fresh","🥦"],
            ["frozen","Frozen","❄️"],
            ["grocery","Grocery","🛒"],
            ["beauty","Beauty","🧼"],
            ["household","Household","🏠"],
            ["baby","Baby","👶"]
          ].map(([slug,name,icon]) => (
            <div
              key={slug}
              className="category-item"
              onClick={() => goCategory(slug)}
            >
              <div className="category-circle">{icon}</div>
              <p>{name}</p>
            </div>
          ))}
        </div>
      </section>

      <AnimatedBanner />
      <BrandSection />
      <Footer />
    </>
  );
}

export default Home;
