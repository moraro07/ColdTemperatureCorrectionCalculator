import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';


// Define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  
  const mainWindow = new BrowserWindow({
    width: 1050,
    height: 1080,
    // Setting minimum size for user experience
    minWidth: 800,
    minHeight: 600,
    title: 'Cold Temperature Correction Calculator',
    webPreferences: {
      // Good security defaults for modern Electron
      nodeIntegration: false,
      contextIsolation: true,
      // Removed 'preload.js' reference since it is not used in this app
    }
  });
  mainWindow.setMenuBarVisibility(false);

  // Load the built Vite assets from the 'dist' folder
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  // Optional: Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// When Electron is ready, create the window
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS, re-create a window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});