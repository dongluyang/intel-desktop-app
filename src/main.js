const { app, BrowserWindow,ipcMain,dialog,shell,Menu,Tray} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const isDev = require('electron-is-dev');
import autoUpdater from './update'
const registry = require('winreg');
const log = require("electron-log")
import {handleOpenPlugins,handleRembgExec} from './handler/plugin'
import {handleRcloneMount,quitAllRclone,launchCronJob} from './handler/rclone'
import {getMayaPlugin} from './handler/maya_plugin'
import {handleRootDocument} from './handler/env'
import {handleFileWrite,handleFileRead,openFolder,selectDirectory,handlePackageRead} from './handler/file'
import {getStoreValue,saveStoreValue,removeStoreValue} from './handler/store'
// Handle creating/removing shortcuts on Windows when installing/uninstalling. https://github.com/ncdev2015/LoadObjFiles-Threejs-Vue2
if (require('electron-squirrel-startup')) {
  app.quit();
}
let mainWindow;
let tray;
const createWindow = () => {
  // Create the browser window.
  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './images/icon.ico',
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
   
    autoUpdater.checkForUpdates()

  });



mainWindow.on('close', (event) => {
    // 阻止窗口默认的关闭行为
    event.preventDefault();
    mainWindow.hide(); // 最小化窗口
  });

};


async function handlePing (event, keyword) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(keyword)
}

function showWindow() {
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
}

function quitApp() {
  const childPIDs = getStoreValue(null,"rclone_pid")
  console.log(childPIDs)
  if (childPIDs!=null) {
    const pids = JSON.parse(childPIDs)
    console.log(pids)
    for (let pid of pids) {
      try {
        process.kill(pid);
      }catch (error) {
        console.log(error)
      }
    }
  }
  removeStoreValue(null,"rclone_pid")
  mainWindow.destroy();
  app.quit();
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  ipcMain.on('ping', handlePing)
  ipcMain.handle('getStoreValue',getStoreValue);
  ipcMain.handle('saveStoreValue', saveStoreValue);
  ipcMain.handle('removeStoreValue', removeStoreValue);
  ipcMain.handle('openPlugin',handleOpenPlugins);
  ipcMain.handle('writeFile',handleFileWrite);
  ipcMain.handle('readFile',handleFileRead);
  ipcMain.handle('getRootDocument',handleRootDocument);
  ipcMain.handle('selectDirectory',selectDirectory)
  ipcMain.handle('doRembgExec',handleRembgExec)
  ipcMain.handle('openFolder',openFolder)
  ipcMain.handle('getMayaPlugin',getMayaPlugin)
  ipcMain.handle('appVersion',handlePackageRead)
  ipcMain.on('doRcloneMount',handleRcloneMount)
  ipcMain.handle('quitApp',quitAllRclone)
  ipcMain.on('doLaunchCronJob',launchCronJob)
  
  createWindow()

  // 创建系统托盘图标
  try {
    tray = new Tray(path.join(__dirname, '../../src/images/icon.ico'));
  } catch (error) {
    console.error('出错了：', error);
  }

  // 可以添加一个上下文菜单，以便用户右键单击图标时显示菜单
  if (process.platform === 'win32') {
       tray.on('click', showWindow);
  }
    
  const menu = Menu.buildFromTemplate([
        { label: '打开主页面', click: showWindow },
        {label: '退出',click:quitApp}
  ]);
    
tray.setToolTip('Cgyun客户端');
tray.setContextMenu(menu);


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
