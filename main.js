const { app, BrowserWindow } = require('electron');
const path = require('path');
const { sequelize } = require('./models');

const isDev = !app.isPackaged;

async function createWindow() {
  await sequelize.sync()
  
  const win = new BrowserWindow({
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

  win.maximize()
  win.loadURL(startURL);

  win.on('closed', () => (mainWindow = null));
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