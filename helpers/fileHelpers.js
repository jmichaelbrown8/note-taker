const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

const writeToFile = (dest, data) => {
    fs.writeFile(
        dest, 
        JSON.stringify(data), 
        err => err ? console.error(err) : console.log(`Wrote to file: ${dest}`)
    );
};

const readAndAppend = (filename, obj) => {
    return fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
          } else {
            const parsedData = JSON.parse(data);
            parsedData.push(obj);
            writeToFile(filename, parsedData);
            console.log(`Wrote ${JSON.stringify(obj)} to ${filename}`)
          }
    })
};

module.exports = {
    readAndAppend,
    readFromFile,
    writeToFile
};