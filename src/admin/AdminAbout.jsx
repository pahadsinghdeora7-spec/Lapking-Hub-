import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutUs.css";

export default function AdminAbout() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing About Us
  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
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
        meta_keywords: data.meta_keyword || ""
      });
    }
  };

  // 🔹 Save About Us (UPSERT)
  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("policies")
      .upsert({
        slug: "about-us",
        title: form.title,
        content: form.content,
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        meta_keyword: form.meta_keywords,
        status: true
      });

    setLoading(false);

    if (error) {
      alert("Error saving About Us");
      console.error(error);
    } else {
      alert("About Us saved successfully");
    }
  };

  return (
    <div className="admin-card">
      <h2>About Us</h2>

      <label>Page Title</label>
      <input
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <label>Content</label>
      <textarea
        rows="6"
        value={form.content}
        onChange={(e) =>
          setForm({ ...form, content: e.target.value })
        }
      />

      <h3>SEO Settings</h3>

      <label>Meta Title</label>
      <input
        value={form.meta_title}
        onChange={(e) =>
          setForm({ ...form, meta_title: e.target.value })
        }
      />

      <label>Meta Description</label>
      <textarea
        rows="3"
        value={form.meta_description}
        onChange={(e) =>
          setForm({ ...form, meta_description: e.target.value })
        }
      />

      <label>Meta Keywords</label>
      <input
        value={form.meta_keywords}
        onChange={(e) =>
          setForm({ ...form, meta_keywords: e.target.value })
        }
      />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save About Us"}
      </button>
    </div>
  );
}
