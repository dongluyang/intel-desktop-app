const { app, BrowserWindow,ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
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
      webSecurity: false,    // 禁用 Web 安全性限制
      allowFileAccess: true  // 允许渲染进程访问本地文件
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


async function handleFileWrite (event, fileName,content) {
  console.log("dddddddddd")
  fs.writeFile(fileName, content, (err) => {
    console.log("sssssssss",err)
    if (err) {
      return {'status':'error', 'msg':err.message};
    } else {
      return {'status':'success', 'msg':'save successfully'};
    }
  });
}


async function handleFileRead (event, fileName) {
  fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
      return {'status':'error', 'msg':err.message};
    } else {
      return {'status':'success', 'msg':'save successfully','data':data};
    }
  });
}


async function handleRootDocument (event) {


  const platform = os.platform(); // 获取操作系统平台

  if (platform === 'win32') {
     const documentsPath = path.join(os.homedir(), 'Documents');
     return documentsPath
    // 在这里执行 Windows 特定的操作
  } else if (platform === 'darwin') {
    console.log('macOS 操作系统');
    // 在这里执行 macOS 特定的操作
  } else if (platform === 'linux') {
    console.log('Linux 操作系统');
    // 在这里执行 Linux 特定的操作
  } else {
    console.log('未知操作系统');
    // 处理未知操作系统的情况
  }


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
  ipcMain.handle('writeFile',handleFileWrite);
  ipcMain.handle('readFile',handleFileRead);
  ipcMain.handle('getRootDocument',handleRootDocument);

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
