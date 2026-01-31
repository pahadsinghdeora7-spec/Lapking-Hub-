import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./ReplacementRequest.css";

export default function ReplacementRequest({ order, item, onClose }) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function submitReplacement() {
    if (!reason) {
      alert("Please select replacement reason");
      return;
    }

    setLoading(true);

    let imageUrls = [];

    // 📸 Upload images (optional)
    for (let file of images) {
      const fileName = `replacement-${Date.now()}-${file.name}`;

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

    // 💾 Save request
    const { error } = await supabase.from("replacement_requests").insert({
      order_id: order.id,
      product_id: item.product_id || null,
      reason: reason,
      message: message,
      images: imageUrls,
      status: "pending",
      user_id: order.user_id
    });

    if (error) {
      alert("❌ Replacement request failed");
      console.error(error);
    } else {
      alert("✅ Replacement request submitted successfully");
      onClose();
    }

    setLoading(false);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h3>🔁 Replacement Request</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="modal-body">

          <p style={{ fontWeight: 600 }}>
            Product: {item.name}
          </p>

          {/* REASON */}
          <label>Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select reason</option>
            <option>Damaged product</option>
            <option>Wrong product received</option>
            <option>Quantity issue (less / more)</option>
            <option>Product not working</option>
            <option>Missing item</option>
            <option>Other</option>
          </select>

          {/* MESSAGE */}
          <label style={{ marginTop: 10 }}>Message</label>
          <textarea
            placeholder="Explain your issue in detail..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* IMAGES */}
          <label style={{ marginTop: 10 }}>
            Upload images (optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
          />

          {/* SUBMIT */}
          <button
            disabled={loading}
            onClick={submitReplacement}
            className="submit-btn"
          >
            {loading ? "Submitting..." : "Submit Replacement Request"}
          </button>

          <button
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}
