import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import "./About.css";

export default function About() {
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
      .maybeSingle();

    if (!error && data) {
      setAbout(data);
    }

    setLoading(false);
  }

  if (loading) return <p className="about-loading">Loading...</p>;

  if (!about)
    return <p className="about-empty">About us not available</p>;

  return (
    <div className="about-page">

      {/* SEO */}
      <Helmet>
        <title>{about.meta_title || "About Us | Lapking Hub"}</title>
        <meta
          name="description"
          content={about.meta_description || ""}
        />
        <meta
          name="keywords"
          content={about.meta_keywords || ""}
        />
      </Helmet>

      <h1>{about.title}</h1>

      <div
        className="about-content"
        dangerouslySetInnerHTML={{
          __html: about.content.replace(/\n/g, "<br/>"),
        }}
      />
    </div>
  );
}
