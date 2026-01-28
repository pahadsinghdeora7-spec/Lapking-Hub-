import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminAbout() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    meta_title: "",
    meta_descript: "",
    meta_keyword: ""
  });

  // FETCH EXISTING DATA
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
        meta_descript: data.meta_descript || "",
        meta_keyword: data.meta_keyword || ""
      });
    }
  };

  // SAVE (UPSERT)
  const handleSave = async () => {
    const { error } = await supabase.from("policies").upsert({
      slug: "about-us",
      title: form.title,
      content: form.content,
      meta_title: form.meta_title,
      meta_descript: form.meta_descript,
      meta_keyword: form.meta_keyword,
      status: true
    });

    if (!error) {
      alert("About Us saved successfully");
    } else {
      alert("Error saving About Us");
      console.log(error);
    }
  };

  return (
    <div className="admin-page">
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

      <h4 style={{ marginTop: 20 }}>SEO Settings</h4>

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
        value={form.meta_descript}
        onChange={(e) =>
          setForm({ ...form, meta_descript: e.target.value })
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
        onClick={handleSave}
        style={{ marginTop: 15 }}
        className="save-btn"
      >
        Save About Us
      </button>
    </div>
  );
        }
