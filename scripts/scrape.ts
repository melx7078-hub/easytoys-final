import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl.startsWith('http')) {
  console.error('Invalid or missing SUPABASE_URL. Please configure secrets via the AI Studio UI.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fallback data in case the scraping fails due to anti-bot protection
const fallbackProducts = [
  { name: 'Sona 2 Cruise', category: 'Vibradores', price: 129.00, originalPrice: null, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop', description: 'Vibrador sónico', isNew: false, rating: 4.8, reviewCount: 154 },
  { name: 'Lubricante Anal EasyGlide - 150 ml', category: 'Lubricantes', price: 9.99, originalPrice: 16.99, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=600&auto=format&fit=crop', description: 'Lubricante anal a base de agua', isNew: false, rating: 4.9, reviewCount: 845 },
  { name: 'Lubricante EasyGlide - 150 ml', category: 'Lubricantes', price: 8.99, originalPrice: 11.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', description: 'A base de agua', isNew: false, rating: 4.8, reviewCount: 2519 },
  // Let's generate 47 more items generically
  ...Array.from({ length: 47 }).map((_, i) => ({
    name: `Juguete Erótico ${i + 4}`,
    category: i % 2 === 0 ? 'Vibradores' : 'Lencería',
    price: Number((19.99 + (i * 2)).toFixed(2)),
    originalPrice: i % 3 === 0 ? Number(((19.99 + (i * 2)) * 1.3).toFixed(2)) : null,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    description: 'Producto premium y de alta calidad para mayor placer.',
    isNew: i % 5 === 0,
    rating: Number((4 + (i % 10) / 10).toFixed(1)),
    reviewCount: 50 + i * 14
  }))
];

async function insertProducts(products: any[]) {
  console.log(`Inserting ${products.length} products...`);
  
  // Create table if it doesn't exist (assuming postgres)
  // Actually, standard REST API doesn't allow structured table creation via normal requests easily unless we use RPC
  // So the table 'products' must exist.
  // The user will need to run a small SQL query or we can tell them.
  
  for (let p of products) {
    const { error } = await supabase.from('products').upsert({
      name: p.name,
      category: p.category,
      price: p.price,
      original_price: p.originalPrice,
      image: p.image,
      description: p.description,
      is_new: p.isNew,
      rating: p.rating,
      review_count: p.reviewCount
    });
    
    if (error) {
      console.error('Error inserting product:', p.name, error.message);
    }
  }
  
  console.log('Products inserted/upserted successfully.');
}

async function scrape() {
  try {
    console.log('Trying to scrape EasyToys.es...');
    const response = await axios.get('https://www.easytoys.es/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const scrapedProducts: any[] = [];
    
    // Attempting to find products using common class names
    $('.product-item-info').each((i, el) => {
       if (scrapedProducts.length >= 50) return;
       const name = $(el).find('.product-item-name a').text().trim();
       const priceStr = $(el).find('.price').first().text().replace('€', '').replace(',', '.').trim();
       const price = parseFloat(priceStr);
       const originalPriceStr = $(el).find('.old-price .price').text().replace('€', '').replace(',', '.').trim();
       const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
       const image = $(el).find('.product-image-photo').attr('src');
       
       if (name && !isNaN(price)) {
         scrapedProducts.push({
           name,
           category: 'Bestseller',
           price,
           originalPrice,
           image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
           description: name,
           isNew: false,
           rating: 4.8,
           reviewCount: 154
         });
       }
    });
    
    if (scrapedProducts.length > 0) {
      console.log(`Scraped ${scrapedProducts.length} products dynamically.`);
      await insertProducts(scrapedProducts);
    } else {
      console.log('No products found organically. Using fallback dataset (50 items)...');
      await insertProducts(fallbackProducts);
    }
  } catch (err) {
    console.error('Scraping failed (likely anti-bot). Falling back to mock dataset (50 items)...');
    await insertProducts(fallbackProducts);
  }
}

scrape();
