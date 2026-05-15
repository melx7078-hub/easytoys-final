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
    console.log("Going to URL...");
    await page.goto("https://www.easytoys.es/", { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    console.log("Extracting links...");
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.startsWith('http'));
    });
    
    console.log(`Found ${links.length} links. Example: ${links.slice(0, 10).join(', ')}`);
    
    // Check product classes
    const productsInfo = await page.evaluate(() => {
      const productElements = document.querySelectorAll('[class*="product"]');
      const classes = new Set<string>();
      productElements.forEach(el => classes.add(el.className));
      return Array.from(classes);
    });
    
    console.log("Product classes found:", productsInfo.join(", ").substring(0, 500));

    // Try to find any price elements
    const priceElements = await page.evaluate(() => {
      const els = document.querySelectorAll('[class*="price"], [class*="Price"]');
      const texts = new Set<string>();
      els.forEach(el => texts.add(el.textContent?.trim() || ''));
      return Array.from(texts).filter(t => t.length > 0 && /\d/.test(t));
    });
    console.log("Prices found on page:", priceElements.slice(0, 10).join(" | "));

    await browser.close();
  } catch (err) {
    console.error("Puppeteer error:", err);
  }
}

scrape();
