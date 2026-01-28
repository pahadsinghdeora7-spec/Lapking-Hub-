import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutUs.css";

export default function AboutUs() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "about-us")
      .limit(1)
      .maybeSingle();

    setLoading(false);

    if (error || !data) {
      console.log("ABOUT ERROR:", error);
      setAbout(null);
      return;
    }

    setAbout(data);
  }

  if (loading) return <div className="about-loading">Loading...</div>;
  if (!about) return <div className="about-empty">About Us not available</div>;

  return (
    <div className="about-page">
      <h1>{about.title}</h1>
      <p className="about-content">{about.content}</p>
    </div>
  );
}
