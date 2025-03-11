const { createCSVFile } = require("./create-csv");
const { getUniqueData, readExcelFile } = require("./read-excel");
const { getOldReview, readCSVFile } = require("./read-csv");


async function main() {
    try {
        const oldReviewProduct = await readCSVFile("./file/all_reviews.csv","all");
        const newReviewProduct =  await readExcelFile("./file/active.xlsx","all"); // Assuming this is async
        // console.log(newReviewProduct)

        
        const oldNewIdMap = {};
        const oldNewIdMap2 = {};


        let count = 0 ; 
        
        oldReviewProduct.forEach((oldItem) => {
            const id = oldItem.product_id;
            const title = oldItem.product;
    
            newReviewProduct.forEach((newItem) => {
                const newId = newItem["Product ID"];
                const newTitle = newItem["Product Title"];

                const matchOldTitle = title.substring(0, 30).trim().toLowerCase();
                const matchNewTitle = newTitle.substring(0, 15).trim().toLowerCase();
                
                if (matchOldTitle.includes(matchNewTitle) && !oldNewIdMap2.hasOwnProperty(id)) {
                    console.log(count++);
                    oldNewIdMap2[id] = {newid:newId,title:newTitle,productUrl:newItem["Product Link"],productImageUrl:newItem["Image Link"]};

                }

                
               
                if (title.includes(newTitle) && !oldNewIdMap.hasOwnProperty(id)) {
                    
                    oldNewIdMap[id] = {newid:newId,title:newTitle,productUrl:newItem["Product Link"],productImageUrl:newItem["Image Link"]};
                }
                else{
                    // console.log({newTitle,})
                }
            });
        });

        const all_reviews = []
        oldReviewProduct.forEach((oldItem) => {
            const oldId = oldItem.product_id;
            const newItem = oldNewIdMap[oldId];
        
            if (newItem?.newid && newItem?.title) {
                all_reviews.push({ ...oldItem, product_id: newItem.newid, product:newItem.title,productUrl:newItem.productUrl,productImageUrl:newItem.productImageUrl });
            }else{
                all_reviews.push({ ...oldItem, product_id: "" });
            }
        });


        
        
        console.table(oldNewIdMap);
        // console.log(all_reviews.length)
        // console.log(count)
        // createCSVFile("sample.csv",all_reviews)
        
    
    } catch (error) {
        console.error("Error reading CSV:", error);
    }
    
}

main();