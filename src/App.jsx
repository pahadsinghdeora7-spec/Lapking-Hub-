import React from "react";

const products = [
  {
    id: 1,
    brand: "LENOVO",
    name: "Lenovo ThinkPad E580 E585 E590 L580 P52 P72, With TRK Ball",
    price: 0,
    strikePrice: 0,
    outOfStock: true,
  },
  {
    id: 2,
    brand: "LENOVO",
    name: "Lenovo ThinkPad E470, E450, E460, W450, E450C, E465, E455 With TRK",
    price: 750,
    strikePrice: 950,
  },
  {
    id: 3,
    brand: "DELL",
    name: "DELL Latitude 5500 5501 5510 5511, Precision 3500 3501 3540 3541",
    price: 1250,
    strikePrice: 1450,
  },
  {
    id: 4,
    brand: "ASUS",
    name: "Asus ROG Zephyrus Duo 16 GX650, GX650P, GX650R, RGB Backlit",
    price: 3250,
    strikePrice: 3499,
  },
  {
    id: 5,
    brand: "LENOVO",
    name: "Lenovo ThinkPad E14 Gen 5, L14 Gen 4, T14s Gen 4, With Backlight",
    price: 2550,
    strikePrice: 2799,
  },
  {
    id: 6,
    brand: "HP",
    name: "HP Pavilion 15 EG, 15 ER, 15 FC, With Backlight Blue",
    price: 1550,
    strikePrice: 1799,
  },
  {
    id: 7,
    brand: "HP",
    name: "HP ProBook 430 G6 435 G6 With Backlight US",
    price: 550,
    strikePrice: 699,
  },
];

const cardImage =
  "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600";

export default function App() {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
        color: "#0f172a",
      }}
    >
      <TopBar />
      <MainContainer />
    </div>
  );
}

function TopBar() {
  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            L
          </div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Lapking<span style={{ color: "#2563eb" }}>Hub</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#6b7280",
                marginTop: 2,
              }}
            >
              Premium laptop &amp; accessories for resellers
            </div>
          </div>
        </div>

        {/* Desktop nav (mobile me thoda chhota ho jayega but ok) */}
        <nav
          style={{
            display: "flex",
            gap: 16,
            fontSize: 13,
            color: "#4b5563",
            alignItems: "center",
          }}
        >
          <NavItem active>Home</NavItem>
          <NavItem>Categories</NavItem>
          <NavItem>Orders</NavItem>
          <NavItem>Account</NavItem>
        </nav>
      </div>

      {/* Search bar */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "8px 16px 10px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: 999,
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              🔍
            </span>
            <input
              placeholder="Search products..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 13,
                flex: 1,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ children, active }) {
  return (
    <span
      style={{
        position: "relative",
        paddingBottom: 2,
        fontWeight: active ? 600 : 500,
        color: active ? "#111827" : "#4b5563",
      }}
    >
      {children}
      {active && (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -4,
            height: 2,
            borderRadius: 999,
            background: "#2563eb",
          }}
        />
      )}
    </span>
  );
}

function MainContainer() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "12px 16px 40px",
      }}
    >
      <HeroBanner />
      <LatestProducts />
    </main>
  );
}

function HeroBanner() {
  return (
    <section style={{ marginTop: 8 }}>
      <div
        style={{
          borderRadius: 20,
          padding: "18px 20px",
          background:
            "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)",
          color: "white",
          boxShadow: "0 22px 40px rgba(37,99,235,0.35)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          Premium Laptop Accessories
        </div>
        <div
          style={{
            fontSize: 13,
            opacity: 0.95,
            maxWidth: 420,
            lineHeight: 1.4,
          }}
        >
          Shop the best chargers, batteries, keyboards and more for all laptop
          brands. Special rates for B2B partners and resellers.
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button
            style={{
              padding: "9px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              background: "#ffffff",
              color: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Shop Now
            <span>→</span>
          </button>
          <button
            style={{
              padding: "9px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.5)",
              background: "transparent",
              color: "#e5e7eb",
            }}
          >
            View Categories
          </button>
        </div>
      </div>
    </section>
  );
}

function LatestProducts() {
  return (
    <section style={{ marginTop: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Latest Products
        </h2>
        <button
          style={{
            fontSize: 12,
            color: "#2563eb",
            border: "none",
            background: "transparent",
            fontWeight: 500,
          }}
        >
          View All →
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <div
      style={{
        borderRadius: 18,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 14px 28px rgba(15,23,42,0.06)",
      }}
    >
      {/* image */}
      <div
        style={{
          position: "relative",
          paddingTop: "66%",
          backgroundColor: "#f3f4f6",
          overflow: "hidden",
        }}
      >
        <img
          src={cardImage}
          alt={product.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {product.outOfStock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f9fafb",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Out of Stock
          </div>
        )}
      </div>

      {/* content */}
      <div
        style={{
          padding: "10px 12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flexGrow: 1,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#2563eb",
          }}
        >
          {product.brand}
        </span>
        <div
          style={{
            fontSize: 12,
            color: "#111827",
            fontWeight: 500,
            minHeight: 36,
            overflow: "hidden",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginTop: 6,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            ₹{product.price}
          </span>
          {product.strikePrice > 0 && (
            <span
              style={{
                fontSize: 11,
                color: "#9ca3af",
                textDecoration: "line-through",
              }}
            >
              ₹{product.strikePrice}
            </span>
          )}
        </div>

        <button
          style={{
            marginTop: 8,
            width: "100%",
            padding: "8px 10px",
            borderRadius: 999,
            border: "none",
            fontSize: 12,
            fontWeight: 600,
            background: product.outOfStock ? "#e5e7eb" : "#2563eb",
            color: product.outOfStock ? "#6b7280" : "#ffffff",
            cursor: "pointer",
          }}
        >
          {product.outOfStock ? "Notify Me" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
