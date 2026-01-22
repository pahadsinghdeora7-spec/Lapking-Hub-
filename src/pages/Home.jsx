import "./home.css";
import products from "../data/dummyProducts";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <div className="home">

      {/* SEARCH */}
      <div className="search-box">
        <input placeholder="Search products..." />
      </div>

      {/* BANNER */}
      <div className="banner">
        <h2>Premium Laptop Accessories</h2>
        <p>
          Shop the best chargers, batteries, keyboards and more for all laptop brands
        </p>
        <button>Shop Now →</button>
      </div>

      {/* INFO */}
      <div className="info-box">
        Wholesale Supplier of Laptop Spare Parts & Accessories
      </div>

      {/* PRODUCTS */}
      <h3 className="section-title">Latest Products</h3>

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
}
