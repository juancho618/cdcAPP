/**
 * Validates the data on the created folders and generates an Excel file.
 */
app.factory('validateData', function(){
    const path = require('path');
    const fs = require('fs.extra');
    const XLSX = require('xlsx');
    const json2xls = require('json2xls');
    
    const savePath = `${__dirname}/../data/`;

    let validate = () => {
        const workbook = XLSX.readFile(`${savePath}matrix.xlsm`);
        const sheet_name_list = workbook.SheetNames;
        let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);
        
        const workbook2 = XLSX.readFile(`${savePath}newList2.xlsx`);
        const sheet_name_list2 = workbook2.SheetNames;
        let xlData2 = XLSX.utils.sheet_to_json(workbook2.Sheets["Sheet 1"]);
        
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
        
        // let numbered = xlData.filter(x => x.hasOwnProperty('Assigner_Number_writ'));
        let numbered = xlData2.filter(x => x.hasOwnProperty('company_name'));
        
        // get list from folder function
        let getList = (path) =>  fs.readdirAsync( path );
        
        // const folderPath = 'H:\\USER\\Jobstudents\\DocumentsList\\';
        const folderPath = 'C:\\Users\\Escobar\\Desktop\\newList\\';
        
        const assignorsList = getList(folderPath)
        
        
        let getIdNumber = (id) =>{
            
            const reLetters = new RegExp('^[a-zA-Z]{2}');
        
            if (reLetters.exec(id)){ // if it starts with two letters
                if (id.includes('_')){
                    return id.slice(3);
                } else {
                    return id.slice(2);
                }
            }
            return id;
        
        };
        
        
        Promise.all([assignorsList]).then(result =>{
            console.log(result[0].length)
            let listItems = []; 
            result[0].forEach( (r, index) => {
               return  getList(folderPath + r).then( documents => {
                    const rawId = r.split('-');
                    console.log(rawId);
                    const idExtract = rawId.length >= 3 ? rawId[rawId.length - 1].trim() : rawId[1].trim(); //rawid was 2 for assignor number
                    const idNumber = idExtract; 
                    let item = {
                        id: idNumber,
                        power: false,
                        DoT: false,
                        CPA: false, 
                        idType: '',
                        name: '',
                        Assig_Number_writ: ''
                    }
        
                    documents.forEach(d => {
                        if(d.includes('CPA')){
                            item.CPA = true;
                        }else if(d.includes('DoT')){
                            item.DoT = true;
                        }else if(d.includes('power')){
                            item.power = true;
                        }
                    })   
                    listItems.push(item);   
                    if (index === result[0].length - 1) {                
                        getItems(listItems); // return the data
                    }
                })
               
            });
        })
        
        let getItems = (list) => {
            list.map( assignor =>{
                numbered.forEach(data => {
                    if(data.Ident.includes(assignor.id)){
                        assignor.idType = data.Ident_type;
                        assignor.name = data.company_name;
                        assignor.Assig_Number_writ = data['Assig_Number_writ'];
                    }
                })
            })
           
        
            /* create sheet data & add to workbook for the json file */
            let data =   json2xls(list);
            fs.writeFileSync(`${savePath}dataRe.xlsx`, data, 'binary');
        };
    };
    
   return validate;
});
