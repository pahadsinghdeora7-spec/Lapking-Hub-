import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;https://oprsuzvbabyhpowtepoj.supabase.co
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;sb_publishable_f6Bw9BZTgsKqKcNmbkEIqw_ELi86TJw

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
