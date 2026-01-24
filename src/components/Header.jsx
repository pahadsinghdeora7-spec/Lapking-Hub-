import { MdFavoriteBorder, MdShoppingCart, MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./header.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <MdMenu size={26} />
        <h2 onClick={() => navigate("/")}>
          👑 <span>Lapking</span>Hub
        </h2>
      </div>

      <div className="header-right">
        <MdFavoriteBorder size={24} />
        <MdShoppingCart size={24} onClick={() => navigate("/cart")} />
      </div>
    </header>
  );
}
