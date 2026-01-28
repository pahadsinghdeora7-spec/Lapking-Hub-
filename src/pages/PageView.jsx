import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./PageView.css";

export default function PageView() {
  const { slug } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPage();
  }, [slug]);

  async function loadPage() {
    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", true)
      .single();

    setLoading(false);

    if (error || !data) {
      setPage(null);
      return;
    }

    // ✅ SEO AUTO
    document.title = data.meta_title || data.title;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        data.meta_description || data.title
      );
    }

    setPage(data);
  }

  if (loading) return <div className="page-loading">Loading...</div>;

  if (!page)
    return <div className="page-empty">Page not available</div>;

  return (
    <div className="page-wrapper">

      <div className="page-card">
        <h1 className="page-title">{page.title}</h1>

        <div className="page-content">
          {page.content.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="page-contact">
          📞 Customer Support: <b>+91 8306939006</b>
        </div>
      </div>

    </div>
  );
}
