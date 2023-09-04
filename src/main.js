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


async function handleOpenPlugins (event, pluginName) {

  if (pluginName.toLowerCase().indexOf("maya")!=-1) {
      const version = pluginName.substr(4)
      // 创建注册表项的访问路径
      const regKey = new registry({
        hive: registry.HKLM, // 使用HKLM（HKEY_LOCAL_MACHINE）
        key: '\\SOFTWARE\\Autodesk\\Maya\\'+version+'\\Setup\\InstallPath' // Maya 2022的注册表路径
      });
      // 读取注册表项的值
      regKey.get('MAYA_INSTALL_LOCATION', (err, item) => {
        if (err) {
          console.error('can not read Maya regist form', err);
        } else {
          const mayaExecutablePath = item.value+'bin\\maya.exe';
          console.log('Maya path：', mayaExecutablePath);
          exec(`"${mayaExecutablePath}"`, (error, stdout, stderr) => {
            if (error) {
              window.alert(`Error opening Maya: ${error}`);
            }
          });
          // 在这里您可以使用 Maya 的安装路径进行其他操作
        }
      });
  }


  // const mayaExecutablePath = 'C:\\Program Files\\Autodesk\\Maya2018\\bin\\maya.exe'; // Update this path
  // exec(`"${mayaExecutablePath}"`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error opening Maya: ${error}`);
  //   }
  // });
}



async function handleRembgExec (event, srcDir,distDir) {

  // const customPath = 'C:\\Users\\panpa\\PycharmProjects\\microspeed\\venv\\Scripts\\'
  // 设置命令执行的选项，包括工作目录和环境变量
  const options = {
    // env: { PATH: customPath+path.delimiter+process.env.PATH},
    encoding: 'utf-8'
  };


  // 要执行的命令和参数
  let command;
  // const command = path.join(__dirname, 'resources', 'rembg');
  if (isDev) {
    // 在开发模式下，`rembg.exe` 可能在项目根目录下或其他位置
    command = path.join(__dirname, 'resources', 'rembg.exe');
  } else {
    // 在生产模式下，`rembg.exe` 位于安装包的 `resources` 文件夹下
    command = path.join(process.resourcesPath, 'app','resources', 'rembg.exe');
    log.info(command)
  }
  // const command = 'rembg';
  const args = ['p',srcDir,distDir];

  try {
    // 同步执行命令
    const output = execSync(`${command} ${args.join(' ')}`, options);
    console.log(`命令输出：\n${output}`);
    return output
  } catch (error) {
    console.error(`执行命令时发生错误： ${error.message}`);
  }
}


async function handleFileWrite (event, fileName,content) {
  fs.writeFile(fileName, content, (err) => {
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

// 添加一个事件处理程序以选择文件夹
async function selectDirectory() {
  let selectedDirectory;
  let fileList = [];
 await dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      filters: [
        { name: 'Images', extensions: ['png', 'gif','jpeg'] },
      ]
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        selectedDirectory = result.filePaths[0];
        // 在这里可以使用选定的目录进行进一步处理

        try {
          // 使用fs.readdirSync来同步获取目录下的文件列表
          const files = fs.readdirSync(selectedDirectory);
        
          // 遍历文件列表，获取每个文件的属性
          files.forEach((file) => {
            const filePath = path.join(selectedDirectory, file);
        
            // 使用fs.statSync来同步获取文件的属性
            const stats = fs.statSync(filePath);
        
            // 获取文件大小（以字节为单位）
            const fileSizeInBytes = stats.size;
        
            // 可以将文件大小进行格式化，例如转换为KB、MB等等
            const fileSizeInKB = fileSizeInBytes / 1024;
            const fileSizeInMB = fileSizeInKB / 1024;
            const fileSize = fileSizeInMB>=1?fileSizeInMB.toFixed(2)+"MB":fileSizeInKB.toFixed(2)+"KB";
            fileList.push({name:file,size:fileSize});
            // console.log(`文件名：${file}`);
            // console.log(`文件路径：${filePath}`);
            // console.log(`文件大小（字节）：${fileSizeInBytes}`);
            // console.log(`文件大小（KB）：${fileSizeInKB}`);
            // console.log(`文件大小（MB）：${fileSizeInMB}`);
            // console.log('-------------------');
          });
        } catch (err) {
          console.error(`读取目录 ${directoryPath} 失败：${err}`);
        }


      }
    })
    .catch((err) => {
      console.error(err);
    });

    return {"dir":selectedDirectory,"files":fileList}
}


async function openFolder(event,folderPath) {
  // const folderPath = path.dirname(filePath);
  // 使用shell.openPath来打开所在文件夹
  await shell.openPath(folderPath)
    .then(() => {
      console.log(`已打开文件夹：${folderPath}`);
    })
    .catch((err) => {
      console.error(`打开文件夹时发生错误：${err}`);
      return false
    });
  return true
};


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
