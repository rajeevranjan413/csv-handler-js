const fs = require('fs');
const csv = require('csv-parser');

const readCSVFile = (filePath, neededFields = []) => {
    return new Promise((resolve, reject) => {
        const data = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {

                let filteredRow = {};

                // If neededFields is "all", return all fields
                if (neededFields === "all") {
                    filteredRow = { ...row }; // Copy all fields
                }else if(neededFields.length === 1 ){
                    data.push(row[neededFields[0]])
                } 
                else {
                    // Extract only the needed fields
                    neededFields.forEach(field => {
                        if (row[field] !== undefined) {
                            filteredRow[field] = row[field];
                        }
                    });
                }

                data.push(filteredRow);
            })
            .on('end', () => {
                // Remove duplicates using a Map
                // resolve(Array.from(new Map(data.map(item => [JSON.stringify(item), item])).values()));
               
                resolve(data);

            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

module.exports = {
    readCSVFile
};