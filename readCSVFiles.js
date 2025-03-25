const { readCSVFile } = require("./readCSV");

async function readMultipleExcelFiles(filePaths, column = "all") {
    try {
        // Read all Excel files concurrently
        const allDataArrays = await Promise.all(
            filePaths.map(filePath => readCSVFile(filePath, column))
        );

        // Combine all data into a single array
        const combinedData = allDataArrays.flat();
        return combinedData;
    } catch (error) {
        console.error("Error reading Excel files:", error);
        throw error;
    }
}

module.exports = {
    readMultipleExcelFiles
}
