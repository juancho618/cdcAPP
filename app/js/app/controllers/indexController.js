app.controller('indexCtrl',[ 'importMatrix', 'createAssignorList', 'createFolders', 'validateData',function(importMatrix, createAssignorList, createFolders, validateData) {
    let self = this;
    const http = require('http');
    const fs = require('fs.extra');
    
    self.importMatrix = () =>  importMatrix.end(); 
    self.createList = () =>  createAssignorList(); 
    self.createFolder = () => createFolders();
    self.validate = () => validateData();
    self.hi = () => {console.log('aloha')};
    
    self.validationSteps = [
        {buttonValue: 'Import Matrix', action: self.importMatrix},
        {buttonValue: 'Create List of Assignors', action: self.createList},
        {buttonValue: 'Create folder with documents', action: self.createFolder },
        {buttonValue: 'Validate documents', action: self.validate},
        {buttonValue: 'Check for repeated values', action: 'repeated'}
    ]
        
    
    

   
}])