const {app,dialog,autoUpdater} = require('electron');
// import http from 'http'
const log = require("electron-log")
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"

// const isDevelopment = process.env.NODE_ENV === 'development'
// // 防止报错no such file or directory dev-app-update.yml
// if (isDevelopment) {
//   autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml')
// }

const server = 'https://update.electronjs.org'
const url = `${server}/dongluyang/intel-desktop-app/${process.platform}-${process.arch}/${app.getVersion()}`

autoUpdater.setFeedURL(
  { 
    url:url
  } 
)


autoUpdater.on('checking-for-update', () => {
    log.info("获取版本信息")
})

autoUpdater.on('update-not-available', () => {
    log.info("没有可更新版本")
})

autoUpdater.on('update-available', ()  => {
    log.info("发现新版本")
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    // dialog.showMessageBox({
    //   title: '下载完成',
    //   message: '最新版本已下载完成, 退出程序进行安装'
    // }).then(() => {
    //   autoUpdater.quitAndInstall()
    // })

    console.log('Update downloaded');
    console.log('Release Notes:', releaseNotes);
    console.log('Release Name:', releaseName);
    console.log('Release Date:', releaseDate);
    console.log('Update URL:', updateUrl);
    console.log('Update Event:', event);
    console.log('quitAndUpdate:', quitAndUpdate);
    dialog.showMessageBox({
        type: 'info',
        title: '软件更新',
        message: "发现新版本"+releaseName+", 确定安装?",
        detail: process.platform === 'win32' ? releaseNotes : releaseName,
        buttons: ['确定', '取消']
      }).then(returnValue => {
        if (returnValue.response === 0)  autoUpdater.quitAndInstall()
      })



  })

  
autoUpdater.on('error', (message) => {
    log.error('There was a problem updating the application')
    log.error(message)
})
  
// setInterval(() => {
//     autoUpdater.checkForUpdates()
// }, 10000)


export default autoUpdater