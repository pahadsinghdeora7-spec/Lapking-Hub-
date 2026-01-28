import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AboutUs.css";

export default function AdminAbout() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAbout();
  }, []);

  // ================= LOAD ABOUT =================
  async function loadAbout() {
    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "about-us")
      .limit(1)
      .single();

    if (error) {
      console.log("About not found yet");
      return;
    }

    if (data) {
      setForm({
        title: data.title || "",
        content: data.content || "",
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords || "",
      });
    }
  }

  // ================= SAVE ABOUT =================
  async function handleSave() {
    setLoading(true);

    const { error } = await supabase
      .from("about_pages")
      .update({
        title: form.title,
        content: form.content,
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        meta_keywords: form.meta_keywords,
        status: true,
      })
      .eq("slug", "about-us");

    setLoading(false);

    if (error) {
      alert("SAVE ERROR: " + error.message);
    } else {
      alert("About Us updated successfully ✅");
    }
  }

  return (
    <div className="admin-panel">
      <h2>About Us</h2>

      <input
        placeholder="Page Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        placeholder="About content"
        rows={6}
        value={form.content}
        onChange={(e) =>
          setForm({ ...form, content: e.target.value })
        }
      />

      <input
        placeholder="Meta title (SEO)"
        value={form.meta_title}
        onChange={(e) =>
          setForm({ ...form, meta_title: e.target.value })
        }
      />

      <input
        placeholder="Meta description (SEO)"
        value={form.meta_description}
        onChange={(e) =>
          setForm({ ...form, meta_description: e.target.value })
        }
      />

      <input
        placeholder="Meta keywords (SEO)"
        value={form.meta_keywords}
        onChange={(e) =>
          setForm({ ...form, meta_keywords: e.target.value })
        }
      />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
