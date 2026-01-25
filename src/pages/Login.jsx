import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = () => {
    if (phone.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }
    setStep("otp");
  };

  const verifyOtp = () => {
    if (otp !== "123456") {
      alert("Invalid OTP");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ phone })
    );

    navigate(redirectTo);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {step === "phone" && (
        <>
          <input
            type="tel"
            placeholder="Enter mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOtp}>
            Send OTP
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            type="number"
            placeholder="Enter OTP (123456)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
