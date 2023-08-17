const { app, BrowserWindow,ipcMain} = require('electron');
const path = require('path');
import autoUpdater from './update'
const { exec } = require('child_process');
const Store = require('electron-store');
const store = new Store();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // autoUpdater.on('download-progress', res => {
  //   mainWindow.webContents.send('downloadProgress', res)
  // })

  mainWindow.once('ready-to-show', () => {
        
    autoUpdater.autoDownload = false

    autoUpdater.checkForUpdates()

  });

};


async function handlePing (event, keyword) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(keyword)
}


async function handleOpenPlugins (event, pluginName) {
  const mayaExecutablePath = 'C:\\Program Files\\Autodesk\\Maya2018\\bin\\maya.exe'; // Update this path
  exec(`"${mayaExecutablePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening Maya: ${error}`);
    }
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  ipcMain.on('ping', handlePing)
  ipcMain.handle('getStoreValue', (event, key) => {
    return store.get(key);
  });
  ipcMain.handle('saveStoreValue', (event, key,value) => {
    store.set(key,value);
  });

  ipcMain.handle('openPlugin',handleOpenPlugins);


  createWindow()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
