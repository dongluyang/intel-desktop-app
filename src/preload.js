// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer,app } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  appVersion: () => ipcRenderer.invoke('appVersion'),
  ping: (value) => ipcRenderer.send('ping',value),
  // We can expose not only functions, but also variables
})

contextBridge.exposeInMainWorld('intel_configs', {
  save: (key,value) => ipcRenderer.invoke('saveStoreValue',key,value),
  get: (key) => ipcRenderer.invoke('getStoreValue',key),
  remove: (key) => ipcRenderer.invoke('removeStoreValue',key),
})


contextBridge.exposeInMainWorld('plugins', {
  open: (name) => ipcRenderer.invoke('openPlugin',name),
  get_maya:(maya_version) => ipcRenderer.invoke('getMayaPlugin',maya_version),
})


contextBridge.exposeInMainWorld('files', {
  write: (fileName,content) => ipcRenderer.invoke('writeFile',fileName,content),
  read: (fileName) => ipcRenderer.invoke('readFile',fileName),
  select_directory: () => ipcRenderer.invoke('selectDirectory'),
  open_directory: (directoryName) => ipcRenderer.invoke('openFolder',directoryName),
})

contextBridge.exposeInMainWorld('envs', {
  getRootDocument: () => ipcRenderer.invoke('getRootDocument'),
})

contextBridge.exposeInMainWorld('rembg', {
  exec_p: (srcDir,distDir) => ipcRenderer.invoke('doRembgExec',srcDir,distDir),
})

contextBridge.exposeInMainWorld('gost', {
  start: (port,admission) => ipcRenderer.send('doGostStart',port,admission),
  stop: (port) => ipcRenderer.send('doGostStop',port),
  delete: (port) => ipcRenderer.invoke('doGostDelete',port)
  
})


contextBridge.exposeInMainWorld('rclone', {
  mount_to_local: (projects,teamName) => ipcRenderer.send('doRcloneMount',projects,teamName),
  quit_app: () => ipcRenderer.invoke('quitApp'),
  launch_cron_job: (cronExpression,projects,assets,teamName) => ipcRenderer.send('doLaunchCronJob',cronExpression,projects,assets,teamName)
})