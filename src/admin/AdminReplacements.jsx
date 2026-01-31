import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./ReplacementRequest.css";

export default function ReplacementRequest({ order, item, onClose }) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function submitRequest() {
    if (!reason) {
      alert("Please select replacement reason");
      return;
    }

    setLoading(true);

    let imageUrls = [];

    // 📸 Upload images
    for (let file of images) {
      const fileName = `replace-${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("replacements")
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from("replacements")
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);
      }
    }

    // ✅ INSERT FULL DATA
    const { error } = await supabase.from("replacement_requests").insert({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.name,
      customer_name: order.name,
      phone: order.phone,
      reason: reason,
      message: message,
      images: imageUrls.join(","),
      status: "pending",
      user_id: order.user_id
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("❌ Replacement request failed");
    } else {
      alert("✅ Replacement request submitted");
      onClose();
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        <h3>🔁 Replacement Request</h3>

        {/* Reason */}
        <label>Reason</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Select reason</option>
          <option value="Damaged product">Damaged product</option>
          <option value="Wrong product">Wrong product received</option>
          <option value="Quantity issue">Quantity issue</option>
          <option value="Product not working">Product not working</option>
          <option value="Missing item">Missing item</option>
          <option value="Other">Other</option>
        </select>

        {/* Message */}
        <label style={{ marginTop: 10 }}>Message</label>
        <textarea
          placeholder="Explain your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Images */}
        <label style={{ marginTop: 10 }}>Upload images (optional)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />

        <button
          onClick={submitRequest}
          disabled={loading}
          style={{
            marginTop: 15,
            width: "100%",
            background: "#1976ff",
            color: "#fff",
            padding: 12,
            borderRadius: 8,
            border: "none"
          }}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            width: "100%",
            background: "#eee",
            padding: 10,
            borderRadius: 8,
            border: "none"
          }}
        >
          Cancel
        </button>

      </div>
    </div>
  );
          }
