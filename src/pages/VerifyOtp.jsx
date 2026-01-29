import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const mobile = localStorage.getItem("otp_mobile");
  const realOtp = localStorage.getItem("otp_code");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyOtp() {
    if (otp.length !== 6) {
      alert("Enter 6 digit OTP");
      return;
    }

    if (otp !== realOtp) {
      alert("Incorrect OTP");
      return;
    }

    setLoading(true);

    // ✅ mark otp verified
    await supabase
      .from("otp_logins")
      .update({ verified: true })
      .eq("mobile", mobile);

    // ✅ create / update user profile
    await supabase.from("user_profiles").upsert({
      mobile
    });

    // ✅ LOGIN SESSION
    localStorage.setItem("user_mobile", mobile);

    // ✅ GET REDIRECT PATH
    const redirect =
      localStorage.getItem("redirect_after_login") || "/";

    // ✅ CLEAR OTP DATA
    localStorage.removeItem("otp_code");
    localStorage.removeItem("otp_mobile");
    localStorage.removeItem("redirect_after_login");

    setLoading(false);

    // ✅ FINAL REDIRECT
    navigate(redirect, { replace: true });
  }

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>

      <p className="sub-text">
        OTP sent to +91 {mobile}
      </p>

      {/* FAKE OTP DISPLAY */}
      <div className="otp-show">
        OTP: <b>{realOtp}</b>
      </div>

      <input
        className="otp-input"
        placeholder="Enter 6 digit OTP"
        maxLength="6"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
      />

      <button onClick={verifyOtp} disabled={loading}>
        {loading ? "Verifying..." : "Verify & Login"}
      </button>
    </div>
  );
}
