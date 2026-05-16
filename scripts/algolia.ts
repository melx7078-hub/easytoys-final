import fs from 'fs';

async function fetchAlgolia() {
    const appId = "GTGFACTBE6";
    const apiKey = "fd09a24f10ea62a270438320d41e9345";
    const indexName = "Zoekindex-ET_ES";

    const url = `https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`;
    
    const products = [];
    let page = 0;
    const hitsPerPage = 500;
    const targetHits = 2000;
    
    while (products.length < targetHits) {
        console.log(`Fetching page ${page} from Algolia...`);
        const body = {
            params: `query=&hitsPerPage=${hitsPerPage}&page=${page}`
        };

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Algolia-API-Key": apiKey,
                "X-Algolia-Application-Id": appId
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error("HTTP error " + res.status + " " + await res.text());
        }

        const data = await res.json();
        const hits = data.hits;
        
        if (hits.length === 0) break;

        const pageProducts = hits.map(hit => {
             let price = parseFloat(hit.prijs) || 0;
             let originalPrice = hit.prices?.EUR?.market_price ? parseFloat(hit.prices.EUR.market_price) : null;
             
             return {
                 name: hit.titel || hit.titel_en || hit.merk,
                 price: price,
                 original_price: originalPrice,
                 image: hit.image || "",
                 description: hit.bulletpoints || hit.titel || hit.merk,
                 category: hit.hierarchicalCategories?.lvl0?.[0] || hit.categories?.[0] || "Sex toys para mujeres",
                 is_new: false,
                 rating: hit.rating || 4.5,
                 review_count: hit.rating_amount || 0
            };
        });

        products.push(...pageProducts);
        console.log(`Added ${pageProducts.length} from page ${page}. Total: ${products.length}`);
        
        if (page >= data.nbPages - 1) break;
        page++;
    }

    fs.writeFileSync('extracted-products.json', JSON.stringify(products, null, 2));
    console.log("Saved extracted-products.json");
    if (products.length > 0) {
        console.log("Sample:", products[0]);
    }
}

fetchAlgolia().catch(console.error);
