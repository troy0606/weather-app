const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: '天氣查詢',
    minWidth: 800,
    minHeight: 600
  });

  mainWindow.loadFile('renderer/index.html');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-weather', async (event, { lat, lon, city }) => {
  try {
    const API_KEY = process.env.WEATHERAPI_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&lang=zh`;
    
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('get-forecast', async (event, { lat, lon }) => {
  try {
    const API_KEY = process.env.WEATHERAPI_KEY;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&lang=zh`;
    
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('search-cities', async (event, query) => {
  try {
    const API_KEY = process.env.WEATHERAPI_KEY;
    const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
    
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});