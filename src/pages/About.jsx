import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import "./AboutUs.css";

export default function AboutUs() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .ilike("slug", "about-us") // 🔥 case safe
      .maybeSingle();

    if (!error && data && data.status === true) {
      setPage(data);
    } else {
      setPage(null);
    }

    setLoading(false);
  }

  if (loading) return <p className="about-loading">Loading...</p>;

  if (!page) return <p className="about-empty">About Us not available</p>;

  return (
    <div className="about-page">

      {/* SEO */}
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        <meta
          name="description"
          content={page.meta_description || ""}
        />
        <meta
          name="keywords"
          content={page.meta_keywords || ""}
        />
      </Helmet>

      <h1>{page.title}</h1>

      <div
        className="about-content"
        dangerouslySetInnerHTML={{
          __html: page.content.replace(/\n/g, "<br/>"),
        }}
      />
    </div>
  );
}
