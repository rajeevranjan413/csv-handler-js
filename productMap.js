const { createCSVFile } = require("./create-csv");
const { readCSVFile } = require("./readCSV");
const { readExcelFile } = require("./readExcel");

async function main() {
    try {
        const reviewData = await readCSVFile("./file/2025-03-07-00_48_11.000050.csv", ["Product Name", "Page ID"]);
        
        const productData = await readExcelFile("./scrap.csv", ["Product Title", "Product ID"]);
        console.log(productData.length);

        const dataSet = new Set();
        let count = 0;
        const data = []
        const notFoundData = []
        productData.forEach((product) => {
            const productTitle = product["Product Title"];
            const productId = product["Product ID"];
            let founded = false
            let reviewTitle = ""
            reviewData.forEach((review) => {
                
                reviewTitle= review["Product Name"];
                const reviewId = review["Page ID"];
               

                if (productTitle === reviewTitle) {
                    founded = true
                    const key = `${reviewId},${productId}`; // Create a unique key
                    if (!dataSet.has(key)) { // Check for duplicates
                        dataSet.add(key);
                        console.log(count++)
                        data.push({productId,reviewId,productTitle})
                    }
                }
            });
            if(!founded){
                notFoundData.push({productTitle,productId})
            }
        });


        // const data = Array.from(dataSet).map(entry => {
        //     const [reviewId, productId] = entry.split(",");
        //     return { reviewId, productId };
        // });
        
        console.table(notFoundData)
        console.table(data)


        createCSVFile("FoundMap.csv",data)
        createCSVFile("NotFound.csv",notFoundData)





    } catch (error) {
        console.error("Error reading CSV:", error);
    }

}

main();