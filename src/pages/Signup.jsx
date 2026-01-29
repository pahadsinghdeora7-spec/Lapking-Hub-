import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    mobile: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.mobile) {
      alert("Email, password & mobile required");
      return;
    }

    // 🔐 create auth user
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    // ✅ create profile
    await supabase.from("user_profiles").insert({
      user_id: user.id,
      email: form.email,
      mobile: form.mobile
    });

    // 🔁 redirect logic
    const redirect =
      localStorage.getItem("redirect_after_login");

    if (redirect) {
      localStorage.removeItem("redirect_after_login");
      navigate(redirect);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-box">
      <h2>Create account</h2>

      <input
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />

      <input
        placeholder="Password"
        type="password"
        name="password"
        onChange={handleChange}
      />

      <input
        placeholder="Mobile number"
        name="mobile"
        maxLength="10"
        onChange={handleChange}
      />

      <button onClick={handleSignup}>
        Create Account
      </button>
    </div>
  );
}
