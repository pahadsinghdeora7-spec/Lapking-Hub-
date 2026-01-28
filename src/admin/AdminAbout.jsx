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
    meta_keyword: "",
  });

  /* ================= LOAD ABOUT DATA ================= */
  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data, error } = await supabase
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

  /* ================= SAVE ABOUT ================= */
  const handleSave = async () => {
    if (!form.title || !form.content) {
      alert("Title and content required");
      return;
    }

    setLoading(true);

    // check already exists
    const { data: existing } = await supabase
      .from("policies")
      .select("id")
      .eq("slug", "about-us")
      .single();

    let result;

    if (existing) {
      // UPDATE
      result = await supabase
        .from("policies")
        .update({
          title: form.title,
          content: form.content,
          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keyword: form.meta_keyword,
          status: true,
        })
        .eq("slug", "about-us");
    } else {
      // INSERT
      result = await supabase.from("policies").insert([
        {
          slug: "about-us",
          title: form.title,
          content: form.content,
          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keyword: form.meta_keyword,
          status: true,
        },
      ]);
    }

    setLoading(false);

    if (result.error) {
      alert("Error saving About Us");
      console.error(result.error);
    } else {
      alert("About Us saved successfully");
    }
  };

  return (
    <div className="admin-about">

      <h2>About Us</h2>

      <div className="about-card">

        <label>Page Title</label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          placeholder="About LapkingHub"
        />

        <label>Content</label>
        <textarea
          rows="6"
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          placeholder="Write about your business..."
        />

        <div className="seo-box">
          <h4>SEO Settings</h4>

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
            value={form.meta_keyword}
            onChange={(e) =>
              setForm({ ...form, meta_keyword: e.target.value })
            }
          />
        </div>

        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save About Us"}
        </button>

      </div>
    </div>
  );
          }        
