const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('weatherAPI', {
  getWeather: (coords) => ipcRenderer.invoke('get-weather', coords),
  getForecast: (coords) => ipcRenderer.invoke('get-forecast', coords),
  searchCities: (query) => ipcRenderer.invoke('search-cities', query)
});