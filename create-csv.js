const fs = require("fs");

function createCSVFile(filePath, data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid or empty data array.");
        return;
    }

    const writeStream = fs.createWriteStream(filePath);

    // Write CSV header
    const headers = Object.keys(data[0]).join(",");
    writeStream.write(headers + "\n");

    // Write CSV data
    data.forEach((obj) => {
        const newLine = Object.values(obj).map(value => `"${value}"`).join(","); // Ensures values are quoted
        writeStream.write(newLine + "\n");
    });

    writeStream.end();

    writeStream.on("finish", () => {
        console.log("CSV file successfully written:", filePath);
    }).on("error", (err) => {
        console.error("Error writing CSV file:", err);
    });
}

module.exports = {
    createCSVFile
}