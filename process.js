const fs = require('fs')
const csv = require('csv-parser')
const csvFilePath = './data.csv';

let outData = [];

fs.createReadStream(csvFilePath)
  .pipe(csv([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 , 15, 16, 17, 18, 19, 20]))
  .on('data', function (row) {    

    let count = 0;
    let path = "";
    let lastCat = "";

    for (const [key, val] of Object.entries(row)) {
        if(val !== '' && count == 1) {
            path = val;
            lastCat = val;

        } else if (val !== '' && count !== 0) {
            path = path +  " > " + val;
            lastCat = val;
        }
        count++
    }

    path = path.replace(/>(?:.(?!>.+))+$/, "");
    path = path.trim(path);
    
    newRow = {
        ct: "Google Product Categories",
        cp: path,
        name: lastCat,
        vom: "N",
        vos: "N"
    }

    outData.push(newRow);
    

  })
  .on('end', function () {
    const filename = 'output.csv';
    fs.writeFile(filename, extractAsCSV(outData), err => {
      if (err) {
        console.log('Error writing to csv file', err);
      } else {
        console.log(`saved as ${filename}`);
      }
    });
})


function extractAsCSV(inp) {
    const header = ["Content Type, Content Path, Name, Visible On Menu, Visible On Sitemap"];
    const rows = inp.map(item =>
        `${item.ct}, ${item.cp}, ${item.name}, ${item.vom}, ${item.vos}`
    );
    return header.concat(rows).join("\n");
}
