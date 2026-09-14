import { useLocation, useNavigate } from "react-router-dom";
import products from "../data/products";
import "../styles/products.css";
import Footer from "../components/Footer";

function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);

  const category = query.get("category");
  const brand = query.get("brand");

  // 🔥 IMPORTANT FIX: safe search value
  const rawSearch = query.get("search");
  const search = rawSearch ? rawSearch.trim().toLowerCase() : "";

  /* ===== FINAL FILTER LOGIC (CATEGORY + BRAND + SEARCH) ===== */
  const filteredProducts = products.filter((p) => {
    const matchCategory = category ? p.category === category : true;
    const matchBrand = brand ? p.brand === brand : true;

    const matchSearch = search
      ? p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search)
      : true;

    return matchCategory && matchBrand && matchSearch;
  });

  /* ===== ADD TO CART (LOCALSTORAGE – WORKING) ===== */
  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex((p) => p.id === item.id);

    if (index !== -1) {
      cart[index].qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  const goCategory = (cat) => {
    navigate(`/products?category=${cat}`);
  };

  return (
    <>
      <div className="products-layout">

        {/* ===== SIDEBAR ===== */}
        <aside className="products-sidebar">
          <h3>Categories</h3>
          <ul>
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
        </aside>

        {/* ===== PRODUCTS ===== */}
        <main className="products-content">
          <h2>
            {search && `Search results for "${search}"`}
            {!search && category && category.toUpperCase()}
            {!search && !category && "All Products"}
          </h2>

          <div className="products-grid">
            {filteredProducts.length === 0 && (
              <p>No products found</p>
            )}

            {filteredProducts.map((item) => (
              <div className="product-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p>Rs. {item.price}</p>
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Products;
