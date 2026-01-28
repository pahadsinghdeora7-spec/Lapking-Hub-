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
      .single();

    setLoading(false);

    if (error || !data) {
      console.log("ABOUT ERROR:", error);
      setAbout(null);
      return;
    }

    setAbout(data);
  }

  if (loading)
    return <div className="about-loading">Loading About Us...</div>;

  if (!about)
    return <div className="about-empty">About Us not available</div>;

  return (
    <div className="about-container">
      <div className="about-card">

        {/* TITLE */}
        <h1 className="about-title">
          {about.title}
        </h1>

        {/* MAIN CONTENT */}
        <p className="about-content">
          {about.content}
        </p>

        {/* EXTRA TRUST SECTION */}
        <div className="about-highlights">

          <div className="highlight-box">
            <span>✅</span>
            <p>100% Genuine Laptop & Computer Accessories</p>
          </div>

          <div className="highlight-box">
            <span>🚚</span>
            <p>Fast & Reliable Delivery Across India</p>
          </div>

          <div className="highlight-box">
            <span>💼</span>
            <p>Trusted by Retailers, Businesses & Technicians</p>
          </div>

          <div className="highlight-box">
            <span>📞</span>
            <p>Customer Support: +91 8306939006</p>
          </div>

        </div>

      </div>
    </div>
  );
}
