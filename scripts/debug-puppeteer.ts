import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrape() {
  console.log("Launching puppeteer...");
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    
    console.log("Going to URL...");
    await page.goto("https://www.easytoys.es/sex-toys-para-mujeres", { waitUntil: 'networkidle2', timeout: 45000 });
    
    fs.writeFileSync('page.html', await page.content());
    
    // Scroll a bit to trigger lazy loading
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight || totalHeight > 5000) {
                    clearInterval(timer);
                    resolve(true);
                }
            }, 100);
        });
    });

    console.log("Extracting products...");
    
    const products = await page.evaluate(() => {
        const currencyElements = Array.from(document.querySelectorAll('*')).filter(el => {
             return el.children.length === 0 && el.textContent?.includes('€');
        });
        
        const extracted = [];
        const seenNames = new Set();
        
        for (const priceEl of currencyElements) {
             let container = priceEl.parentElement;
             let depth = 0;
             while (container && depth < 6) {
                 const nameEl = container.querySelector('h2, h3, h4, .name');
                 const imgEl = container.querySelector('img');
                 const allPrices = Array.from(container.querySelectorAll('*'))
                     .filter(n => n.children.length === 0 && n.textContent?.includes('€'))
                     .map(n => n.textContent?.trim());
                 
                 if (nameEl && imgEl && allPrices.length > 0) {
                     const name = nameEl.textContent?.trim();
                     if (name && !seenNames.has(name) && name.length > 3) {
                         seenNames.add(name);
                         
                         let priceStr = allPrices[0].replace('€', '').replace(',', '.').trim();
                         let price = parseFloat(priceStr) || 0;
                         let originalPrice = null;
                         
                         if (allPrices.length > 1) {
                             const p1 = parseFloat(allPrices[0].replace('€', '').replace(',', '.').trim());
                             const p2 = parseFloat(allPrices[1].replace('€', '').replace(',', '.').trim());
                             if (!isNaN(p1) && !isNaN(p2)) {
                                 if (p1 > p2) { originalPrice = p1; price = p2; }
                                 else { originalPrice = p2; price = p1; }
                             }
                         }

                         extracted.push({
                             name,
                             price,
                             original_price: originalPrice,
                             image: imgEl.src,
                             description: name,
                             category: "Para mujeres",
                             is_new: false,
                             rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
                             review_count: Math.floor(Math.random() * 1000) + 10
                         });
                         break;
                     }
                 }
                 container = container.parentElement;
                 depth++;
             }
        }
        return extracted;
    });
    
    console.log(`Extracted ${products.length} products.`);
    fs.writeFileSync('extracted-products.json', JSON.stringify(products, null, 2));

    await browser.close();
  } catch (err) {
    console.error("Puppeteer error:", err);
    process.exit(1);
  }
}

scrape();
