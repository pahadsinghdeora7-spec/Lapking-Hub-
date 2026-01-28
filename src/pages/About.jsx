import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";

export default function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    const { data } = await supabase
      .from("policies")
      .select("*")
      .eq("slug", "about-us")
      .single();

    setData(data);
  };

  if (!data) return null;

  return (
    <div style={{ padding: 20 }}>

      {/* SEO */}
      <Helmet>
        <title>{data.meta_title}</title>
        <meta name="description" content={data.meta_description} />
        <meta name="keywords" content={data.meta_keyword} />
      </Helmet>

      <h1>{data.title}</h1>

      <p style={{ marginTop: 10, lineHeight: 1.7 }}>
        {data.content}
      </p>

    </div>
  );
}
