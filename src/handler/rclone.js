const path = require('path');
const isDev = require('electron-is-dev');
const {spawn,exec } = require('child_process');
const log = require("electron-log")
const fs = require('fs');
const cron = require('node-cron');
import {saveStoreValue,removeStoreValue,getStoreValue} from './store.js'
import {handleRootDocument} from './env.js'
let currentjob = null
  
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
        const args = ['--config='+documentPath+"\\CGTeam"+'\\obs.txt','mount',project.mainProjectName+':'+project.mainProjectName.toLowerCase()+"/"+project.subprojectName,storageDir+project.mainProjectName,'--vfs-cache-mode','full'];


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

export async function quitAllRclone(event) {
  const childPIDs = getStoreValue(event,"rclone_pid")
  console.log(childPIDs)
  if (childPIDs!=null) {
    const pids = JSON.parse(childPIDs)
    for (let pid of pids) {
      try {
        process.kill(pid);
      }catch (error) {
        console.log(error)
      }
    }
  }
  removeStoreValue(event,"rclone_pid")
}  


export async function launchCronJob(event,cronExpression,projects,storageDir) {

    saveStoreValue(event,"cron_expression",cronExpression)
   
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

 // 假设您要创建的 Cron 作业的唯一标识是作业名称
const jobName = 'mydataSyncJob';   
// 检查作业是否已存在
if (currentjob!=null) {
  console.log("stop")
  // 如果已存在，则修改作业的执行时间
  currentjob.stop(); // 修改为每 5 分钟执行一次
} 
  // 如果不存在，则创建一个新的作业
  currentjob = cron.schedule(cronExpression, () => {
    // 这里的Cron表达式是 '* * * * *'，表示每分钟执行一次
    // 在这里执行您想要的命令或进程
    for (let project of projects) {
      const args = [command,'--config='+documentPath+"\\CGTeam"+'\\obs.txt','sync',project.mainProjectName+':'+project.mainProjectName.toLowerCase()+"/"+project.subprojectName,storageDir+project.mainProjectName];

      console.log(args.join(' '))
      exec(args.join(' '), (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
  }
  }, { scheduled: false }); // 注意将 scheduled 设置为 false，以便手动启动
  currentjob.taskName = jobName; // 为新作业设置名称
  currentjob.start(); // 启动新作业
}  