import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD SESSION SAFELY
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!error) setProfile(data);
      setLoading(false);
    };

    loadUser();

    // 🔁 future login/logout listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setProfile(null);
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ⏳ LOADING
  if (loading) {
    return <p style={{ padding: 20 }}>Loading account...</p>;
  }

  // 🔐 NOT LOGGED IN
  if (!user) {
    return <p style={{ padding: 20 }}>Please login to continue</p>;
  }

  return (
    <div className="account-page">
      {/* PROFILE */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>{user.email}</p>
      </div>

      {/* DETAILS */}
      <div style={{ padding: 15 }}>
        <p>✅ Login persistent</p>
        <p>✅ Reload safe</p>
        <p>✅ Supabase session active</p>

        {profile && (
          <>
            <p><b>Name:</b> {profile.full_name}</p>
            <p><b>Mobile:</b> {profile.mobile}</p>
            <p><b>City:</b> {profile.city}</p>
            <p><b>Pincode:</b> {profile.pincode}</p>
          </>
        )}
      </div>

      {/* LOGOUT */}
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
