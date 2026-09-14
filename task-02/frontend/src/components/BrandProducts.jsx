import products from "../data/products";

function BrandProducts({ brand }) {
  const brandItems = products
    .filter(p => p.brand === brand)
    .slice(0, 5); // min 4–5 products

  return (
    <div className="products-grid">
      {brandItems.map(item => (
        <div className="product-card" key={item.id}>
          <img src={item.image} alt={item.name} />
          <h4>{item.name}</h4>
          <p>Rs. {item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default BrandProducts;
