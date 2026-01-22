import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <span className="menu">☰</span>
        <h1 className="logo">
          👑 Lapking<span>Hub</span>
        </h1>
      </div>

      <div className="header-right">
        <span className="icon">favorite_border</span>
        <span className="icon">shopping_cart</span>
      </div>
    </header>
  );
}
