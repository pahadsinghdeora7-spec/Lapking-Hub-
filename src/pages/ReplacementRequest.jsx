import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ReplacementRequest() {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();

  const [reasonType, setReasonType] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📤 Upload image
  const uploadImage = async (file) => {
    const fileName = `replacement-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("replacements")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("replacements")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ✅ Submit request
  const submitRequest = async () => {
    if (!reasonType || !image) {
      alert("Reason aur photo dono required hai");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage(image);

      const user = (await supabase.auth.getUser()).data.user;

      const { error } = await supabase.from("replacement_requests").insert([
        {
          order_id: Number(orderId),
          product_id: Number(productId),
          user_email: user?.email || "",
          reason_type: reasonType,
          message: message,
          image: imageUrl,
          status: "pending",
        },
      ]);

      if (error) throw error;

      alert("Replacement request submit ho gayi ✅");
      navigate("/my-orders");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="replacement-page">
      <h2>Request Replacement</h2>

      <div className="box">
        <label>Reason</label>
        <select
          value={reasonType}
          onChange={(e) => setReasonType(e.target.value)}
        >
          <option value="">Select reason</option>
          <option value="Wrong Item">Wrong Item Received</option>
          <option value="Damaged Product">Damaged Product</option>
          <option value="Warranty Replacement">Warranty Replacement</option>
          <option value="Other">Other</option>
        </select>

        <label>Upload Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <label>Message (optional)</label>
        <textarea
          placeholder="Problem explain karo..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={submitRequest} disabled={loading}>
          {loading ? "Submitting..." : "Submit Replacement Request"}
        </button>
      </div>
    </div>
  );
        }
