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

    // 📸 upload images (optional)
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

    // 💾 SAVE REPLACEMENT REQUEST
    const { error } = await supabase
      .from("replacement_requests")
      .insert({
        order_id: order.id,
        product_id: item.product_id || null,
        product_name: item.name,

        customer_name: order.name || "Customer",
        phone: order.phone || "",

        user_id: order.user_id,
        reason: reason,
        message: message,
        images: imageUrls.join(","), // important
        status: "pending"
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("❌ Something went wrong");
    } else {
      alert("✅ Replacement request submitted");
      onClose();
    }
  }

  return (
    <div className="rep-backdrop">
      <div className="rep-box">

        {/* HEADER */}
        <div className="rep-header">
          <h3>🔁 Replacement Request</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* PRODUCT */}
        <div className="rep-product">
          <b>Product:</b> {item.name}
        </div>

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
          placeholder="Explain your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* IMAGES */}
        <label style={{ marginTop: 10 }}>Upload images (optional)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />

        {/* BUTTONS */}
        <button
          className="rep-submit"
          disabled={loading}
          onClick={submitReplacement}
        >
          {loading ? "Submitting..." : "Submit Replacement Request"}
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
