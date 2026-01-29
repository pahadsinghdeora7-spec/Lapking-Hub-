import { useState } from "react";
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
      password
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // 🔁 AMAZON STYLE REDIRECT
    const redirect =
      localStorage.getItem("redirect_after_login") || "/";

    localStorage.removeItem("redirect_after_login");

    navigate(redirect, { replace: true });
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">

        <h2>Sign in</h2>

        <label>Email</label>
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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="terms">
          By continuing, you agree to LapkingHub’s <br />
          Terms & Conditions and Privacy Policy
        </p>

        <hr />

        <p className="new-text">New to LapkingHub?</p>

        <Link to="/signup" className="create-btn">
          Create your LapkingHub account
        </Link>

      </div>
    </div>
  );
}
