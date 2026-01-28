import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";

export default function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data } = await supabase
      .from("policies")
      .select("*")
      .eq("slug", "about-us")
      .eq("status", true)
      .single();

    setData(data);
  };

  if (!data) return <p style={{ padding: 20 }}>About Us not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <Helmet>
        <title>{data.meta_title}</title>
        <meta
          name="description"
          content={data.meta_descript}
        />
        <meta
          name="keywords"
          content={data.meta_keyword}
        />
      </Helmet>

      <h1>{data.title}</h1>

      <div style={{ marginTop: 15, lineHeight: 1.7 }}>
        {data.content}
      </div>
    </div>
  );
}
