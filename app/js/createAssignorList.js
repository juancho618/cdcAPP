app.factory('createAssignorList', function(){
    const XLSX = require('xlsx');
    const json2xls = require('json2xls');
    const fs = require('fs.extra');
    
    let createList = () => {
        const workbook = XLSX.readFile(`${__dirname}/../data/matrix.xlsm`);
        const sheet_name_list = workbook.SheetNames;
        let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

        let newAssignors = xlData.filter(assignor => {
            
            if ( assignor.hasOwnProperty('company_name') && assignor.hasOwnProperty('signdate_CDC_CPA ')  && assignor.hasOwnProperty('signdate_assig_CPA') ) { //other val: && !assignor.signdate_CDC_DoT.includes('still open') assignor.hasOwnProperty('signdate_CDC_DoT') && assignor.hasOwnProperty('signdate_assig_DoT')
            //   if ( assignor.hasOwnProperty('Assig_included_in_writ') ){
            //         if (!assignor.Assig_included_in_writ.toUpperCase().includes('YES')){
            //             return assignor;
            //         }
            //     } else {
            //         return assignor; //some reduncancy??
            //     } && assignor.hasOwnProperty('signdate_CDC_CPA') && assignor.hasOwnProperty('signdate_assig_CPA')
            
                const cpaCdcDate = (assignor['signdate_CDC_CPA '].includes('17') || assignor['signdate_CDC_CPA '].includes('18')); 
                const cpaAssignorDate = (assignor['signdate_assig_CPA'].includes('17') || assignor['signdate_assig_CPA'].includes('18'));
                if ( cpaCdcDate &&  cpaAssignorDate){
                    if ( assignor.hasOwnProperty('Included_by_writ_of')){
                        console.log(assignor['Included_by_writ_of']);
                        if (assignor.Included_by_writ_of.toUpperCase().includes('DEC')){
                                        return assignor;
                        }
                    } else { //or empty
                        return assignor;
                    }
                }       
        
            }
        });
        
        let newList =   json2xls(newAssignors);
        console.log(newAssignors.length);
        fs.writeFileSync(`${__dirname}/../data/newList2.xlsx`, newList, 'binary');
    };

      
  
    return createList;

});