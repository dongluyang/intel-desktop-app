const path = require('path');
const isDev = require('electron-is-dev');
const {spawn,exec,execSync } = require('child_process');
const log = require("electron-log")
const fs = require('fs');
const cron = require('node-cron');
const yauzl = require('yauzl');
import {saveStoreValue,removeStoreValue,getStoreValue} from './store.js'
import {handleRootDocument} from './env.js'
let currentjob = null


// 获取目录下的所有 Zip 文件
function getZipFilesInDirectory(directoryPath) {
  try {
    const dataFiles = fs.readdirSync(directoryPath);
    const zipFiles = dataFiles.filter(dataFile => path.extname(dataFile).toLowerCase() === '.zip' && dataFile.indexOf("texture")!=-1);
    return zipFiles.map(zipFile => path.join(directoryPath,zipFile));
    
  } catch (error) {
    console.error('Error reading directory:', error.message);
    return [];
  }
}


// 获取目录下的所有 ma、mb 文件
function getAssetFilesInDirectory(directoryPath) {
  try {
    const dataFiles = fs.readdirSync(directoryPath);
    const assetFiles = dataFiles.filter(dataFile => path.extname(dataFile).toLowerCase() === '.ma' || path.extname(dataFile).toLowerCase() === '.mb');
    return assetFiles.map(assetFile => path.join(directoryPath,assetFile));
    
  } catch (error) {
    console.error('Error reading directory:', error.message);
    return [];
  }
}


function executeFileProcess(filePath) {
    // 设置命令执行的选项，包括工作目录和环境变量
    const options = {
      // env: { PATH: customPath+path.delimiter+process.env.PATH},
      encoding: 'utf-8'
    };
  
  
    // 要执行的命令和参数
    let command;
    if (isDev) {
      // 在开发模式下，`rembg.exe` 可能在项目根目录下或其他位置
      command = path.join(__dirname, '../../resources', 'convert.exe');
    } else {
      // 在生产模式下，`rembg.exe` 位于安装包的 `resources` 文件夹下
      command = path.join(process.resourcesPath, 'app','resources', 'convert.exe');
      log.info(command)
    }
  
    try {
      let args = [filePath]
      // 同步执行命令
      const output = execSync(`${command} ${args.join(' ')}`, options);
      console.log(`命令输出：\n${output}`);
      return output
    } catch (error) {
      console.error(`执行命令时发生错误： ${error.message}`);
    }
}



// 解压函数
function unzip(zipFilePath, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  } 
  yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
    if (err) throw err;

    zipfile.readEntry();
    zipfile.on('entry', (entry) => {
      const targetFile = path.join(targetDir, entry.fileName);

      if (/\/$/.test(entry.fileName)) {
        // 如果是目录，则创建目录
        mkdirp(targetFile, (err) => {
          if (err) throw err;
          zipfile.readEntry();
        });
      } else {
        // 删除已存在的文件，然后创建文件并写入数据
        if (fs.existsSync(targetFile)) {
          fs.unlinkSync(targetFile);
        }

        zipfile.openReadStream(entry, (err, readStream) => {
          if (err) throw err;
          readStream.on('end', () => {
            zipfile.readEntry();
          });

          const writeStream = fs.createWriteStream(targetFile);
          readStream.pipe(writeStream);
        });
      }
    });

    zipfile.on('end', () => {
      console.log('解压完成');
    });
  });
}






  
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


export async function launchCronJob(event,cronExpression,projects,assets,teamName) {

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

    // 生成文件内容
    let fileContent = '';

    for (let project of projects) {
        const parsedData = JSON.parse(project.storageOption);
        console.log(parsedData.region)
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
          // 使用 fs.existsSync() 检查目录是否存在
     var storageDir = project.localStorage+teamName+"/"+project.mainProjectName+"/"+project.subprojectName     
     if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true });
     }
     
     var assetNames4Project = assets.filter(asset=>asset.projectName == project.subprojectName).map(asset=>asset.name)

      for (let asset of assets) {

        if (asset.projectName != project.subprojectName) {
            console.log(asset.projectName+"："+project.subprojectName)
            continue
        } 
        if (!fs.existsSync(storageDir+"/"+asset.name)) {
          fs.mkdirSync(storageDir+"/"+asset.name, { recursive: true });
        } 


        const args = [command,'--config='+documentPath+"\\CGTeam"+'\\obs.txt','sync',project.mainProjectName+':'+project.mainProjectName.toLowerCase()+"/"+project.subprojectName.toLowerCase()+"/"+asset.name,storageDir+"/"+asset.name];


        exec(args.join(' '), (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }

          const textureZips = getZipFilesInDirectory(storageDir+"/"+asset.name)
          for (let textureZip of textureZips) {
            unzip(textureZip,storageDir+"/"+asset.name+"/texture")
          }

          console.log(`stdout: ${stdout}`);

          const assetFiles =   getAssetFilesInDirectory(storageDir+"/"+asset.name)

          for (let assetFile of assetFiles) {
 
              // 使用path模块解析文件路径
              const oldFileNameWithExtension = path.basename(assetFile);
              const fileExtension = path.extname(oldFileNameWithExtension);
              const oldFileName = path.basename(oldFileNameWithExtension, fileExtension);

              // 构建新的文件名
              const newFileName = oldFileName + '_tmp' + fileExtension;
              const newFilePath = path.join(path.dirname(assetFile), newFileName);

              // 调用fs.rename()来重命名文件
              fs.rename(assetFile, newFilePath, (err) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log('文件重命名成功！');

               //生成gb.json文件
               const jsonData = {
                "assetList": assetNames4Project,
                "assetName":asset.name,
                "fileName_in":newFilePath,
                "fileName_out":assetFile,
                "projectDir":storageDir,
                "refProjectDir": storageDir
              }

              // 将JSON数据转换为字符串
                const jsonString = JSON.stringify(jsonData, null, 2);
                
                try {
                  // 使用fs.writeFileSync同步写入文件
                  fs.writeFileSync( path.join(path.dirname(assetFile), "config.json"), jsonString, 'utf-8');
                  executeFileProcess(path.join(path.dirname(assetFile), "config.json"))
                  console.log('文件同步写入成功！');
                } catch (err) {
                  console.error('写入文件时发生错误:', err);
                }


                }
              });


          }




        });
      }
    }
  }, { scheduled: false }); // 注意将 scheduled 设置为 false，以便手动启动
  currentjob.taskName = jobName; // 为新作业设置名称
  currentjob.start(); // 启动新作业
}  

export function handleCronJobStatus() {
  if (currentjob!=null) {
     return "active"
  } else {
     return "inactive"
  }
}