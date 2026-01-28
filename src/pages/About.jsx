import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutUs.css";

export default function AboutUs() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "about-us")   // ✅ EXACT MATCH
      .eq("status", true)
      .single();

    setLoading(false);

    if (error) {
      console.log("About error:", error.message);
      setAbout(null);
      return;
    }

    setAbout(data);
  }

  if (loading) {
    return <div className="about-loading">Loading...</div>;
  }

  if (!about) {
    return <div className="about-empty">About Us not available</div>;
  }

  return (
    <div className="about-page">
      <h1>{about.title}</h1>

      <div
        className="about-content"
        dangerouslySetInnerHTML={{
          __html: about.content?.replace(/\n/g, "<br />"),
        }}
      />
    </div>
  );
}
