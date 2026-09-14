import "./ShopByCategory.css";

const categories = [
  { name: "Beverages", icon: "🥤" },
  { name: "Bakery", icon: "🥐" },
  { name: "Christmas", icon: "🎄" },
  { name: "Coffee", icon: "☕" },
  { name: "Deals", icon: "🔥" },
  { name: "Dairy", icon: "🥛" },
  { name: "Fresh", icon: "🥦" },
  { name: "Frozen", icon: "❄️" },
  { name: "Grocery", icon: "🛒" },
  { name: "Beauty", icon: "🧼" },
  { name: "Household", icon: "🏠" },
  { name: "Baby", icon: "👶" },
];

function ShopByCategory() {
  return (
    <section
      className="category-section"
      style={{
        backgroundImage: "url(/images/category-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="category-title">Shop by Category</h2>

      <div className="category-grid">
        {categories.map((cat) => (
          <div className="category-item" key={cat.name}>
            <div className="category-circle">
              <span>{cat.icon}</span>
            </div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShopByCategory;
