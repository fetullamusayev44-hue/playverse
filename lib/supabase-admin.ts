import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseServiceKey) {
  throw new Error("supabaseKey is required");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceKey
);