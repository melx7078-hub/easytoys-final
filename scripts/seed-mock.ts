import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function truncateAndSeed() {
  console.log("Connecting to Supabase to clear old products...");
  // Truncate by deleting everything
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error deleting generic products:', deleteError);
  } else {
    console.log('Successfully cleared generic products.');
  }

  // Load the 50 products from Algolia payload
  let products = [];
  try {
      const raw = fs.readFileSync('extracted-products.json', 'utf-8');
      products = JSON.parse(raw);
  } catch (err) {
      console.error("Could not read extracted-products.json", err);
  }
  
  if (products.length > 2500) {
      products = products.slice(0, 2500);
  }
  
  // ensure no duplicate names which might cause DB constraints error
  const uniqueProducts = [];
  const names = new Set();
  for (const p of products) {
      if (!names.has(p.name)) {
          names.add(p.name);
          uniqueProducts.push(p);
      }
  }

  console.log(`Inserting ${uniqueProducts.length} scraped products to Supabase in batches...`);
  
  const batchSize = 500;
  let successCount = 0;
  for (let i = 0; i < uniqueProducts.length; i += batchSize) {
      const batch = uniqueProducts.slice(i, i + batchSize);
      const { error } = await supabase.from('products').insert(batch);
      
      if (error) {
        console.error(`Error inserting products batch ${i/batchSize}:`, error);
      } else {
        successCount += batch.length;
        console.log(`Successfully inserted batch. Total: ${successCount}`);
      }
  }
}

truncateAndSeed();
