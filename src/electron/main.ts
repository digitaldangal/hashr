import { app, BrowserWindow } from 'electron';
import * as reload from 'electron-reload';
import * as path from 'path';
import * as url from 'url';

if (process.env.NODE_ENV !== 'production') reload(__dirname, { electron: path.join(__dirname, '..', 'node_modules') });

let mainWindow: Electron.BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        frame: true,
        height: 725,
        width: 850,
        resizable: true,
        icon: path.join(__dirname, 'icon.png'),
    });

    mainWindow.loadURL(process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
