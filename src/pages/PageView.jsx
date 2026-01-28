import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PageView.css";

export default function PageView() {
  const { slug } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  async function fetchPage() {
    setLoading(true);

    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setLoading(false);

    if (error || !data) {
      console.log("PAGE ERROR:", error);
      setPage(null);
      return;
    }

    // ✅ SEO
    if (data.meta_title) {
      document.title = data.meta_title;
    }

    if (data.meta_description) {
      let metaDesc = document.querySelector(
        "meta[name='description']"
      );

      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }

      metaDesc.content = data.meta_description;
    }

    setPage(data);
  }

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (!page) {
    return (
      <div className="page-empty">
        Page not available
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-card">
        <h1 className="page-title">{page.title}</h1>

        <div className="page-content">
          {page.content.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
        }
