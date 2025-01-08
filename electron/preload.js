import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  scanPort: (args) => ipcRenderer.invoke('scan-port', args),
  scanPorts: (args) => ipcRenderer.invoke('scan-ports', args)
});