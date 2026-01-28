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

  async function loadAbout() {
    const { data, error } = await supabase
      .from("about_pages")
      .select("*")
      .eq("slug", "about-us")
      .maybeSingle();

    if (error) {
      alert("LOAD ERROR: " + error.message);
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

  async function handleSave() {
    setLoading(true);

    const { data: existing, error: fetchError } = await supabase
      .from("about_pages")
      .select("id")
      .eq("slug", "about-us")
      .maybeSingle();

    if (fetchError) {
      alert("FETCH ERROR: " + fetchError.message);
      setLoading(false);
      return;
    }

    let response;

    if (existing) {
      response = await supabase
        .from("about_pages")
        .update({
          title: form.title,
          content: form.content,
          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords,
        })
        .eq("id", existing.id);
    } else {
      response = await supabase.from("about_pages").insert([
        {
          slug: "about-us",
          title: form.title,
          content: form.content,
          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords,
          status: true,
        },
      ]);
    }

    setLoading(false);

    if (response.error) {
      alert("SAVE ERROR: " + response.error.message);
    } else {
      alert("About Us saved successfully ✅");
    }
  }

  return (
    <div className="admin-panel">
      <h2>About Us</h2>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <input
        placeholder="Meta title"
        value={form.meta_title}
        onChange={(e) =>
          setForm({ ...form, meta_title: e.target.value })
        }
      />

      <input
        placeholder="Meta description"
        value={form.meta_description}
        onChange={(e) =>
          setForm({ ...form, meta_description: e.target.value })
        }
      />

      <input
        placeholder="Meta keywords"
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
