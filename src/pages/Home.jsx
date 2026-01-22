import "./Home.css";
import products from "../data/dummyProducts";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <div className="home">

      {/* HEADER */}
      <header className="header">
        <h2>👑 LapkingHub</h2>
      </header>

      {/* SEARCH */}
      <div className="search-box">
        <input placeholder="Search products..." />
      </div>

      {/* BANNER */}
      <section className="banner">
        <h1>Premium Laptop Accessories</h1>
        <p>
          Shop the best chargers, batteries, keyboards and more
        </p>
        <button>Shop Now →</button>
      </section>

      {/* INFO */}
      <div className="info-box">
        Wholesale Supplier of Laptop Spare Parts & Accessories
      </div>

      {/* PRODUCTS */}
      <h3 className="title">Latest Products</h3>

      <div className="product-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </div>
  );
}
