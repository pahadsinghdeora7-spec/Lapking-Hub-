import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    business_name: "",
    gst_number: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        localStorage.setItem(
          "redirect_after_login",
          "/checkout/address"
        );
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) setForm(data);
    };

    loadProfile();
  }, [navigate]);

  const saveAddress = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    await supabase
      .from("user_profiles")
      .update(form)
      .eq("user_id", user.id);

    navigate("/checkout/shipping");
  };

  return (
    <div className="checkout-box">
      <h2>Delivery Address</h2>

      <input
        placeholder="Full Name"
        value={form.full_name || ""}
        onChange={(e) =>
          setForm({
            ...form,
            full_name: e.target.value
          })
        }
      />

      <input
        placeholder="Mobile"
        value={form.mobile || ""}
        onChange={(e) =>
          setForm({
            ...form,
            mobile: e.target.value
          })
        }
      />

      <textarea
        placeholder="Address"
        value={form.address || ""}
        onChange={(e) =>
          setForm({
            ...form,
            address: e.target.value
          })
        }
      />

      <input
        placeholder="City"
        value={form.city || ""}
        onChange={(e) =>
          setForm({
            ...form,
            city: e.target.value
          })
        }
      />

      <input
        placeholder="State"
        value={form.state || ""}
        onChange={(e) =>
          setForm({
            ...form,
            state: e.target.value
          })
        }
      />

      <input
        placeholder="Pincode"
        value={form.pincode || ""}
        onChange={(e) =>
          setForm({
            ...form,
            pincode: e.target.value
          })
        }
      />

      <button onClick={saveAddress}>
        Continue →
      </button>
    </div>
  );
}
