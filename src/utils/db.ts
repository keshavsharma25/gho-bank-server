import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";
import { Address } from "viem";

export const dbClient = createClient<Database>(
  "https://fbgcvfkkklboxoxjruiu.supabase.co",
  process.env["SUPABASE_ANON_KEY"] as string,
);

export const getLastBookKeepId = async (account: Address) => {
  const { data: lastBookKeepId } = await dbClient
    .from("BookKeep")
    .select("id")
    .eq("account", account)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!(lastBookKeepId && lastBookKeepId[0])) {
    return null;
  }

  return lastBookKeepId[0].id;
};

export const getIsPermit = async (owner: Address) => {
  const { data: lastBookKeepId } = await dbClient
    .from("Accounts")
    .select("last_bookkeep_id")
    .eq("account", owner)
    .single();

  if (!lastBookKeepId) {
    return undefined;
  }

  const { data: bookKeep } = await dbClient
    .from("BookKeep")
    .select("*")
    .eq("id", lastBookKeepId)
    .single();

  if (!bookKeep) {
    return undefined;
  }

  const { isPermit } = bookKeep;

  return { isPermit };
};
