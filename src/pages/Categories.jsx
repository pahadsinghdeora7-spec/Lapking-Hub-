import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Categories.css";

const categories = [
  { name: "DC Jack", slug: "dc-jack", icon: "🔌" },
  { name: "Laptop Body", slug: "body", icon: "💻" },
  { name: "Speakers", slug: "speakers", icon: "🔊" },
  { name: "Fans", slug: "fans", icon: "🌀" },
  { name: "Batteries", slug: "batteries", icon: "🔋" },
  { name: "Keyboards", slug: "keyboards", icon: "⌨️" },
];

export default function Categories() {
  return (
    <div className="cat-page">
      <Helmet>
        <title>All Categories | Lapking Hub</title>
        <meta
          name="description"
          content="Browse all laptop spare parts categories including keyboards, batteries, DC jacks, fans and speakers."
        />
      </Helmet>

      <h1 className="cat-title">All Categories</h1>
      <p className="cat-sub">
        Browse our complete collection of laptop accessories
      </p>

      <div className="cat-grid">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="cat-card"
          >
            <div className="cat-icon">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <span>Shop Now →</span>
          </Link>
        ))}
      </div>

      <div className="cat-seo-text">
        Lapking Hub provides wholesale laptop spare parts for all major brands.
      </div>
    </div>
  );
            }
