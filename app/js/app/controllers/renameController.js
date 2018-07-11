app.controller('renameController', function ($scope, $mdDialog, cfpLoadingBar) {
    let self = this;

    const { ipcRenderer } = require('electron');
    const Swal = require('sweetalert2');

    ipcRenderer.on('renaming-asynchReply', function(event, arg){
        const response = JSON.parse(arg);
        cfpLoadingBar.complete();
        const numberFilesRenamed = response.documents_tobe_renamed.length
        Swal({
            title: 'Files renamed!',
            text: `${numberFilesRenamed} files were renamed, ${response.documents_wo_id.length} documents without ID and ${response.documents_wo_vat_match.length} without a VAT that matches`,
            type: 'success',
        })
        console.log(`argument: ${response}`, response);
    } )

   self.nameFormatList = [];

    //----------------Rename files with python---------------
    self.rename = () => {        
        const variablesNameList = self.nameFormatList.map(x => {return {name: x, isVar:  self.matrixColumns.includes(x) ? true : false}});
        console.log(variablesNameList);
        const renameArg = {
            path: self.path,
            renameVarList: variablesNameList
        };
        cfpLoadingBar.start();
        ipcRenderer.send('rename', renameArg);
    }

    self.elementSelected= () => console.log('click');
    //--------------------------------------------------------
    //------ Read Matrix -------------------------------------

    self.getMatrixHeaders = () => {
        const martrixColumns = ipcRenderer.sendSync('matrixHeaders', '');
        return martrixColumns;
    }
    //-------------------------------------------------------

    self.matrixColumns = self.getMatrixHeaders();
})