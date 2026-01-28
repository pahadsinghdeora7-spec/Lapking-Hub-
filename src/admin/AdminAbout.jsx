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

  // ================= LOAD ABOUT DATA =================
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
        meta_keyword: data.meta_keyword || "",
      });
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ================= SAVE ABOUT =================
  const handleSave = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("policies")
      .select("id")
      .eq("slug", "about-us")
      .single();

    if (data) {
      // UPDATE
      await supabase
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
      await supabase.from("policies").insert([
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

    alert("About Us saved successfully");
    setLoading(false);
  };

  // ================= UI =================
  return (
    <div className="about-wrap">

      <h2>About Us</h2>

      <div className="about-form">

        {/* PAGE TITLE */}
        <div>
          <label>Page Title</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="About LapkingHub"
          />
        </div>

        {/* CONTENT */}
        <div>
          <label>Content</label>
          <textarea
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            placeholder="Write about your business..."
          />
        </div>

        {/* SEO BOX */}
        <div className="seo-box">
          <h4>SEO Settings</h4>

          <div>
            <label>Meta Title</label>
            <input
              value={form.meta_title}
              onChange={(e) =>
                setForm({ ...form, meta_title: e.target.value })
              }
            />
          </div>

          <div>
            <label>Meta Description</label>
            <textarea
              value={form.meta_description}
              onChange={(e) =>
                setForm({ ...form, meta_description: e.target.value })
              }
            />
          </div>

          <div>
            <label>Meta Keywords</label>
            <input
              value={form.meta_keyword}
              onChange={(e) =>
                setForm({ ...form, meta_keyword: e.target.value })
              }
            />
          </div>
        </div>

        {/* SAVE */}
        <button
          className="about-save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save About Us"}
        </button>

      </div>
    </div>
  );
            }
