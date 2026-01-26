import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/checkout/address";

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert("Google login failed");
    }
  };

  return (
    <div className="login-wrapper">

      {/* LOGO */}
      <img src="/logo.png" className="login-logo" />

      {/* TEXT */}
      <div className="login-text">
        <h2>Welcome to Lapking Hub</h2>
        <p>
          Professional Supplier of<br />
          Laptop Spare Parts & Accessories
        </p>
        <span>Your Trusted Partner</span>
      </div>

      {/* LOGIN CARD */}
      <div className="login-card">

        <button
          className="google-login-btn"
          onClick={handleGoogleLogin}
        >
          <img src="/google.svg" alt="google" />
          Continue with Google
        </button>

        <div className="secure-text">
          🔒 Secure login · No password required
        </div>

        <div className="terms">
          By continuing, you agree to our<br />
          Terms & Privacy Policy
        </div>

      </div>
    </div>
  );
}
