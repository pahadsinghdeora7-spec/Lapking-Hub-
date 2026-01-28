import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutUs.css";

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "about-us")
      .eq("status", true)
      .single();

    setAbout(data);
  };

  if (!about) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="about-page">
      <h1>{about.title}</h1>
      <p>{about.content}</p>
    </div>
  );
}
