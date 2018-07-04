app.component('navApp',{
    templateUrl: './js/app/components/nav/template.html',
    controller: function(){
        const { ipcRenderer } = require('electron');
        this.loadRename = () => ipcRenderer.send('loadView', 'rename');
    },
    controllerAs: 'vm'

})