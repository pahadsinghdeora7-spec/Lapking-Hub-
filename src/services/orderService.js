// src/services/orderService.js

import { supabase } from "../supabaseClient.js";

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        model_part: orderData.modelPart || "",
        shipping_name: orderData.shippingName,
        shipping_price: orderData.shippingPrice,
        total: orderData.total,
        payment_method: orderData.paymentMethod,
        payment_status: "pending",
        order_status: "new",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Order error:", error);
    throw error;
  }

  return data;
}
