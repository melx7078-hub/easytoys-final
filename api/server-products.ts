import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        success: false, 
        error: "Missing Supabase configuration" 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from("products").select("*").limit(3000);

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Products API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
