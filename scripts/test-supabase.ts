import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

async function testConnection() {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

  console.log("URL setup:", supabaseUrl ? "Found" : "Missing");
  console.log("Key setup:", supabaseKey ? "Found" : "Missing");

  if (!supabaseUrl.startsWith("http")) {
    console.error("Invalid URL format:", supabaseUrl);
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from("products").select("*").limit(1);
    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      console.log("Success! Connected to Supabase.");
    }
  } catch (error) {
    console.error("Setup Error:", error);
  }
}

testConnection();
