const {app, BrowserWindow, ipcMain} = require('electron');


const path = require('path');
const url = require('url');

const directory = require('./app/modules/directory');
const excel = require('./app/modules/excel');

//TODO: to be deleted
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

//To get the list of documents in a durectory
ipcMain.on('getFilesInDirectory', (event,arg) => {  
  const dir = new directory();
  dir.read(arg);  
  event.sender.send('getFilesInDirectory-response', dir.files);  
});

//save the list of documents as an Excel file
ipcMain.on('saveListExcel', (event,arg) => {
  console.log('received data', arg);
  const exc = new excel();
  exc.saveList(arg);  
  //vent.sender.send('saveListExcel-response', 'done');  
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  //load the file
  mainWindow.loadFile('./app/documentsList.html')

  // Open the DevTools.
   mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed',  () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
