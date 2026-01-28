import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminPolicies() {
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    const { data } = await supabase
      .from("about_pages")
      .select("*")
      .order("created_at", { ascending: false });

    setPages(data || []);
  }

  async function handleSave() {
    if (!form.slug || !form.title || !form.content) {
      alert("Slug, Title & Content required");
      return;
    }

    setLoading(true);

    const { data: existing } = await supabase
      .from("about_pages")
      .select("id")
      .eq("slug", form.slug)
      .maybeSingle();

    let res;

    if (existing) {
      res = await supabase
        .from("about_pages")
        .update({
          title: form.title,
          content: form.content,
          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords
        })
        .eq("id", existing.id);
    } else {
      res = await supabase.from("about_pages").insert([
        {
          slug: form.slug,
          title: form.title,
          content: form.content,
          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords,
          status: true
        }
      ]);
    }

    setLoading(false);

    if (res.error) {
      alert(res.error.message);
    } else {
      alert("Policy saved successfully ✅");
      setForm({
        slug: "",
        title: "",
        content: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: ""
      });
      loadPages();
    }
  }

  function editPage(p) {
    setForm({
      slug: p.slug,
      title: p.title,
      content: p.content,
      meta_title: p.meta_title || "",
      meta_description: p.meta_description || "",
      meta_keywords: p.meta_keywords || ""
    });
  }

  return (
    <div className="admin-panel">
      <h2>📜 Policy Manager</h2>

      <input
        placeholder="Slug (privacy-policy)"
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
      />

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Policy Content"
        rows="8"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <input
        placeholder="Meta Title"
        value={form.meta_title}
        onChange={(e) =>
          setForm({ ...form, meta_title: e.target.value })
        }
      />

      <input
        placeholder="Meta Description"
        value={form.meta_description}
        onChange={(e) =>
          setForm({ ...form, meta_description: e.target.value })
        }
      />

      <input
        placeholder="Meta Keywords"
        value={form.meta_keywords}
        onChange={(e) =>
          setForm({ ...form, meta_keywords: e.target.value })
        }
      />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Policy"}
      </button>

      <hr />

      <h3>Saved Pages</h3>

      {pages.map((p) => (
        <div
          key={p.id}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            marginBottom: "8px",
            cursor: "pointer"
          }}
          onClick={() => editPage(p)}
        >
          <b>{p.title}</b>
          <div style={{ fontSize: "13px", color: "#666" }}>
            /page/{p.slug}
          </div>
        </div>
      ))}
    </div>
  );
}
