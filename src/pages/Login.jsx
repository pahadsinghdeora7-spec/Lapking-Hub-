import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      alert(error.message);
      return;
    }

    const redirect =
      localStorage.getItem("redirect_after_login");

    if (redirect) {
      localStorage.removeItem(
        "redirect_after_login"
      );
      navigate(redirect);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-box">
      <h2>Sign in</h2>

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleLogin}>
        Sign In
      </button>
    </div>
  );
}
