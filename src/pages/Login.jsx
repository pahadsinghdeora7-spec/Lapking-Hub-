import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/checkout/address";

  const [step, setStep] = useState("phone");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  // ⏱ OTP TIMER
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  // 📲 REAL OTP SEND
  const sendOtp = async () => {
    if (mobile.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${mobile}`
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setStep("otp");
    setTimer(30);
  };

  // ✅ REAL OTP VERIFY
  const verifyOtp = async () => {
    if (otp.length < 6) {
      alert("Enter valid OTP");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${mobile}`,
      token: otp,
      type: "sms"
    });

    setLoading(false);

    if (error) {
      alert("Invalid OTP");
      return;
    }

    // 🔐 LOGIN SESSION SAVE
    localStorage.setItem(
      "user",
      JSON.stringify({
        mobile,
        id: data.user.id
      })
    );

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="login-wrapper">

      <img src="/logo.png" alt="logo" className="login-logo" />

      <div className="login-text">
        <h2>Welcome to Lapking Hub</h2>
        <p>
          Professional Supplier of<br />
          Laptop Spare Parts & Accessories
        </p>
        <span>Your Trusted Partner</span>
      </div>

      <div className="login-card">

        {step === "phone" && (
          <>
            <div className="mobile-box">
              <div className="country">+91</div>
              <input
                type="tel"
                maxLength="10"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="info-text">
              🔒 Secure login • No password required
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="otp-info">
              Enter OTP sent to <b>{mobile}</b>
            </p>

            <input
              type="number"
              className="otp-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="resend">
              {timer > 0 ? (
                <>Resend OTP in {timer}s</>
              ) : (
                <span onClick={sendOtp}>Resend OTP</span>
              )}
            </div>
          </>
        )}

        <div className="terms">
          By continuing, you agree to our<br />
          Terms & Privacy Policy
        </div>

      </div>
    </div>
  );
}
