import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import type { Database } from "./supabase.types.ts";

dotenv.config({ quiet: true });

const projectId = process.env.SUPABASE_PROJECT_ID;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!projectId || !supabaseKey) {
  throw new Error(
    "SUPABASE_PROJECT_ID and SUPABASE_PUBLISHABLE_KEY must be set in the environment variables.",
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  `https://${projectId}.supabase.co`,
  supabaseKey,
);

export type Data<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
