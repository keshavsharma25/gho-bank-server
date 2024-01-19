import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

export const dbClient = createClient<Database>(
  "https://fbgcvfkkklboxoxjruiu.supabase.co",
  process.env["SUPABASE_ANON_KEY"] as string,
);
