const reader = require('xlsx');

const readExcelFile = (filePath, selectedKeys = []) => {
    return new Promise((resolve, reject) => {
        try {
            const file = reader.readFile(filePath);
            const sheets = file.SheetNames;
            let data = [];

            for (let i = 0; i < sheets.length; i++) {
                const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
                temp.forEach((row) => {
                    let filteredObj = {};

                    // If selectedKeys is "all", return all fields
                    if (selectedKeys === "all") {
                        filteredObj = { ...row }; // Copy all fields
                    } else {
                        // Extract only the selected keys
                        selectedKeys.forEach((key) => {
                            if (row.hasOwnProperty(key)) {
                                filteredObj[key] = row[key];
                            }
                        });
                    }

                    data.push(filteredObj);
                });
            }

            // Remove duplicates using a Map
            const uniqueData = Array.from(new Map(data.map(item => [JSON.stringify(item), item])).values());
            resolve(uniqueData);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    readExcelFile
};