import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 20,
              background: "#fff",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f7fb" }}>
                <th style={th}>Order ID</th>
                <th style={th}>Name</th>
                <th style={th}>Phone</th>
                <th style={th}>Total</th>
                <th style={th}>Payment</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={td}>#{o.id}</td>
                  <td style={td}>{o.name}</td>
                  <td style={td}>{o.phone}</td>
                  <td style={td}>₹{o.total}</td>
                  <td style={td}>{o.payment_status}</td>
                  <td style={td}>{o.order_status}</td>
                  <td style={td}>
                    <Link
                      to={`/admin/orders/${o.id}`}
                      style={{
                        padding: "6px 12px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: 6,
                        textDecoration: "none",
                        fontSize: 13,
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: 12,
  textAlign: "left",
  fontWeight: 600,
  fontSize: 14,
};

const td = {
  padding: 12,
  borderBottom: "1px solid #eee",
  fontSize: 14,
};
