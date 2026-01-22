import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
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
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    const { data: itemData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setOrder(orderData);
    setItems(itemData || []);
    setStatus(orderData?.order_status);
  };

  const updateStatus = async () => {
    await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id);

    alert("Order status updated");
  };

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
        <p><b>Model / Part:</b> {order.model_part || "—"}</p>
      </div>

      {/* PAYMENT */}
      <div className="card">
        <h4>Payment</h4>
        <p>Method: {order.payment_method}</p>
        <p>Status: <b>{order.payment_status}</b></p>

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

      {/* ITEMS */}
      <div className="card">
        <h4>Order Items</h4>

        {items.map((item) => (
          <div key={item.id} className="order-item">
            <div>{item.name}</div>
            <div>₹{item.price} × {item.qty}</div>
          </div>
        ))}

        <h3>Total: ₹{order.total}</h3>
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
