import { createClient, SupabaseClient } from "@supabase/supabase-js";

const serviceAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl || !serviceAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

let supabase;

try {
  supabase = createClient(supabaseUrl, serviceAnonKey);
} catch (error) {
  console.error("Error creating Supabase client:", error);
  throw new Error("Failed to initialize Supabase client");
}

export { supabase };