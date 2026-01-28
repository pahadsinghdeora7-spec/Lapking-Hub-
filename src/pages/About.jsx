import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutUs.css";

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    const { data, error } = await supabase
      .from("about_pages")
      .select("title, content")
      .eq("slug", "about-us")
      .eq("status", true)
      .limit(1)
      .single();

    if (error) {
      console.log("ABOUT ERROR:", error.message);
      setAbout(null);
    } else {
      setAbout(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <div className="about-loading">Loading...</div>;
  }

  if (!about) {
    return <div className="about-notfound">About not found</div>;
  }

  return (
    <div className="about-page">
      <h1>{about.title}</h1>
      <p className="about-content">{about.content}</p>
    </div>
  );
}
