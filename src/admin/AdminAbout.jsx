import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminAbout() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
  });

  const [loading, setLoading] = useState(false);

  // LOAD ABOUT DATA
  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    const { data } = await supabase
      .from("policies")
      .select("*")
      .eq("slug", "about-us")
      .single();

    if (data) {
      setForm({
        title: data.title || "",
        content: data.content || "",
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        meta_keyword: data.meta_keyword || "",
      });
    }
  };

  // SAVE ABOUT US
  const handleSave = async () => {
    setLoading(true);

    await supabase.from("policies").upsert({
      slug: "about-us",
      title: form.title,
      content: form.content,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      meta_keyword: form.meta_keyword,
      status: true,
    });

    setLoading(false);
    alert("About Us updated successfully");
  };

  return (
    <div className="admin-panel">

      <h2>About Us</h2>

      <div className="card">

        <label>Page Title</label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <label>Content</label>
        <textarea
          rows="8"
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />

        <label>Meta Title (SEO)</label>
        <input
          value={form.meta_title}
          onChange={(e) =>
            setForm({ ...form, meta_title: e.target.value })
          }
        />

        <label>Meta Description (SEO)</label>
        <textarea
          rows="3"
          value={form.meta_description}
          onChange={(e) =>
            setForm({ ...form, meta_description: e.target.value })
          }
        />

        <label>Meta Keywords</label>
        <input
          value={form.meta_keyword}
          onChange={(e) =>
            setForm({ ...form, meta_keyword: e.target.value })
          }
        />

        <button
          className="save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save About Us"}
        </button>

      </div>
    </div>
  );
          }
