const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
  scanTarget: (args) => ipcRenderer.invoke('scan-target', args),
  msfScan: (args) => ipcRenderer.invoke('msf-scan', args),
  onProgress: (callback) => {
    ipcRenderer.on('scan-progress', (_, data) => callback(data));
    return () => {
      ipcRenderer.removeAllListeners('scan-progress');
    };
  }
});