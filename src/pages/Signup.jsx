import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Email & password required");
      return;
    }

    setLoading(true);

    // ✅ create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // ✅ auto create profile
    await supabase.from("user_profiles").insert([
      {
        user_id: data.user.id,
      },
    ]);

    setLoading(false);
    alert("Account created successfully");
    navigate("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Account</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating..." : "Signup"}
      </button>
    </div>
  );
}
