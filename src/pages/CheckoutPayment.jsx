import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  async function placeOrder() {
    const address = JSON.parse(
      localStorage.getItem("checkout_address")
    );

    const shipping = JSON.parse(
      localStorage.getItem("checkout_shipping")
    );

    const cart = JSON.parse(
      localStorage.getItem("cart_items")
    );

    if (!address || !shipping || !cart) {
      alert("Checkout data missing");
      return;
    }

    const itemsTotal = cart.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    const grandTotal =
      itemsTotal + Number(shipping.charge || 0);

    // ✅ INSERT ORDER
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        gst: address.gst || null,
        courier: shipping.courier,
        courier_charge: shipping.charge,
        total: grandTotal,
        payment_status: "Pending",
        status: "New"
      })
      .select()
      .single();

    if (error) {
      console.log(error);
      alert("Order not placed");
      return;
    }

    // ✅ INSERT ITEMS
    for (let item of cart) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: item.id,
        price: item.price,
        qty: item.qty
      });
    }

    // ✅ CLEANUP
    localStorage.removeItem("cart_items");
    localStorage.removeItem("checkout_address");
    localStorage.removeItem("checkout_shipping");

    navigate("/order/success");
  }

  return (
    <div className="checkout-payment">
      <h2>Payment</h2>

      <button
        className="pay-btn"
        onClick={placeOrder}
      >
        Confirm Order
      </button>
    </div>
  );
}
