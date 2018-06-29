app.controller('documentListController', function($scope, $mdDialog) {
    let self = this;
    self.fileList = [];
    self.extensionList = [];
    const { ipcRenderer } = require('electron');

    ipcRenderer.on('getFilesInDirectory-response', (event, arg) => {       
        $scope.$apply(function(){
            self.fileList = arg;
            console.log('result list', arg);
        });
        assignIcons();
        getExtensions();       
    });
    

    self.getDocumentsList = () => {
        if (self.path) {
            ipcRenderer.send('getFilesInDirectory', self.path);
        }        
    };

    //Function for the button that creates the list of files as an Excel file.
    self.saveList = () => {        
        self.showAdvanced();
    }

    // Creates a list with the unique type of documents in the directory (ext)
    function getExtensions () {      
        $scope.$apply(function(){
            self.extensionList  = [...new Set(self.fileList.map( doc =>   doc.ext))]; 
            self.tempExtensionList =  Object.assign([],  self.extensionList);
        });
    }

    function assignIcons() {
        self.fileList = self.fileList.map( file => {
            switch (file.ext){
                case ".pdf":
                    file.icon = "fas fa-file-pdf";
                    break;
                case "directory":
                    file.icon = "fas fa-folder-open";
                    break;
                case ".js":  case ".json":
                    file.icon = "fas fa-js-square";
                    break;
                default:
                    file.icon = "fas fa-file";
                        break;
            }
            self.tempList =  Object.assign([], self.fileList);
            return file;
        })
    }

    self.listChange = (list) =>{
        self.tempList  = self.fileList.filter(file => list.includes(file.ext));
    }

    self.openFile =  (file) =>{
        if (file){
            //self.openLoading();
            console.log('opening a file', file);
            if (file.ext == 'directory'){
                 ipcRenderer.send('openDocument', self.path);
            } else {
                 ipcRenderer.send('openDocument', `${self.path}/${file.name}`);
            }
            
        }       
    }
    self.greet = () => {
        console.log('hey there');
    }

    //Loader dialog
    self.openLoading = (ev) => {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: './dialogs/loaderDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          })
          .then(function(arg) {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            //$scope.status = 'You cancelled the dialog.';
          });
    }
    //Dialog when excel list is being save
    self.showAdvanced = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: './dialogs/saveListDialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen 
        })
        .then(function(arg) {
            if (arg.name && arg.path) {
               const dataList =  self.fileList.map(file => {return {'file_name': file.name, 'file_ext': file.ext}});
               const saveArg = {
                   name: arg.name,
                   path: arg.path,
                   list: dataList
               };
               ipcRenderer.send('saveListExcel', saveArg);
            }
          //$scope.status = 'You said the information was "' + answer + '".';
        }, function(err) {
            console.error(err);
          
        });
      };

      function DialogController($scope, $mdDialog) {
        $scope.saveParameters = { 
            name: '',
            path: ''
        }
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    
        $scope.save = function() {
          $mdDialog.hide($scope.saveParameters);
        };
      }
});