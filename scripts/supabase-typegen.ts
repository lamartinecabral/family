import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config({ quiet: true });

const supabaseProjectId = process.env.SUPABASE_PROJECT_ID;

if (!supabaseProjectId) {
  throw new Error(
    "SUPABASE_PROJECT_ID must be set in the environment variables.",
  );
}

const command = `npx supabase gen types typescript --project-id "${supabaseProjectId}" --schema public > src/generated/db.types.ts`;

try {
  execSync(command, { stdio: "inherit" });
  console.log("Supabase types generated successfully.");
} catch (error) {
  console.error("Error generating Supabase types:", error);
  process.exit(1);
}
