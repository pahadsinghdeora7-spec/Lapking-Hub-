import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminOrders.css";

export default function AdminOrderView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Load order
  const loadOrder = async () => {
    setLoading(true);

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setOrder(orderData);
    setItems(itemsData || []);
    setStatus(orderData?.order_status || "");
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, []);

  // ✅ Update order status
  const updateStatus = async () => {
    await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id);

    alert("Order status updated");
    loadOrder();
  };

  // ✅ Update payment status
  const updatePayment = async (value) => {
    await supabase
      .from("orders")
      .update({ payment_status: value })
      .eq("id", id);

    loadOrder();
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!order) return <p>Order not found</p>;

  return (
    <div className="admin-orders">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Order #{order.id}</h2>

      {/* CUSTOMER */}
      <div className="card">
        <h4>Customer Details</h4>
        <p><b>Name:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>Email:</b> {order.email || "-"}</p>
        <p><b>Address:</b> {order.address}</p>
        <p><b>Model / Part:</b> {order.model_part || "-"}</p>
      </div>

      {/* SHIPPING */}
      <div className="card">
        <h4>Shipping</h4>
        <p><b>Courier:</b> {order.shipping_name || "-"}</p>
        <p><b>Charge:</b> ₹{order.shipping_price || 0}</p>
      </div>

      {/* PAYMENT */}
      <div className="card">
        <h4>Payment</h4>
        <p>
          <b>Method:</b> {order.payment_method}
        </p>

        <p>
          <b>Status:</b>{" "}
          <span className={`badge ${order.payment_status}`}>
            {order.payment_status}
          </span>
        </p>

        {order.payment_status === "pending" && (
          <button
            className="btn green"
            onClick={() => updatePayment("paid")}
          >
            Approve Payment
          </button>
        )}
      </div>

      {/* ITEMS */}
      <div className="card">
        <h4>Items</h4>

        {items.length === 0 && <p>No items</p>}

        {items.map((item) => (
          <div key={item.id} className="order-item">
            <p><b>{item.product_name}</b></p>
            <p>Qty: {item.qty}</p>
            <p>Price: ₹{item.price}</p>
          </div>
        ))}
      </div>

      {/* STATUS */}
      <div className="card">
        <h4>Order Status</h4>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="new">New</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="btn blue" onClick={updateStatus}>
          Update Status
        </button>
      </div>

    </div>
  );
      }
