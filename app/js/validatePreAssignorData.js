app.factory('validatePreAssignorData', function(){
    const fs = require('fs.extra');
    const XLSX = require('xlsx');
    const json2xls = require('json2xls');
    const fsSync = require('fs');
    
    const savePath = `${__dirname}/../data/`;

    let validate = () => {
        //matrix Data
        const workbook = XLSX.readFile(`${savePath}matrix.xlsm`);
        const sheet_name_list = workbook.SheetNames;
        let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

        //Preassignor list
        const workbook2 = XLSX.readFile(`${savePath}preAssignors.xlsx`);
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

        let numbered = xlData2.filter(x => x.hasOwnProperty('company_name'));
        
        // get list from folder function
        let getList = (path) =>  fs.readdirAsync( path );

        //folder with documents and list of assignors
        const folderPath = 'C:\\Users\\Escobar\\Desktop\\sftpList\\';
        
        const assignorsList = getList(folderPath);

        //get ID from assignor and extract number
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

        let found  = 0;
        let preListReport = [];
        //Get list of folder in the submission
        return Promise.all([assignorsList]).then(result =>{

            console.log(result[0].length)
            let listItems = []; 

            numbered.forEach(pre => {
                let preAssignor = {
                    preAssignorName: pre.company_name,
                    preAssignorId: pre.Ident,
                    idType: pre.Ident_type,
                    preAssignorOf: pre.Pre_assig_of,
                    containsPreAssigment: false,
                    containsPower: false,
                    under: ''
                }

                const preNumber =  pre.Assignor_Number;
                const preId =  pre.Ident;
                
                result[0].forEach(assignor =>{
                    const number = assignor.substring(0,3);

                    if (preNumber == number) {
                        preAssignor.under = assignor;
                        fsSync.readdirSync(`${folderPath}/${assignor}`).forEach(file => {
                            if (file.includes(preId) && file.includes('power')){
                                preAssignor.containsPower = true;
                            }
                            if (file.includes(preId) && file.includes('pre_assig')){
                                preAssignor.containsPreAssigment = true;
                            }
                        })
                    }

                })
                listItems.push(preAssignor);
            })
            
            let newList =   json2xls(listItems);
            console.log(listItems.length);
            fs.writeFileSync(`${__dirname}/../data/preValList.xlsx`, newList, 'binary');
        }); 
            
    };
    return validate;
})