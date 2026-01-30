import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadOrder() {
    setLoading(true);
    setErr(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase order fetch error:", error);
        setErr("Order not found.");
        setOrder(null);
      } else {
        // items may be JSON string or array
        let items = data.items;
        try {
          if (typeof items === "string") items = JSON.parse(items);
        } catch (e) {
          // parse fail — keep original
        }
        setOrder({ ...data, items: items || [] });
      }
    } catch (e) {
      console.error(e);
      setErr("Unable to load order.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 20 }}>⏳ Loading order details...</div>;
  }

  if (err) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>
        <button onClick={() => navigate(-1)} style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "none",
          background: "#1976ff",
          color: "#fff"
        }}>
          ← Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: 20 }}>
        No order data.
      </div>
    );
  }

  const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : "-";

  return (
    <div style={{ padding: 15, maxWidth: 920, margin: "0 auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
      }}>
        <h2 style={{ margin: 0 }}>📦 Order #{order.order_code || order.id}</h2>
        <div style={{ color: "#666" }}>{dateStr}</div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 12
      }}>
        <div style={{
          background: "#fff",
          padding: 14,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
        }}>
          <h4 style={{ marginTop: 0 }}>👤 Customer</h4>
          <div><strong>Name:</strong> {order.name || "-"}</div>
          <div><strong>Phone:</strong> {order.phone || "-"}</div>
          <div style={{ marginTop: 8 }}>
            <strong>Address:</strong>
            <div style={{ color: "#444", marginTop: 6 }}>
              {order.address || "-"}
            </div>
          </div>
        </div>

        <div style={{
          background: "#fff",
          padding: 14,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
        }}>
          <h4 style={{ marginTop: 0 }}>🧾 Order Items</h4>

          {Array.isArray(order.items) && order.items.length > 0 ? (
            order.items.map((it, i) => {
              // item shape may vary; handle common keys
              const name = it.name || it.title || it.product_name || "Item";
              const qty = it.qty ?? it.quantity ?? 1;
              const price = it.price ?? it.unit_price ?? it.total ?? 0;
              const img = it.image || it.thumbnail || "";
              return (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: i < order.items.length - 1 ? "1px dashed #eee" : "none"
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {img ? (
                      <img src={img} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid #f0f0f0" }} />
                    ) : (
                      <div style={{
                        width: 56, height: 56, borderRadius: 6, background: "#f5f7ff",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#1976ff", fontWeight: 700
                      }}>
                        {String(name).charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div style={{ fontWeight: 700 }}>{name}</div>
                      <div style={{ fontSize: 13, color: "#666" }}>Qty: {qty}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 120 }}>
                    <div style={{ fontWeight: 800 }}>₹{price * qty}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>₹{price} each</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ color: "#666" }}>No items found.</div>
          )}
        </div>

        <div style={{
          background: "#fff",
          padding: 14,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12
        }}>
          <div>
            <div><strong>Courier:</strong> {order.shipping_name || "-"}</div>
            <div><strong>Delivery Charge:</strong> ₹{order.shipping_price ?? 0}</div>
            <div style={{ marginTop: 8 }}><strong>Payment Status:</strong> {order.payment_status || "-"}</div>
            <div style={{ marginTop: 4 }}><strong>Order Status:</strong> {order.order_status || "-"}</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#666" }}>Total amount</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>₹{order.total ?? 0}</div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => navigate(-1)} style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer"
              }}>
                ← Back
              </button>

              <button onClick={() => navigate(`/replacement/order/${order.id}`)} style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "#1976ff",
                color: "#fff",
                cursor: "pointer"
              }}>
                Request Replacement
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", color: "#666", fontSize: 13 }}>
          If you need help with replacement or returns, click Request Replacement and follow steps.
        </div>
      </div>
    </div>
  );
        }
