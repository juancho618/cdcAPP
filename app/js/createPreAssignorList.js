app.factory('createPreAssignorList', function(){
    const XLSX = require('xlsx');
    const json2xls = require('json2xls');
    const fs = require('fs.extra');

    let createList = () => {
        //Load the matrix as a JSON
        const workbook = XLSX.readFile(`${__dirname}/../data/matrix.xlsm`);
        const sheet_name_list = workbook.SheetNames;
        let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

        let preAssignors = xlData.filter(assignor => {

            const CPA = assignor.hasOwnProperty('signdate_CDC_CPA ')  && assignor.hasOwnProperty('signdate_assig_CPA');
            if ( assignor.hasOwnProperty('company_name')  && assignor.hasOwnProperty('Assignor_Number') && assignor['Assignor_Number'] != 0 && assignor['Assignor_Letter']) {

              
                if ( assignor['Assignor_Number'] >= 202 &&  assignor['Assignor_Number'] <=500){                   
                    return assignor;                       
                   
                }       

            }
        });

        let newList =   json2xls(preAssignors);
        console.log(preAssignors.length);
        fs.writeFileSync(`${__dirname}/../data/preAssignors.xlsx`, newList, 'binary');
    };
    return createList;
})