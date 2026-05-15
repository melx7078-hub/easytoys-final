import fs from 'fs';

async function fetchAlgolia() {
    const appId = "GTGFACTBE6";
    const apiKey = "fd09a24f10ea62a270438320d41e9345";
    const indexName = "Zoekindex-ET_ES";

    const url = `https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`;
    
    const body = {
        params: "query=&hitsPerPage=50"
    };

    console.log("Fetching from Algolia...");
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
    console.log("Hits found:", data.hits.length);
    
    if (data.hits.length > 0) {
        console.log("Raw hit 0:", JSON.stringify(data.hits[0], null, 2));
    }
    
    const products = data.hits.map(hit => {
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

    fs.writeFileSync('extracted-products.json', JSON.stringify(products, null, 2));
    console.log("Saved extracted-products.json");
    if (products.length > 0) {
        console.log("Sample:", products[0]);
    }
}

fetchAlgolia().catch(console.error);
