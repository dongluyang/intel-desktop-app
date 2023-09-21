const path = require('path');
const os = require('os');
const fs = require('fs');

export function getMayaPlugin (event, mayaVersion) {
        const platform = os.platform(); // 获取操作系统平台
        if (platform === 'win32' && mayaVersion.toLowerCase().indexOf("maya")!=-1) {
               const documentsPath = path.join(os.homedir(), 'Documents');
               const pluginPath = documentsPath+"\\maya\\plug-ins\\CGMayaPlugin.py"
                // 使用 fs.existsSync 同步检查文件是否存在
                if (fs.existsSync(pluginPath)) {
                    const configPath = documentsPath+"\\CGTeam\\CGMaya.ini"
                    const fileContent = fs.readFileSync(configPath, 'utf8');
                    const configData = JSON.parse(fileContent)
                    return configData.softwareVersion

                } else {
                    return "-1"
                }    
        } 
        return "-1"
  }