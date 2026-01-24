import { useNavigate } from "react-router-dom";
import {
  MdHome,
  MdCategory,
  MdShoppingCart,
  MdPerson
} from "react-icons/md";
import "./bottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">

      <div onClick={() => navigate("/")}>
        <MdHome size={22} />
        <span>Home</span>
      </div>

      <div onClick={() => navigate("/categories")}>
        <MdCategory size={22} />
        <span>Categories</span>
      </div>

      <div onClick={() => navigate("/cart")}>
        <MdShoppingCart size={22} />
        <span>Cart</span>
      </div>

      <div onClick={() => navigate("/account")}>
        <MdPerson size={22} />
        <span>Account</span>
      </div>

    </div>
  );
}
