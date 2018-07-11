app.controller('renameController', function ($scope, $mdDialog) {
    let self = this;

    const { ipcRenderer } = require('electron');
    const Swal = require('sweetalert2');

    ipcRenderer.on('renaming-asynchReply', function(event, arg){
        console.log(`argument: ${arg}`);
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