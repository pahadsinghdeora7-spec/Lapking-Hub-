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
      setPage(null);
      return;
    }

    /* ================= SEO ================= */

    // Title
    document.title =
      data.meta_title || `${data.title} | LapkingHub`;

    // Meta description
    let metaDesc = document.querySelector(
      "meta[name='description']"
    );
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      data.meta_description ||
      "Laptop accessories and spare parts information from LapkingHub.";

    // Meta keywords (optional)
    if (data.meta_keywords) {
      let metaKey = document.querySelector(
        "meta[name='keywords']"
      );
      if (!metaKey) {
        metaKey = document.createElement("meta");
        metaKey.name = "keywords";
        document.head.appendChild(metaKey);
      }
      metaKey.content = data.meta_keywords;
    }

    // Canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    // Robots
    let robots = document.querySelector("meta[name='robots']");
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "index, follow";

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

        {/* H1 — SEO GOLD */}
        <h1 className="page-title">{page.title}</h1>

        {/* CONTENT */}
        <div className="page-content">
          {page.content
            .split("\n")
            .filter(line => line.trim() !== "")
            .map((line, i) => (
              <p key={i}>{line}</p>
            ))}
        </div>

      </div>
    </div>
  );
}
