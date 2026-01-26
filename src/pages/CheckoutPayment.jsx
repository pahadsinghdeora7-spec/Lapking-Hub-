import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = 149;
  const total = subtotal + shipping;

  const createOrder = async () => {
    try {
      setLoading(true);

      const user =
        JSON.parse(localStorage.getItem("user")) || null;

      const orderCode =
        "LKH" + Math.floor(1000000000 + Math.random() * 9000000000);

      const { error } = await supabase.from("orders").insert([
        {
          name: "Customer",
          phone: "NA",
          address: "NA",
          shipping_name: "Standard",
          shipping_price: shipping,
          total: total,

          // 🔒 TABLE MATCH (MOST IMPORTANT)
          payment_method: "UPI",
          payment_status: "pending",
          order_status: "new",

          user_id: user?.id || null,
          order_code: orderCode
        }
      ]);

      if (error) {
        alert("Order create failed");
        console.error(error);
        return;
      }

      localStorage.removeItem("cart");

      navigate("/order/success", {
        state: {
          order_code: orderCode,
          total: total
        }
      });
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">

      <h2>🔒 Secure Payment</h2>

      <div className="qr-box">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kingmetals517@okhdfcbank&pn=King%20Metals"
          alt="UPI QR"
        />
        <p>Scan to pay using any UPI app</p>
      </div>

      <div className="pay-actions">
        <button
          className="pay-btn"
          disabled={loading}
          onClick={createOrder}
        >
          {loading
            ? "Creating Order..."
            : `Confirm & Pay ₹${total}`}
        </button>
      </div>

    </div>
  );
}
