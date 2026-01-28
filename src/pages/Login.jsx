import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSendOtp() {
    if (mobile.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    setLoading(true);

    // 🔐 generate fake OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save otp in database
    const { error } = await supabase.from("otp_logins").insert([
      {
        mobile,
        otp,
        verified: false
      }
    ]);

    setLoading(false);

    if (error) {
      alert("OTP error: " + error.message);
      return;
    }

    // store temporarily
    localStorage.setItem("login_mobile", mobile);
    localStorage.setItem("login_otp", otp);

    // redirect to otp page
    navigate("/verify-otp");
  }

  return (
    <div className="login-page">
      <h2>Login</h2>

      <p>Enter your mobile number</p>

      <input
        type="tel"
        placeholder="Enter mobile number"
        value={mobile}
        maxLength={10}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
      />

      <button onClick={handleSendOtp} disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
}
