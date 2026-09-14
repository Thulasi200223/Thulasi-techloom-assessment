import products from "../data/products";
import "../styles/products.css";

function BrandPreview({ brand, title }) {
  const brandProducts = products
    .filter((p) => p.brand === brand)
    .slice(0, 5); // show 4–5 products only

  return (
    <section className="brand-preview-section">
      <h2>{title}</h2>

      <div className="products-grid">
        {brandProducts.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>Rs. {item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandPreview;
