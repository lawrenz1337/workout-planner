/** @format */

import { supabase } from "../lib/supabase";

export async function deleteCurrentUser(): Promise<void> {
  const { error } = await supabase.rpc("delete_user");
  if (error) {
    throw error;
  }
}
