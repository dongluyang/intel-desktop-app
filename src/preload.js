// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: (value) => ipcRenderer.send('ping',value),
  // We can expose not only functions, but also variables
})

contextBridge.exposeInMainWorld('intel_configs', {
  save: (key,value) => ipcRenderer.invoke('saveStoreValue',key,value),
  get: (key) => ipcRenderer.invoke('getStoreValue',key),
})


contextBridge.exposeInMainWorld('plugins', {
  open: (name) => ipcRenderer.invoke('openPlugin',name),
})


contextBridge.exposeInMainWorld('files', {
  write: (fileName,content) => ipcRenderer.invoke('writeFile',fileName,content),
  read: (fileName) => ipcRenderer.invoke('readFile',fileName),
})

contextBridge.exposeInMainWorld('envs', {
  getRootDocument: () => ipcRenderer.invoke('getRootDocument'),
})