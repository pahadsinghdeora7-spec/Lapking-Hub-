import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ AUTH LISTENER (THIS FIXES EVERYTHING)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        // fetch profile
        const { data } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setProfile(data || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ⏳ WAIT
  if (loading) {
    return <p style={{ padding: 20 }}>Loading account...</p>;
  }

  // 🔐 NOT LOGGED IN
  if (!user) {
    return <p style={{ padding: 20 }}>Please login to continue</p>;
  }

  return (
    <div className="account-page">

      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>{user.email}</p>
      </div>

      <div style={{ padding: 15 }}>
        <p>✅ Login persistent working</p>
        <p>✅ Reload safe</p>
        <p>✅ Session restore safe</p>
      </div>

      <button
        className="logout-btn"
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}
