import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminSettings() {
  const [form, setForm] = useState({
    site_name: "",
    logo: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    footer_text: "",
    meta_title: "",
    meta_description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) setForm(data);
  };

  const saveSettings = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .single();

    if (data?.id) {
      await supabase
        .from("site_settings")
        .update(form)
        .eq("id", data.id);
    } else {
      await supabase.from("site_settings").insert([form]);
    }

    setLoading(false);
    alert("Settings saved successfully ✅");
  };

  return (
    <div className="admin-page">
      <h2>Site Settings</h2>

      <div className="card">
        <input
          placeholder="Website Name"
          value={form.site_name}
          onChange={(e) =>
            setForm({ ...form, site_name: e.target.value })
          }
        />

        <input
          placeholder="Logo URL"
          value={form.logo}
          onChange={(e) =>
            setForm({ ...form, logo: e.target.value })
          }
        />

        <input
          placeholder="Support Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={(e) =>
            setForm({ ...form, whatsapp: e.target.value })
          }
        />

        <input
          placeholder="Support Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <textarea
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <textarea
          placeholder="Footer Text"
          value={form.footer_text}
          onChange={(e) =>
            setForm({ ...form, footer_text: e.target.value })
          }
        />

        <input
          placeholder="Meta Title"
          value={form.meta_title}
          onChange={(e) =>
            setForm({ ...form, meta_title: e.target.value })
          }
        />

        <textarea
          placeholder="Meta Description"
          value={form.meta_description}
          onChange={(e) =>
            setForm({
              ...form,
              meta_description: e.target.value,
            })
          }
        />

        <button onClick={saveSettings} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
    }
