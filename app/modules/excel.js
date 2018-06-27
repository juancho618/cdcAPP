const json2xls = require('json2xls');
const fs = require('fs');

class Excel{
    saveList(file){
        const data = json2xls(file.list);
        fs.writeFileSync(`${file.path}/${file.name}.xlsx`, data, 'binary');

    }
}

module.exports = Excel;