import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client (service role).
 *
 * Required env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function mustEnv(value: string | undefined, name: string) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function getSupabaseAdmin() {
  const url = mustEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL");
  const key = mustEnv(supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY");

  // Note: persistSession is disabled since we only use service role on the server.
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

