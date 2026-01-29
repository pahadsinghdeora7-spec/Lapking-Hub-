import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  async function handleContinue() {
    if (mobile.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    setLoading(true);

    // ✅ RANDOM OTP EVERY TIME
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await supabase.from("otp_logins").insert([
      {
        mobile,
        otp,
        verified: false
      }
    ]);

    // ✅ SAVE OTP DATA
    localStorage.setItem("otp_mobile", mobile);
    localStorage.setItem("otp_code", otp);

    // ✅ SAVE REDIRECT PATH (VERY IMPORTANT)
    const redirectPath =
      location.state?.from || "/";

    localStorage.setItem(
      "redirect_after_login",
      redirectPath
    );

    setLoading(false);

    navigate("/verify-otp");
  }

  return (
    <div className="auth-container">
      <h2>Login or Sign up</h2>

      <p className="sub-text">
        Enter your mobile number to continue
      </p>

      <div className="mobile-box">
        <span>+91</span>
        <input
          type="tel"
          maxLength="10"
          placeholder="Mobile number"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      <button onClick={handleContinue} disabled={loading}>
        {loading ? "Please wait..." : "Continue"}
      </button>

      <p className="terms">
        By continuing, you agree to LapkingHub’s
        <br />
        Terms & Conditions and Privacy Policy
      </p>
    </div>
  );
}
