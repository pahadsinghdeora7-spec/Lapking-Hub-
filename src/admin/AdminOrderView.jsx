import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminOrders.css";

export default function AdminOrderView() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    // 🔹 Order
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    // 🔹 Order items
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setOrder(orderData);
    setItems(itemsData || []);
    setStatus(orderData?.order_status || "");
  };

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

  if (!order) return <p>Loading...</p>;

  return (
    <div className="admin-orders">
      <h2>Order #{order.id}</h2>

      {/* CUSTOMER */}
      <div className="card">
        <h4>Customer Details</h4>
        <p><b>Name:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>Address:</b> {order.address}</p>
        <p><b>Model / Part:</b> {order.model_part || "-"}</p>
      </div>

      {/* SHIPPING */}
      <div className="card">
        <h4>Shipping</h4>
        <p><b>Courier:</b> {order.shipping_name}</p>
        <p><b>Charge:</b> ₹{order.shipping_price}</p>
      </div>

      {/* PAYMENT */}
      <div className="card">
        <h4>Payment</h4>
        <p><b>Method:</b> {order.payment_method}</p>
        <p>
          <b>Status:</b>{" "}
          <span className={`badge ${order.payment_status}`}>
            {order.payment_status}
          </span>
        </p>

        {order.payment_status === "pending" && (
          <div className="btn-row">
            <button
              className="btn green"
              onClick={() => updatePayment("paid")}
            >
              Approve Payment
            </button>

            <button
              className="btn red"
              onClick={() => updatePayment("rejected")}
            >
              Reject Payment
            </button>
          </div>
        )}
      </div>

      {/* ORDER STATUS */}
      <div className="card">
        <h4>Order Status</h4>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="new">New</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="btn blue" onClick={updateStatus}>
          Update Status
        </button>
      </div>

      {/* ITEMS */}
      <div className="card">
        <h4>Order Items</h4>

        {items.map((item) => (
          <div key={item.id} className="order-item">
            <div>
              <b>{item.name}</b>
              <div>Qty: {item.qty}</div>
            </div>
            <div>₹{item.price}</div>
          </div>
        ))}

        <hr />
        <h3>Total: ₹{order.total}</h3>
      </div>

      <Link to="/admin/orders" className="view-btn">
        ← Back to Orders
      </Link>
    </div>
  );
}
