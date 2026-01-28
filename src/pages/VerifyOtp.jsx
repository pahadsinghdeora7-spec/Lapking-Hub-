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

    // mark verified
    await supabase
      .from("otp_logins")
      .update({ verified: true })
      .eq("mobile", mobile);

    // create user profile
    await supabase.from("user_profiles").upsert({
      mobile
    });

    localStorage.setItem("user_mobile", mobile);

    navigate("/");
  }

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>

      <p className="sub-text">
        OTP sent to +91 {mobile}
      </p>

      {/* SHOW OTP (FAKE LOGIN) */}
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

      <button onClick={verifyOtp}>
        Verify & Login
      </button>
    </div>
  );
}
