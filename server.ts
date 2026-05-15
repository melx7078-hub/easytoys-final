import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Backend Supabase client (Lazy initialization)
  let supabaseAdmin: ReturnType<typeof createClient> | null = null;
  const getSupabaseAdmin = () => {
    if (!supabaseAdmin) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase configuration. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in Secrets.");
      }
      
      // We use the service_role key to bypass RLS when performing backend admin tasks, 
      // or anon key if service role is missing.
      supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    }
    return supabaseAdmin;
  };

  // ---------------------------------------------------------
  // API Routes (Backend logic)
  // ---------------------------------------------------------
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example backend route using Supabase directly
  app.get("/api/server-products", async (req, res) => {
    try {
      const sb = getSupabaseAdmin();
      // Example query: Fetching from a 'products' table. 
      // Adjust this according to your actual DB schema.
      const { data, error } = await sb.from("products").select("*").limit(100);
      
      if (error) throw error;
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Supabase API error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Example POST route handling writes via Backend
  app.post("/api/server-products", async (req, res) => {
    try {
      const sb = getSupabaseAdmin();
      const newProduct = req.body;
      
      const { data, error } = await sb.from("products").insert(newProduct).select();
      if (error) throw error;
      
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ---------------------------------------------------------
  // Vite Middleware (Frontend serving)
  // ---------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
