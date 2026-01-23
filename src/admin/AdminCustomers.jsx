import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    // orders
    const { data: orders } = await supabase
      .from("orders")
      .select("id, name, phone, email, total, created_at")
      .order("created_at", { ascending: false });

    // order items
    const { data: items } = await supabase
      .from("order_items")
      .select("order_id, name");

    if (!orders) return;

    const map = {};

    orders.forEach((o) => {
      const key = o.phone || o.email;

      if (!map[key]) {
        map[key] = {
          name: o.name,
          phone: o.phone,
          email: o.email,
          orders: 0,
          amount: 0,
          last: o.created_at,
          items: new Set(),
        };
      }

      map[key].orders += 1;
      map[key].amount += Number(o.total || 0);

      if (new Date(o.created_at) > new Date(map[key].last)) {
        map[key].last = o.created_at;
      }

      // attach items
      items?.forEach((it) => {
        if (it.order_id === o.id) {
          map[key].items.add(it.name);
        }
      });
    });

    // convert Set → string
    const result = Object.values(map).map((c) => ({
      ...c,
      items: Array.from(c.items).join(", "),
    }));

    setCustomers(result);
  };

  return (
    <div className="admin-page">
      <h2>Customers</h2>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Items Purchased</th>
              <th>Total Orders</th>
              <th>Total Amount</th>
              <th>Last Order</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan="7">No customers found</td>
              </tr>
            )}

            {customers.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.email || "-"}</td>
                <td>{c.items || "-"}</td>
                <td>{c.orders}</td>
                <td>₹{c.amount}</td>
                <td>
                  {new Date(c.last).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
        }
