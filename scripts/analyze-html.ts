import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("page.html", "utf-8");
const $ = cheerio.load(html);

console.log("Analyzing page.html...");
// Look for any image pointing to easytoys assets?
$("img").each((i, el) => {
  const src = $(el).attr("src");
  if (i < 5) console.log("IMG:", src);
});

// Check for structured data
$("script[type='application/ld+json']").each((i, el) => {
  try {
    const data = JSON.parse($(el).html() || "{}");
    if (data['@type'] === 'ItemList' || data['@type'] === 'Product') {
      console.log("Structured Data Found:", data['@type']);
      if (data.itemListElement) {
         console.log("Items:", data.itemListElement.length);
         console.log("Example:", data.itemListElement[0]);
      }
    }
  } catch(e) {}
});

// Check scripts for state
$("script").each((i, el) => {
  const t = $(el).html() || "";
  if (t.includes('window.__INITIAL_STATE__')) {
    const match = t.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/);
    if (match) {
        fs.writeFileSync("state.json", match[1]);
        console.log("Saved state.json!");
    }
  }
});
