var fs = require('fs');
var lineReader = require('line-reader');

var inputFile = __dirname + '/zipcodes.tsv';
var outputFile = __dirname + '/content/js/zipcodes.json';

var isData = false;
var zipObj = {};

lineReader.eachLine(inputFile, function (line) {
    if (isData) {
        var arr = line.split('\t');
        var zipCode = arr[2].replace('\r', ''); // crappy windows formated files for jerks
        
        zipObj[zipCode] = {
            lat : parseFloat(arr[0]),
            lon : parseFloat(arr[1])
        };
    } else { // skip the header line
        isData = true;
    }
}).then(function () {
    var jsonStr = JSON.stringify(zipObj);
    
    //jsonStr = jsonminify
    
    console.log('Writing file to: ' + outputFile);
    
    fs.writeFile(outputFile, jsonStr, function (err) {
        if (err) throw err;
    });
});
