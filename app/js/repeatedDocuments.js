app.factory('repeatedDocuments', function(){
    const path = require('path');
    const fs = require('fs.extra');
    const XLSX = require('xlsx');
    const json2xls = require('json2xls');



// async fs function
fs.readdirAsync = dirname => {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
};

// get list from folder function
let getList = (path) =>  fs.readdirAsync( path );


const assignorsList = getList(`C:\\Users\\Escobar\\Desktop\\assignorsList`);

let findRepeated = () => {
    Promise.all([assignorsList]).then(result =>{
        result[0].forEach( (r, index) => { // for each folder in the documents
            return  getList('C:\\Users\\Escobar\\Desktop\\assignorsList\\' + r).then( documents => { //get all the documets per assignor
                let count = 0; 
                documents = documents.filter(d => d != 'Thumbs.db');
                documents.forEach(d => {
                    if(d.includes('power')){
                        count ++;
                    }
                })
                if (documents.length > 3){
                    console.log(`more than expected ${r} - size ${documents.length}`);
                    console.log(documents);
                }
                if (count > 1) {
                    console.log('more than one power ' + r);
                }
            })
        })
    });   
}

return findRepeated;
})