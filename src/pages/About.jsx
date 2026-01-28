import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AboutUs() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "about-us")
      .eq("status", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!error) {
      setAbout(data);
    }

    setLoading(false);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!about) return <p style={{ padding: 20 }}>About Us not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{about.title}</h1>

      <p style={{ marginTop: 10, lineHeight: "1.8" }}>
        {about.content}
      </p>
    </div>
  );
}
