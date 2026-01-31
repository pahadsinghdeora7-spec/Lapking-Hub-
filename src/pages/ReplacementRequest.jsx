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

    // upload images
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

    const { error } = await supabase.from("replacement_requests").insert({
      order_id: order.id,
      product_id: item.product_id || null,

      product_name: item.name,
      customer_name: order.name || "Customer",
      phone: order.phone || "",

      reason,
      message,
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
    <div className="rep-backdrop">
      <div className="rep-box">

        <div className="rep-header">
          <h3>🔁 Replacement Request</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <p className="rep-product">
          <b>Product:</b> {item.name}
        </p>

        <label>Reason</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Select reason</option>
          <option>Damaged product</option>
          <option>Wrong product received</option>
          <option>Quantity issue</option>
          <option>Product not working</option>
          <option>Missing item</option>
          <option>Other</option>
        </select>

        <label>Message</label>
        <textarea
          placeholder="Explain your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <label>Upload images (optional)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />

        <button
          className="rep-submit"
          onClick={submitReplacement}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        <button className="rep-cancel" onClick={onClose}>
          Cancel
        </button>

        <p className="rep-note">
          Replacement requests are reviewed within 24–48 hours.
        </p>
      </div>
    </div>
  );
}
