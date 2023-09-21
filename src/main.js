const { app, BrowserWindow,ipcMain,dialog,shell} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const isDev = require('electron-is-dev');
// import autoUpdater from './update'
const { exec,execSync } = require('child_process');
const registry = require('winreg');
const Store = require('electron-store');
const store = new Store();
const log = require("electron-log")
import {handleOpenPlugins,handleRembgExec} from './handler/plugin'
import {getMayaPlugin} from './handler/maya_plugin'
import {handleRootDocument} from './handler/env'
import {handleFileWrite,handleFileRead,openFolder,selectDirectory} from './handler/file'
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

    // autoUpdater.autoDownload = false
    //
    // autoUpdater.checkForUpdates()

  });

};


async function handlePing (event, keyword) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(keyword)
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
  ipcMain.handle('selectDirectory',selectDirectory)
  ipcMain.handle('doRembgExec',handleRembgExec)
  ipcMain.handle('openFolder',openFolder)
  ipcMain.handle('getMayaPlugin',getMayaPlugin)
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
