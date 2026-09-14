import { useNavigate } from "react-router-dom";

function SideMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  const goCategory = (cat) => {
    navigate(`/products?category=${cat}`);
    onClose && onClose();
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <div className="side-header">
        <span>Shop by Category</span>
        {onClose && <button onClick={onClose}>✖</button>}
      </div>

      <ul className="category-list">
        <li onClick={() => goCategory("beverages")}>🥤 Beverages</li>
        <li onClick={() => goCategory("bakery")}>🥐 Breakfast & Bakery</li>
        <li onClick={() => goCategory("christmas")}>🎄 Christmas Sale</li>
        <li onClick={() => goCategory("coffee")}>☕ Coffee, Tea & Malts</li>
        <li onClick={() => goCategory("deals")}>🔥 Daily Deals</li>
        <li onClick={() => goCategory("dairy")}>🥛 Dairy Products</li>
        <li onClick={() => goCategory("fresh")}>🥦 Fresh Produce</li>
        <li onClick={() => goCategory("frozen")}>❄️ Frozen</li>
        <li onClick={() => goCategory("grocery")}>🛒 Grocery & Staples</li>
        <li onClick={() => goCategory("beauty")}>🧼 beauty
</li>
        <li onClick={() => goCategory("household")}>🏠 Household</li>
        <li onClick={() => goCategory("baby")}>👶 Mom & Baby Care</li>
      </ul>
    </div>
  );
}

export default SideMenu;
