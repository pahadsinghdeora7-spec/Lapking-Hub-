import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import "./AboutUs.css";

export default function AboutUs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("slug", "about-us")
      .single();

    if (!error) {
      setData(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="about-loading">Loading...</div>;
  }

  if (!data) {
    return <div className="about-empty">About Us not found</div>;
  }

  return (
    <div className="about-page">

      {/* ✅ SEO */}
      <Helmet>
        <title>{data.meta_title || data.title}</title>
        <meta
          name="description"
          content={data.meta_description || ""}
        />
        <meta
          name="keywords"
          content={data.meta_keyword || ""}
        />
      </Helmet>

      {/* CONTENT */}
      <h1 className="about-title">{data.title}</h1>

      <div
        className="about-content"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}
