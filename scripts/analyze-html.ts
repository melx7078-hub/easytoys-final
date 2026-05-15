import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('page.html', 'utf-8');
const $ = cheerio.load(html);

const products = [];

// EasyToys HTML: let's try to find elements with data attributes
// often it's "data-product-sku" or class="product-item"
// Let's just iterate ALL links and gather the ones that contain an image and some text
$('a').each((i, el) => {
    const $a = $(el);
    const imgUrl = $a.find('img').first().attr('src') || $a.find('img').first().attr('data-src');
    
    // get all text inside this link, replace newlines
    const linkText = $a.text().replace(/\s+/g, ' ').trim();
    
    // Look for price parts: a number followed by comma and 2 digits
    const priceMatch = linkText.match(/(\d+),(\d{2})/g);
    
    // Let's also check if it contains product-like words
    const hasProductWord = /(vibrador|dildo|plug|estimulador|masturbador|juguete|console)/i.test(linkText);
    
    if (imgUrl && imgUrl.startsWith('http') && priceMatch && hasProductWord && linkText.length > 20) {
         
         // extract name by splitting at the first price or PVR or rating "(XX)"
         let name = linkText;
         const splitMatch = linkText.match(/\(\d+\)|PVR|\d+,\d{2}/);
         if (splitMatch && splitMatch.index) {
             name = linkText.substring(0, splitMatch.index).trim();
         }
         
         // Remove any leading "-XX%" discount tag
         name = name.replace(/^-\d+%\s*/, '').trim();
         
         if (name && name.length > 5 && !products.find(p => p.name === name)) {
             const amounts = priceMatch.map(p => parseFloat(p.replace(',', '.')));
             let price = Math.min(...amounts);
             let originalPrice = amounts.length > 1 ? Math.max(...amounts) : null;
             
             products.push({
                 name,
                 price,
                 original_price: originalPrice,
                 image: imgUrl,
                 description: name,
                 category: "Para mujeres",
                 is_new: Math.random() > 0.8,
                 rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
                 review_count: Math.floor(Math.random() * 1000) + 10
             });
         }
    }
});

console.log(`Extracted ${products.length} products with simple string matching.`);

if (products.length < 50) {
   console.log("Will try picking ANY node with a name and image and price...");
   const allCards = $('div').filter((i, el) => {
       const t = $(el).text();
       return t.includes(',99') && $(el).find('img').length > 0;
   });
   
   console.log(`Found ${allCards.length} possible div cards. Need to parse tighter.`);
}

fs.writeFileSync('extracted-products.json', JSON.stringify(products, null, 2));

if (products.length > 0) {
    console.log("Sample:", products[0]);
    console.log("List of names:", products.map(p => p.name));
}





