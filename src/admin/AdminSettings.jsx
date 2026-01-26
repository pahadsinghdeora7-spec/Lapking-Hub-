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
}
.admin-wrapper {
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
}

.btn-outline {
  background: #fff;
  border: 1px solid #2563eb;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 6px;
}

.table-card {
  background: #fff;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.product-table th {
  background: #f9fafb;
  font-weight: 600;
}

.thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.no-img {
  width: 40px;
  height: 40px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.stock-badge {
  background: #dcfce7;
  color: #15803d;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.status.active {
  background: #dcfce7;
  color: #15803d;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.dots {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
