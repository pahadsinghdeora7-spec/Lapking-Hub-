import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aulrnbxtzmjczalspmuv.supabase.co";
const supabaseKey = "sb_publishable_4YoKd1pRffAWkcmg7-pAtg_iDp4hMmC"; // aapka public key

export const supabase = createClient(supabaseUrl, supabaseKey);
