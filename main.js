const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { sequelize } = require('./models');

const isDev = !app.isPackaged;

let mainWindow;

async function createWindow() {
  await sequelize.sync()
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, 
      nodeIntegration: false,
      sandbox: false  
    }
  })

  const startURL = isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../renderer/out/index.html')}`;

  mainWindow.maximize()
  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  if (isDev) {
    const childProcess = require('child_process');
    childProcess.exec('npm run dev', { cwd: path.join(__dirname, '../renderer') });
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});