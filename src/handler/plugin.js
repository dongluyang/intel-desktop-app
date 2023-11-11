const path = require('path');
const isDev = require('electron-is-dev');
const { spawn,exec,execSync } = require('child_process');
const registry = require('winreg');
const log = require("electron-log")
import {saveStoreValue,getStoreValue} from './store.js'

export async function handleOpenPlugins (event, pluginName) {

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
  }
  
  
  
export  async function handleRembgExec (event, srcDir,distDir) {
  
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
      command = path.join(__dirname, '../../resources', 'rembg.exe');
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



  export  async function handleGostStart (event, port,admission) {
  

    // 要执行的命令和参数
    let command;
    if (isDev) {
      // 在开发模式下，`rembg.exe` 可能在项目根目录下或其他位置
      command = path.join(__dirname, '../../resources', 'gost.exe');
    } else {
      // 在生产模式下，`rembg.exe` 位于安装包的 `resources` 文件夹下
      command = path.join(process.resourcesPath, 'app','resources', 'gost.exe');
      log.info(command)
    }
    // const command = 'rembg';
    const args = ['-L=:'+port+(admission!=''?'?admission=~'+admission:'')];
  
        try {
        // 启动一个后台进程
        const childProcess = spawn(command, args, {
                detached: true, // 将子进程独立出来，成为一个新的进程组
                stdio: 'ignore' // 忽略标准输入/输出，将其置为 'ignore' 或 'inherit'
        });
            
        // 子进程已经独立出来，你可以选择是否将其设置为一个新的会话
        childProcess.unref();

        const proxyInfos = getStoreValue(event,"proxy_infos")

        for(let proxyInfo of proxyInfos) {
           if (proxyInfo.port ==port) {
               proxyInfo.pid = childProcess.pid
               proxyInfo.status = "start"
               saveStoreValue(event,"proxy_infos",proxyInfos)
               break
           }
        }       

        } catch (error) {
        console.error(`执行命令时发生错误： ${error.message}`);
        }
  }


  export async function handleGostStop(event,port) {
    const proxyInfos = getStoreValue(event,"proxy_infos")

    for(let proxyInfo of proxyInfos) {
      if (proxyInfo.port ==port) {
        try {
        let pid = proxyInfo.pid
        console.log(pid)
        process.kill(pid);
        proxyInfo.status = "stop"
        proxyInfo.pid = -1
        saveStoreValue(event,"proxy_infos",proxyInfos)
      }catch (error) {
        console.log(error)
      }
      }
   }   

  }  


  export async function handleGostDelete(event,port) {
    const proxyInfos = getStoreValue(event,"proxy_infos")
    const newArray = proxyInfos.filter(item => item.port !== port); 
    saveStoreValue(event,"proxy_infos",newArray)
    return newArray
  }  
  