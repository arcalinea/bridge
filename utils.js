const fs = require('fs');

function createDataFile(smors){
    fs.writeFile("data.json", JSON.stringify(smors), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

module.exports = {
    'createDataFile': createDataFile
}