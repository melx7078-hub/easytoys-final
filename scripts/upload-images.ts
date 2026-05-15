import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import https from 'https';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadImage(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    console.log("Checking for bucket...");
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === 'product-images')) {
        console.log("Creating bucket product-images...");
        const { error } = await supabase.storage.createBucket('product-images', { public: true });
        if (error) {
            console.error("Error creating bucket:", error);
            return;
        }
    }

    console.log("Fetching products from DB...");
    const { data: products, error: fetchError } = await supabase.from('products').select('*');
    if (fetchError || !products) {
        console.error("Error fetching products:", fetchError);
        return;
    }

    console.log(`Found ${products.length} products. Processing images...`);

    for (const product of products) {
        if (!product.image || !product.image.startsWith('http')) {
            continue;
        }
        
        console.log(`Processing product: ${product.name}`);
        const url = product.image;
        
        try {
            // Fetch image buffer
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            const filename = `${product.id}.jpg`;
            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            
            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filename, buffer, {
                    contentType: mimeType,
                    upsert: true
                });
                
            if (uploadError) {
                console.error(`Failed to upload ${filename}:`, uploadError);
                continue;
            }
            
            // Get public URL
            const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
            const newUrl = data.publicUrl;
            
            // Update product in DB
            const { error: updateError } = await supabase.from('products')
                .update({ image: newUrl })
                .eq('id', product.id);
                
            if (updateError) {
                console.error(`Failed to update DB for ${product.id}:`, updateError);
            } else {
                console.log(`Successfully updated ${product.id} with new URL`);
            }
            
        } catch (err) {
            console.error(`Error processing ${product.id}:`, err);
        }
    }
    
    console.log("Done processing all products.");
}

run();
