app.factory('createFolders', function(){
    const path = require('path');
    const fs = require('fs.extra');
    const XLSX = require('xlsx');
    const json2xls = require('json2xls');

    const savePath = `${__dirname}/../data/`;
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

    
    let createFolders = () => {
        //read list of assignors
        const workbook2 = XLSX.readFile(`${__dirname}/../data/newList2.xlsx`);
        const sheet_name_list2 = workbook2.SheetNames;
        let xlData2 = XLSX.utils.sheet_to_json(workbook2.Sheets["Sheet 1"]);

        // get list from folder function
        let getList = (path) =>  fs.readdirAsync( path );

        //Load sources
        const CPA = getList('H:\\USER\\Jobstudents\\convertedFiles\\cpa');//H:\\USER\\Jobstudents\\CPAs
        const DoTo = getList('H:\\USER\\Jobstudents\\convertedFiles\\dot');//H:\\USER\\Jobstudents\\DoTs\\Dot_o_Stamped
        const powers = getList('H:\\USER\\Jobstudents\\convertedFiles\\power');//H:\\USER\\Jobstudents\\powersList
        //Async call to the sources
        Promise.all([CPA, powers, DoTo]).then( values =>{

            //destination for the list
            const destination = 'C:\\Users\\Escobar\\Desktop\\assignorsList';

            let numbered = xlData2.filter(x => x.hasOwnProperty('company_name'));
            let suspiciousFiles = [];
            let missing = [];
        
            
            numbered.forEach(i => {
                let documentsFound = [];
                i.company_name = i.company_name.replace('/', '.'); //to avoid subfoldering
        
                //Folder structure name
                const savePath = `${destination}/${i['Assignor_Number']} - ${i.company_name} - ${i.Ident}`; //${i['Assigner_Number_writ ']} -
                
                //Extracts Id number
                let tempId = (id) =>{
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
        
                const extractId = tempId(i.Ident.trim());
                // console.log(`${i.Ident}, ${extractId}`);
                console.log(i);
                let missDoc = {target: i.company_name, originalId: i.Ident, usedId: extractId, CPA: true, DOT: true, Power: true, idType: i.Ident_type,cpaMatch: false,dotMatch: false,powerMatch: false, Assig_Number_writ: i['Assig_Number_writ'], Assig_Number: i['\"Assignor_Number\"']}
        
                if (!fs.existsSync(savePath)){
                    fs.mkdirSync(savePath);
                    // fs.mkdirSync(`${savePath}/CPA`);
                    // fs.mkdirSync(`${savePath}/DOT`);
                    // fs.mkdirSync(`${savePath}/powers`);
                }
        
                // CPA
                values[0].forEach(d => {
                    if (d.includes(extractId)) {
                        fs.copy('H:\\USER\\Jobstudents\\convertedFiles\\cpa' + '/' + d, `${savePath}/${d}`, { replace: false });
                        documentsFound.push('CPA');
                    }
                    else if (d.includes(i.company_name)){
                        missDoc.cpaMatch = true;
                        suspiciousFiles.push({file: d,type:'CPA', target: i.company_name, originalId: i.Ident, usedId: extractId});
                    }
                })
        
                // // DOT
                // values[1].forEach(d => {
                //     if (d.includes(extractId)) {
                //         fs.copy('H:\\USER\\Jobstudents\\DoTs\\DoT_2sig_Stamped' + '/' + d, `${savePath}/${d}`, { replace: false });
                //     }
                // })
        
                 // Powers
                 values[1].forEach(d => {
                    if (d.includes(extractId)) {
                        fs.copy('H:\\USER\\Jobstudents\\convertedFiles\\power' + '/' + d, `${savePath}/${d}`, { replace: false });
                        documentsFound.push('Power');
                    }
                    else if (d.includes(i.company_name)){
                        missDoc.powerMatch = true;
                        suspiciousFiles.push({file: d,type:'Powers',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                    }
                })
        
                // DoT_o_Stamped
                values[2].forEach(d => {
                    if (d.includes(extractId)) {
                        fs.copy('H:\\USER\\Jobstudents\\convertedFiles\\dot' + '/' + d, `${savePath}/${d}`, { replace: false });
                        documentsFound.push('DOT');
                    }
                    else if (d.includes(i.company_name)){
                        missDoc.dotMatch = true;
                        suspiciousFiles.push({file: d,type:'DOT',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                    }
                })
        
                if (!documentsFound.includes('DOT') || !documentsFound.includes('CPA') || !documentsFound.includes('Power')){
                    
                    if (!documentsFound.includes('DOT'))
                        missDoc.DOT = false;
                    if (!documentsFound.includes('CPA'))
                         missDoc.CPA = false;
                    if (!documentsFound.includes('Power'))
                        missDoc.Power = false;
        
                    missing.push(missDoc);
                }
            })
        
            /* create sheet data & add to workbook for the json file */
            let data =   json2xls(suspiciousFiles);
            fs.writeFileSync(`${savePath}secondList.xlsx`, data, 'binary');
        
            /* create sheet data & add to workbook for the json file */
            let datam =   json2xls(missing);
            fs.writeFileSync(`${savePath}missigList.xlsx`, datam, 'binary');
            
            

        })
    }

    return createFolders;

});