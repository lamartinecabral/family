import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import type { Database } from "./supabase.types.ts";

dotenv.config({ quiet: true });

export const getSupabase = () => {
  const projectId = process.env.SUPABASE_PROJECT_ID;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!projectId || !supabaseKey) {
    throw new Error(
      "SUPABASE_PROJECT_ID and SUPABASE_PUBLISHABLE_KEY must be set in the environment variables.",
    );
  }

  return createClient<Database>(
    `https://${projectId}.supabase.co`,
    supabaseKey,
  );
};

export const getSupabaseAdmin = () => {
  const projectId = process.env.SUPABASE_PROJECT_ID;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectId || !supabaseKey) {
    throw new Error(
      "SUPABASE_PROJECT_ID and SUPABASE_SECRET_KEY must be set in the environment variables.",
    );
  }

  return createClient<Database>(
    `https://${projectId}.supabase.co`,
    supabaseKey,
  );
};

export type Data<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
