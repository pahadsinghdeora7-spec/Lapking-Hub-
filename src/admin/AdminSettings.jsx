import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminSettings() {

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
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) setPayment(data);
  };

  // ✅ REAL QR UPLOAD
  const uploadQrImage = async () => {
    if (!qrFile) return payment.qr_image;

    const fileName = `qr-${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("payment")
      .upload(fileName, qrFile, {
        upsert: true,
      });

    if (error) {
      alert("QR upload failed");
      return payment.qr_image;
    }

    const { data } = supabase.storage
      .from("payment")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const savePaymentSettings = async () => {
    setLoading(true);

    const qrUrl = await uploadQrImage();

    const payload = {
      ...payment,
      qr_image: qrUrl,
    };

    const { data } = await supabase
      .from("payment_settings")
      .select("id")
      .limit(1)
      .single();

    if (data?.id) {
      await supabase
        .from("payment_settings")
        .update(payload)
        .eq("id", data.id);
    } else {
      await supabase.from("payment_settings").insert([payload]);
    }

    setLoading(false);
    alert("Payment settings saved ✅");
  };

  return (
    <div className="admin-page">

      <h2>Payment Settings</h2>

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
          placeholder="After payment note"
          value={payment.note}
          onChange={(e) =>
            setPayment({ ...payment, note: e.target.value })
          }
        />

        {/* ✅ QR upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setQrFile(e.target.files[0])}
        />

        {/* ✅ preview */}
        {payment.qr_image && (
          <img
            src={payment.qr_image}
            alt="QR"
            style={{
              width: 180,
              marginTop: 15,
              borderRadius: 8,
              border: "1px solid #eee"
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


