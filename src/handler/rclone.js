const path = require('path');
const isDev = require('electron-is-dev');
const {spawn } = require('child_process');
const log = require("electron-log")
const fs = require('fs');
import {saveStoreValue} from './store.js'
import {handleRootDocument} from './env.js'
  
export  async function handleRcloneMount (event,projects,storageDir) {
  
    // 要执行的命令和参数
    let command;
    if (isDev) {
      // 在开发模式下，`rembg.exe` 可能在项目根目录下或其他位置
      command = path.join(__dirname, '../../resources', 'rclone.exe');
    } else {
      // 在生产模式下，`rembg.exe` 位于安装包的 `resources` 文件夹下
      command = path.join(process.resourcesPath, 'app','resources', 'rclone.exe');
    }

    const documentPath = await handleRootDocument()
    console.log(storageDir)

      // 使用 fs.existsSync() 检查目录是否存在
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    } 


    // 生成文件内容
    let fileContent = '';

    for (let project of projects) {
        const parsedData = JSON.parse(project.storageOption);
        const parts = parsedData.region.split('.')
        fileContent += "["+project.mainProjectName+"]\n"
        fileContent +=  "type = s3\n"
        fileContent +=  "provider = HuaweiOBS\n"
        fileContent +=  ("access_key_id = "+parsedData.accessKey+"\n")
        fileContent +=  ("secret_access_key = "+parsedData.secretKey+"\n")
        fileContent +=  ("region = "+parts[1]+"\n")
        fileContent +=  ("endpoint = "+parsedData.region+"\n")
        fileContent +=  "acl = private\n"
    }

    fs.writeFileSync(documentPath+"\\CGTeam"+'\\obs.txt', fileContent);

    const pids = []
    for (let project of projects) {
        // const command = 'rembg';
        const args = ['--config='+documentPath+"\\CGTeam"+'\\obs.txt','mount',project.mainProjectName+':'+project.mainProjectName+"/"+project.subprojectName,storageDir+project.mainProjectName,'--vfs-cache-mode','full'];


        try {
        // 启动一个后台进程
        const childProcess = spawn(command, args, {
                detached: true, // 将子进程独立出来，成为一个新的进程组
                stdio: 'ignore' // 忽略标准输入/输出，将其置为 'ignore' 或 'inherit'
        });
            
        // 子进程已经独立出来，你可以选择是否将其设置为一个新的会话
        childProcess.unref();
        
        pids.push(childProcess.pid)

        } catch (error) {
        console.error(`执行命令时发生错误： ${error.message}`);
        }
    }
    console.log(JSON.stringify(pids)+"ssssss")
    saveStoreValue(null,"rclone_pid",JSON.stringify(pids))

  }