import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [step, setStep] = useState("phone");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  // ⏱ OTP TIMER
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  // 📲 SEND OTP (TEST MODE)
  const sendOtp = () => {
    if (mobile.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }
    setStep("otp");
    setTimer(30);
  };

  // ✅ VERIFY OTP (TEST = 123456)
  const verifyOtp = () => {
    if (otp !== "123456") {
      alert("Invalid OTP");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ mobile })
    );

    navigate(redirectTo);
  };

  return (
    <div className="login-wrapper">

      {/* LOGO */}
      <img
        src="/logo.png"
        alt="logo"
        className="login-logo"
      />

      {/* TEXT */}
      <div className="login-text">
        <h2>Welcome to Lapking Hub</h2>
        <p>
          Professional Supplier of<br />
          Laptop Spare Parts & Accessories
        </p>
        <span>Your Trusted Partner</span>
      </div>

      {/* FORM */}
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

            <button onClick={sendOtp}>
              Send OTP
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

            <button onClick={verifyOtp}>
              Verify & Continue
            </button>

            <div className="resend">
              {timer > 0 ? (
                <>Resend OTP in {timer}s</>
              ) : (
                <span onClick={sendOtp}>
                  Resend OTP
                </span>
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
