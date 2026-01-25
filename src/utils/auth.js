// src/utils/auth.js

import { supabase } from "../supabaseClient";

// 🔐 current login user check
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;

  return data?.user || null;
};
