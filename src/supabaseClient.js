import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aulrnbxtzmjczalspmuv.supabase.co';
const supabaseAnonKey = 'sb_publishable_4YoKd1pRffAWkcmg7-pAtg_iDp4hMmC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
