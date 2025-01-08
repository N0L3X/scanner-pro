import { app, BrowserWindow, ipcMain } from 'electron';
import { createServer } from 'net';
import path from 'path';
import isDev from 'electron-is-dev';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Port scanning functionality
ipcMain.handle('scan-port', async (event, { host, port }) => {
  return new Promise((resolve) => {
    const socket = createServer();
    const timeout = setTimeout(() => {
      socket.close();
      resolve({ port, status: 'closed' });
    }, 1000);

    socket.once('error', (err) => {
      clearTimeout(timeout);
      if (err.code === 'EADDRINUSE') {
        resolve({ port, status: 'open' });
      } else {
        resolve({ port, status: 'closed' });
      }
      socket.close();
    });

    socket.listen(port, host, () => {
      clearTimeout(timeout);
      socket.close();
      resolve({ port, status: 'open' });
    });
  });
});

ipcMain.handle('scan-ports', async (event, { host, startPort, endPort }) => {
  const results = [];
  for (let port = startPort; port <= endPort; port++) {
    const result = await ipcMain.handle('scan-port', event, { host, port });
    results.push(result);
  }
  return results;
});