import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Supabase auth login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Invalid login");
      setLoading(false);
      return;
    }

    const userId = data.user.id;

    // 2️⃣ Check admin_users table
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (adminError || !admin) {
      alert("You are not admin");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // ✅ Admin verified
    navigate("/admin");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
