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

    const concurrencyLimit = 20;
    let active = 0;
    let index = 0;
    let completed = 0;

    await new Promise<void>((resolve) => {
        const next = async () => {
            if (index >= products.length) {
                if (active === 0) resolve();
                return;
            }
            
            const product = products[index++];
            active++;
            
            if (!product.image || !product.image.startsWith('http') || product.image.includes('supabase.co')) {
                completed++;
                active--;
                next();
                return;
            }
            
            try {
                const url = product.image;
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                const filename = `${product.id}.jpg`;
                const mimeType = response.headers.get('content-type') || 'image/jpeg';
                
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filename, buffer, {
                        contentType: mimeType,
                        upsert: true
                    });
                    
                if (!uploadError) {
                    const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
                    await supabase.from('products')
                        .update({ image: data.publicUrl })
                        .eq('id', product.id);
                }
            } catch (err) {
                // ignore
            }
            
            completed++;
            if (completed % 100 === 0) console.log(`Processed ${completed}/${products.length} images...`);
            
            active--;
            next();
        };

        for (let i = 0; i < concurrencyLimit; i++) {
            next();
        }
    });
    
    console.log("Done processing all products.");
}

run();
