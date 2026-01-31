import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./ReplacementRequest.css";

export default function ReplacementRequest({ order, product }) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submitReplacement() {
    if (!reason) {
      alert("Please select replacement reason");
      return;
    }

    setLoading(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    await supabase.from("replacement_requests").insert({
      order_id: order.id,
      product_id: product.id,
      reason: reason,
      message: message,
      status: "pending",
      user_id: user.id
    });

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="replace-success">
        ✅ Replacement request submitted successfully  
        <br />
        Admin will contact you soon.
      </div>
    );
  }

  return (
    <div className="replace-box">

      <h2>🔁 Replacement Request</h2>

      {/* ORDER INFO */}
      <div className="replace-info">
        <p><b>📦 Order ID:</b> {order.order_code}</p>
        <p><b>🛒 Product:</b> {product.name}</p>
      </div>

      {/* REASON */}
      <label>⚠️ Reason</label>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select reason</option>
        <option>Damaged product</option>
        <option>Wrong item received</option>
        <option>Not working</option>
        <option>Missing item</option>
        <option>Other</option>
      </select>

      {/* MESSAGE */}
      <label>📝 Message (optional)</label>
      <textarea
        placeholder="Explain your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* BUTTON */}
      <button
        className="replace-btn"
        onClick={submitReplacement}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Replacement"}
      </button>

    </div>
  );
}
