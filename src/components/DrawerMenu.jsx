import { Link } from "react-router-dom";

export default function DrawerMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 999
        }}
      />

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          background: "#fff",
          zIndex: 1000,
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 15px rgba(0,0,0,0.25)"
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "22px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>

          <strong style={{ fontSize: "18px", color: "#0b5ed7" }}>
            LapkingHub
          </strong>
        </div>

        <hr style={{ margin: "14px 0" }} />

        {/* MENU */}
        <div style={{ flex: 1 }}>
          <MenuItem to="/" text="Home" onClose={onClose} />
          <MenuItem to="/categories" text="Categories" onClose={onClose} />
          <MenuItem to="/orders" text="My Orders" onClose={onClose} />
          <MenuItem to="/wishlist" text="Wishlist" onClose={onClose} />
          <MenuItem to="/rewards" text="Rewards" onClose={onClose} />
          <MenuItem to="/account" text="My Account" onClose={onClose} />

          <hr style={{ margin: "14px 0" }} />

          <MenuItem to="/page/privacy-policy" text="Privacy Policy" onClose={onClose} />
          <MenuItem to="/page/terms-conditions" text="Terms & Conditions" onClose={onClose} />
          <MenuItem to="/page/refund-policy" text="Refund Policy" onClose={onClose} />
          <MenuItem to="/page/shipping-policy" text="Shipping Policy" onClose={onClose} />
          <MenuItem to="/page/warranty-policy" text="Warranty Policy" onClose={onClose} />

          <hr style={{ margin: "14px 0" }} />

          <MenuItem to="/page/about-us" text="About Us" onClose={onClose} />
          <MenuItem to="/page/contact-us" text="Contact Us" onClose={onClose} />
        </div>

        {/* SOCIAL ICONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginTop: "10px"
          }}
        >
          <a
            href="https://www.facebook.com/share/1DcvZTzkiW/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/icons/facebook.png"
              width="30"
              height="30"
              alt="Facebook"
            />
          </a>

          <a
            href="https://www.instagram.com/lapkinghub"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/icons/instagram.png"
              width="30"
              height="30"
              alt="Instagram"
            />
          </a>

          <a
            href="https://wa.me/918306939006"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/icons/whatsapp.png"
              width="30"
              height="30"
              alt="WhatsApp"
            />
          </a>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "12px",
            color: "#888"
          }}
        >
          © 2026 LapkingHub
        </div>
      </div>
    </>
  );
}

/* MENU ITEM */
function MenuItem({ to, text, onClose }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      style={{
        display: "block",
        padding: "11px 6px",
        textDecoration: "none",
        color: "#222",
        fontSize: "15px",
        fontWeight: "500"
      }}
    >
      {text}
    </Link>
  );
}
