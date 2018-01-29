app.controller('assignorListCtrl',[ function() {
    let self = this;

    const remote = require('electron').remote;    
    const window = remote.getCurrentWindow();

    self.index = () => window.loadURL(`${__dirname}/index.html`);
}]);