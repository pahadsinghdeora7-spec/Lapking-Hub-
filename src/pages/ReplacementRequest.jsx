import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./ReplacementRequest.css";

export default function ReplacementRequest() {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadImages = async () => {
    let urls = [];

    for (let file of images) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("replacement-images")
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from("replacement-images")
          .getPublicUrl(fileName);

        urls.push(data.publicUrl);
      }
    }

    return urls.join(",");
  };

  const submitRequest = async () => {
    if (!reason) {
      alert("Please select reason");
      return;
    }

    setLoading(true);

    const imageUrls = await uploadImages();

    await supabase.from("replacement_requests").insert([
      {
        order_id: orderId,
        product_id: productId,
        reason,
        message,
        images: imageUrls,
        status: "pending",
      },
    ]);

    setLoading(false);
    alert("Replacement request submitted");
    navigate("/orders");
  };

  return (
    <div className="replacement-box">
      <h2>Request Replacement</h2>

      <label>Reason</label>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        <option value="">Select</option>
        <option value="wrong_item">Wrong Item</option>
        <option value="damaged">Damaged Product</option>
        <option value="warranty">Under Warranty</option>
      </select>

      <label>Message</label>
      <textarea
        placeholder="Explain your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <label>Upload Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages([...e.target.files])}
      />

      <button onClick={submitRequest} disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
    }
