const os = require('os');
const path = require('path');

export async function handleRootDocument (event) {


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