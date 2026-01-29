import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const mobile = localStorage.getItem("otp_mobile");
  const realOtp = localStorage.getItem("otp_code");

  const [otp, setOtp] = useState("");

  async function verifyOtp() {
    if (otp !== realOtp) {
      alert("Incorrect OTP");
      return;
    }

    await supabase
      .from("otp_logins")
      .update({ verified: true })
      .eq("mobile", mobile);

    localStorage.setItem("user_mobile", mobile);

    // ✅ HASH ROUTER FIX
    const redirect =
      localStorage.getItem("redirect_after_login") || "";

    localStorage.removeItem("redirect_after_login");
    localStorage.removeItem("otp_code");

    navigate("/" + redirect);
  }

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>

      <p className="sub-text">
        OTP sent to +91 {mobile}
      </p>

      <div className="otp-show">
        OTP: <b>{realOtp}</b>
      </div>

      <input
        className="otp-input"
        placeholder="Enter OTP"
        maxLength="6"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
      />

      <button onClick={verifyOtp}>
        Verify & Continue
      </button>
    </div>
  );
}
