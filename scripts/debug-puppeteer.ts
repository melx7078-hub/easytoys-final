import puppeteer from 'puppeteer';

async function scrape() {
  console.log("Launching puppeteer...");
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    
    // Intercept network
    let foundProducts = false;
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('algolia') || url.includes('api') || url.includes('graphql')) {
        try {
          const json = await response.json();
          if (json.results || json.hits || json.products || (json.items && json.items.length > 0)) {
             console.log(`Found product data at ${url.substring(0, 80)}...`);
             const items = json.hits || json.results?.[0]?.hits || json.items || Object.values(json.products || {});
             if (items && Array.isArray(items) && items.length > 0) {
               console.log("Extracted items:", items.length);
               console.log("First item sample:", JSON.stringify(items[0]).substring(0, 150));
               foundProducts = true;
               
               // Save to a file
               const fs = await import('fs');
               fs.writeFileSync('intercepted-products.json', JSON.stringify(items, null, 2));
               console.log("Saved intercepted-products.json!");
             }
          }
        } catch (e) {
          // not json or failed
        }
      }
    });

    console.log("Going to URL...");
    await page.goto("https://www.easytoys.es/sex-toys-para-mujeres/vibradores/", { waitUntil: 'networkidle0', timeout: 45000 });
    
    if (!foundProducts) {
       console.log("No structured API products found during navigation.");
    }

    await browser.close();
  } catch (err) {
    console.error("Puppeteer error:", err);
  }
}

scrape();
