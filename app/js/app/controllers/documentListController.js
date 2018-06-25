app.controller('documentListController',[ function($scope) {
    let self = this;
    self.fileList = [];
    self.extensionList = [];
    const { ipcRenderer } = require('electron');

    ipcRenderer.on('getFilesInDirectory-response', (event, arg) => {
        self.fileList = arg;
        console.log('result list', arg);
        getExtensions();
        //$scope.$apply();
    });
    ipcRenderer.send('asynchronous-message', 'ping');

    self.getDocumentsList = () => {
        if (self.path) {
            ipcRenderer.send('getFilesInDirectory', self.path);
        }        
    };

    function getExtensions () {
        self.extensionList  = [...new Set(self.fileList.map( doc =>   doc.ext))]; 
        console.log(self.extensionList);
    }

    self.listChange = (list) =>{
        console.log('the list changed', list, self.extensionList);
        self.fileList = self.fileList.filter(file => list.includes(file.ext));
    }
    
}]);