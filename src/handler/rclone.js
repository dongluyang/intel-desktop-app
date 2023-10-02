const path = require('path');
const isDev = require('electron-is-dev');
const {spawn } = require('child_process');
const log = require("electron-log")
  
export  async function handleRcloneMount (event,projects,teamName) {
  
    // 要执行的命令和参数
    let command;
    if (isDev) {
      // 在开发模式下，`rembg.exe` 可能在项目根目录下或其他位置
      command = path.join(__dirname, '../../resources', 'rclone.exe');
    } else {
      // 在生产模式下，`rembg.exe` 位于安装包的 `resources` 文件夹下
      command = path.join(process.resourcesPath, 'app','resources', 'rclone.exe');
    }
    // const command = 'rembg';
    const args = ['--config=D:/home/rclone-v1.64.0-windows-amd64/obs.txt','mount','obs:cgteamxcm','D:/localxcm','--vfs-cache-mode','full'];


    try {
      // 启动一个后台进程
      const childProcess = spawn(command, args, {
            detached: true, // 将子进程独立出来，成为一个新的进程组
            stdio: 'ignore' // 忽略标准输入/输出，将其置为 'ignore' 或 'inherit'
      });
        
      // 子进程已经独立出来，你可以选择是否将其设置为一个新的会话
      childProcess.unref();

    } catch (error) {
      console.error(`执行命令时发生错误： ${error.message}`);
    }
  }