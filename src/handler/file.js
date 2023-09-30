const { app, BrowserWindow,ipcMain,dialog,shell} = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const { exec,execSync } = require('child_process');
const log = require("electron-log")



export async function handleFileWrite (event, fileName,content) {
    fs.writeFile(fileName, content, (err) => {
      if (err) {
        return {'status':'error', 'msg':err.message};
      } else {
        return {'status':'success', 'msg':'save successfully'};
      }
    });
  }
  
  
 export async function handleFileRead (event, fileName) {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) {
        return {'status':'error', 'msg':err.message};
      } else {
        return {'status':'success', 'msg':'save successfully','data':data};
      }
    });
  }
  
  
export  async function openFolder(event,folderPath) {
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




  // 添加一个事件处理程序以选择文件夹
export async function selectDirectory(event) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    let selectedDirectory;
    let fileList = [];
   await dialog
      .showOpenDialog(win, {
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




  export async function handlePackageRead (event) {


    try {
      // 同步读取文件内容
      const data = fs.readFileSync('./package.json', 'utf8');
      // 解析package.json文件为JavaScript对象
      const packageJson = JSON.parse(data);

      // 获取版本号
       const version = packageJson.version;
      
       // 输出版本号
       console.log('应用程序版本号:', version);
      return version;
    } catch (err) {
      console.error('读取文件时出错:', err);
    }
  }