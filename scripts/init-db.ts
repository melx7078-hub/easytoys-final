import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error('ERROR: Missing SUPABASE_DB_URL in environment/secrets.');
  console.error('Please add the connection string (starting with postgresql://...) to your Secrets panel so we can create/read tables programmatically.');
  process.exit(1);
}

const createTableQuery = `
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text,
  description text,
  price numeric NOT NULL,
  original_price numeric,
  image text,
  is_new boolean DEFAULT false,
  rating numeric,
  review_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;

async function initDB() {
  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
    console.log('Connected to database!');
    await client.query(createTableQuery);
    console.log('Database initialized successfully: Table "products" exists or was created.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.end();
  }
}

initDB();
