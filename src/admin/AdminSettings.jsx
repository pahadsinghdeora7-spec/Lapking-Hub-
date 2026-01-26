import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminSettings() {

  // ---------------- SITE SETTINGS ----------------
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

  // ---------------- PAYMENT SETTINGS ----------------
  const [payment, setPayment] = useState({
    upi_id: "",
    whatsapp: "",
    note: "",
    status: true,
    qr_image: ""
  });

  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSiteSettings();
    loadPaymentSettings();
  }, []);

  // ================= SITE =================
  const loadSiteSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) setForm(data);
  };

  // ================= PAYMENT =================
  const loadPaymentSettings = async () => {
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) setPayment(data);
  };

  const saveSiteSettings = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .single();

    if (data?.id) {
      await supabase.from("site_settings").update(form).eq("id", data.id);
    } else {
      await supabase.from("site_settings").insert([form]);
    }

    setLoading(false);
    alert("Site settings saved ✅");
  };

  // ================= PAYMENT SAVE =================
  const savePaymentSettings = async () => {
    setLoading(true);

    let qrUrl = payment.qr_image;

    // 🔹 QR upload
    if (qrFile) {
      const fileName = `qr-${Date.now()}.png`;

      const { error } = await supabase.storage
        .from("payment")
        .upload(fileName, qrFile, {
          upsert: true,
        });

      if (!error) {
        qrUrl = supabase.storage
          .from("payment")
          .getPublicUrl(fileName).data.publicUrl;
      }
    }

    const { data } = await supabase
      .from("payment_settings")
      .select("id")
      .limit(1)
      .single();

    const finalData = {
      ...payment,
      qr_image: qrUrl,
    };

    if (data?.id) {
      await supabase
        .from("payment_settings")
        .update(finalData)
        .eq("id", data.id);
    } else {
      await supabase
        .from("payment_settings")
        .insert([finalData]);
    }

    setLoading(false);
    alert("Payment settings saved ✅");
  };

  return (
    <div className="admin-page">

      {/* ================= SITE SETTINGS ================= */}
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

        <button onClick={saveSiteSettings} disabled={loading}>
          Save Site Settings
        </button>
      </div>

      {/* ================= PAYMENT SETTINGS ================= */}
      <h2 style={{ marginTop: 40 }}>Payment Settings</h2>

      <div className="card">

        <input
          placeholder="UPI ID"
          value={payment.upi_id}
          onChange={(e) =>
            setPayment({ ...payment, upi_id: e.target.value })
          }
        />

        <input
          placeholder="WhatsApp Number"
          value={payment.whatsapp}
          onChange={(e) =>
            setPayment({ ...payment, whatsapp: e.target.value })
          }
        />

        <input
          placeholder="Note (after payment message)"
          value={payment.note}
          onChange={(e) =>
            setPayment({ ...payment, note: e.target.value })
          }
        />

        {/* 🔹 QR upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setQrFile(e.target.files[0])}
        />

        {/* 🔹 QR preview */}
        {payment.qr_image && (
          <img
            src={payment.qr_image}
            alt="QR"
            style={{
              width: "180px",
              marginTop: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd"
            }}
          />
        )}

        <select
          value={payment.status ? "true" : "false"}
          onChange={(e) =>
            setPayment({
              ...payment,
              status: e.target.value === "true",
            })
          }
        >
          <option value="true">Payment Enabled</option>
          <option value="false">Payment Disabled</option>
        </select>

        <button onClick={savePaymentSettings} disabled={loading}>
          Save Payment Settings
        </button>
      </div>

    </div>
  );
      }
