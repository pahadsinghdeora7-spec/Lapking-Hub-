import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  FaBox,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id);

    fetchOrders();
  };

  return (
    <div className="admin-page">

      <h2 className="page-title">
        <FaBox /> Orders
      </h2>

      <div className="card">

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Courier</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id}>
                  <td>{i + 1}</td>
                  <td>{o.name}</td>
                  <td>{o.phone}</td>
                  <td>₹{o.total}</td>

                  <td>
                    {o.shipping_name ? (
                      <>
                        <FaTruck /> {o.shipping_name}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {o.payment_status === "paid" ? (
                      <span className="badge green">
                        <FaMoneyBillWave /> Paid
                      </span>
                    ) : (
                      <span className="badge red">
                        <FaMoneyBillWave /> Pending
                      </span>
                    )}
                  </td>

                  <td>
                    {o.order_status === "completed" ? (
                      <span className="badge green">
                        <FaCheckCircle /> Completed
                      </span>
                    ) : o.order_status === "cancelled" ? (
                      <span className="badge red">
                        <FaTimesCircle /> Cancelled
                      </span>
                    ) : (
                      <span className="badge blue">
                        Processing
                      </span>
                    )}
                  </td>

                  <td className="actions">
                    <button
                      className="btn small"
                      onClick={() =>
                        updateStatus(o.id, "completed")
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn small red"
                      onClick={() =>
                        updateStatus(o.id, "cancelled")
                      }
                    >
                      <FaTimesCircle />
                    </button>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" align="center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
