const axios = require("axios");
const cheerio = require("cheerio");
const { readCSVFile } = require("./readCSV");
const { createCSVFile } = require("./createCSV");

// Utility function to introduce a delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getScrapData() {
    const data = [];
    try {
        const allProduct = await readCSVFile("./file/products_export_1.csv", ["Handle"]);
        const allHandles = [...new Set(allProduct)];

        // Loop through each handle with a 10-second delay
        for (const handle of allHandles) {
            const scrapUrl = "https://www.galleryfurniture.com/products/" + handle;
            try {
                const response = await axios.get(scrapUrl);
                const $ = cheerio.load(response.data);

                const productId = $("#productDetailDiv").attr("product_id");
                const productTitle = $("#productDetailDiv").attr("product_title");

                data.push({
                    'Product Title': productTitle,
                    'Product ID': productId
                });

                console.log(`Scraped data for handle: ${handle}`);
            } catch (err) {
                console.error(`Error scraping handle: ${handle}`, err.message);
            }

            // Introduce a 10-second delay before the next request
            await sleep(10000); // 10 seconds
        }

        console.log("Scraping completed. Data:", data);
        createCSVFile("scrap.csv",data)
    } catch (err) {
        console.error("Error in getScrapData:", err);
    }
}

getScrapData();