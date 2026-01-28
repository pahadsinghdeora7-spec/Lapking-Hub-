import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutUs.css";

export default function AdminAbout() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: ""
  });

  // 🔹 Fetch existing About Us
  const fetchAbout = async () => {
    const { data } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "about-us")
      .single();

    if (data) {
      setForm({
        title: data.title || "",
        content: data.content || "",
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        meta_keyword: data.meta_keyword || ""
      });
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // 🔹 Save / Update
  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("about_pages")
      .update({
        title: form.title,
        content: form.content,
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        meta_keyword: form.meta_keyword
      })
      .eq("slug", "about-us");

    setLoading(false);

    if (error) {
      alert("Error saving About Us");
      console.error(error);
    } else {
      alert("About Us saved successfully");
    }
  };

  return (
    <div className="admin-about">
      <h2>About Us</h2>

      <label>Page Title</label>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <label>Content</label>
      <textarea
        rows="5"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <h3>SEO Settings</h3>

      <input
        placeholder="Meta Title"
        value={form.meta_title}
        onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
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
        value={form.meta_keyword}
        onChange={(e) =>
          setForm({ ...form, meta_keyword: e.target.value })
        }
      />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save About Us"}
      </button>
    </div>
  );
}
