// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // ✅ redirect logic (checkout → same page)
    const redirect = localStorage.getItem("redirect_after_login");
    if (redirect) {
      localStorage.removeItem("redirect_after_login");
      navigate(redirect);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Sign in to LapkingHub</h2>

        <p className="sub-text">
          Access wholesale laptop accessories at best B2B prices.
        </p>

        <label>Email address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In Securely"}
        </button>

        <p className="secure-text">
          🔒 100% secure login • Your data is protected
        </p>

        <hr />

        <p className="new-user">New to LapkingHub?</p>

        <Link to="/signup" className="outline-btn">
          Create your free business account
        </Link>

        <p className="terms">
          By continuing, you agree to LapkingHub’s
          <br />
          Terms & Conditions and Privacy Policy
        </p>

      </div>
    </div>
  );
}
