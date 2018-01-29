app.controller('indexCtrl',[ 'importMatrix', 'createAssignorList', 'createFolders', 'validateData',function(importMatrix, createAssignorList, createFolders, validateData) {
    let self = this;
    const http = require('http');
    const fs = require('fs.extra');


    const remote = require('electron').remote;

    const window = remote.getCurrentWindow();
    console.log(window);
    // window.loadURL(`${__dirname}/new.html`);
    
    self.load = false;
    
    self.switchLoad = () => self.load = false;
    self.importMatrix = () =>  {
        self.load = true;
        result = importMatrix.end();
        if (result == 1){
            console.log('hola');
            // self.switchLoad(); 
        }
    }; 
    self.createList = () =>  createAssignorList(); 
    self.createFolder = () => createFolders();
    self.validate = () => validateData();
    self.hi = () => {console.log('aloha')};
    self.assignorList = () => window.loadURL(`${__dirname}/assignorList.html`);
    
    self.validationSteps = [
        {buttonValue: 'Import Matrix', action: self.importMatrix},
        {buttonValue: 'Create List of Assignors', action: self.createList},
        {buttonValue: 'Create folder with documents', action: self.createFolder },
        {buttonValue: 'Validate documents', action: self.validate},
        {buttonValue: 'Check for repeated values', action: 'repeated'}
    ]
        
    
    

   
}])