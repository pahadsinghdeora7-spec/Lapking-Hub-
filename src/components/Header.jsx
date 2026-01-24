import { useState } from "react";
import DrawerMenu from "./DrawerMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          height: "55px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 12px",
          borderBottom: "1px solid #eee",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}
      >
        <button
          onClick={() => setOpen(true)}
          style={{
            fontSize: "22px",
            background: "none",
            border: "none"
          }}
        >
          ☰
        </button>

        <h3 style={{ margin: 0 }}>👑 LapkingHub</h3>
      </header>

      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
