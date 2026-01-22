import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oprsvuzvabyhpwtepoj.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcnN1enZiYWJ5aHBvd3RlcG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTAyNzksImV4cCI6MjA4NDU2NjI3OX0.vN18eKV3EOPIrNoiUqFCinYaleOHS6Fld9vCaDsBw2c";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
