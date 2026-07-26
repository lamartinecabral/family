import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { Client } from "pg";

dotenv.config({ quiet: true });

const supabaseProjectId = process.env.SUPABASE_PROJECT_ID;
const supabasePassword = process.env.SUPABASE_PASSWORD;

if (!supabaseProjectId || !supabasePassword) {
  throw new Error(
    "SUPABASE_PROJECT_ID and SUPABASE_PASSWORD must be set in the environment variables.",
  );
}

try {
  console.log("Connecting to remote database...");
  const client = new Client({
    host: `db.${supabaseProjectId}.supabase.co`,
    port: 5432,
    user: "postgres",
    password: supabasePassword,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(await readFile("src/schema.sql", "utf8"));
  await client.end();
  console.log("Supabase schema applied successfully.");
} catch (error) {
  console.error("Error applying Supabase schema:", error);
  process.exit(1);
}
