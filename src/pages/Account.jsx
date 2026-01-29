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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // ✅ PERFECT REDIRECT FIX
    const redirect = localStorage.getItem("redirect_after_login");

    if (redirect) {
      localStorage.removeItem("redirect_after_login");
      navigate(redirect);
    } else {
      navigate("/account");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign in to LapkingHub</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p>
          New user? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}
