import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/checkout/address";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendLink() {
    if (!email.includes("@")) {
      alert("Enter valid email address");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + redirectTo
      }
    });

    setLoading(false);

    if (error) {
      alert("Email send failed");
    } else {
      setSent(true);
    }
  }

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

        {!sent ? (
          <>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={sendLink} disabled={loading}>
              {loading ? "Sending..." : "Send Login Link"}
            </button>

            <div className="info-text">
              🔒 Secure login • No password required
            </div>
          </>
        ) : (
          <div className="email-sent">
            ✅ Login link sent to <b>{email}</b>
            <p>Please check your inbox and click the link.</p>
          </div>
        )}

        <div className="terms">
          By continuing, you agree to our<br />
          Terms & Privacy Policy
        </div>

      </div>
    </div>
  );
}
