import axios from "axios";
import * as cheerio from "cheerio";

async function debug() {
  const result = await axios.get("https://www.easytoys.es/", {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
  });

  const $ = cheerio.load(result.data);
  const elements = $('div[data-price-amount], span.price');
  console.log("Price elements:", elements.length);
  const classes = new Set();
  $('*').each((i, el) => {
    const c = $(el).attr('class');
    if (c && c.includes('product')) {
      classes.add(c);
    }
  });
  console.log("Product classes:", Array.from(classes).join(", ").substring(0, 500));
}
debug();
