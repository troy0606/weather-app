# CLAUDE.md

此檔案為 Claude Code (claude.ai/code) 在此儲存庫中工作時提供指引。

## 開發指令

### 執行應用程式
- `npm start` - 啟動 Electron 桌面應用程式
- `npm run dev` - 以開發模式啟動（啟用開發者工具和日誌）

### 建置和發佈
- `npm run build` - 使用 electron-builder 建置發行版本
- `npm run dist` - 建置但不發佈到發行通道
- `npm install` - 安裝所有依賴項目

## 系統架構

這是一個基於 Electron 的桌面天氣應用程式，採用三層架構：

### 主進程 (main.js)
- **用途**: Electron 主進程，管理應用程式生命週期和 API 通訊
- **主要職責**: 視窗建立、IPC 處理器處理天氣資料、WeatherAPI 整合
- **API 整合**: 使用 WeatherAPI.com 的三個端點：
  - `get-weather`: 當前天氣狀況 (`/v1/current.json`)
  - `get-forecast`: 5天預報 (`/v1/forecast.json`) 
  - `search-cities`: 城市/地點搜尋 (`/v1/search.json`)
- **安全性**: 實作上下文隔離並停用 node 整合

### 預載腳本 (preload.js)
- **用途**: 主進程和渲染進程間的安全橋接
- **API 介面**: 向渲染進程公開 `window.weatherAPI` 及其三個方法
- **安全性**: 使用 contextBridge 進行安全的 IPC 通訊

### 渲染進程 (renderer/)
- **結構**: 基於類別架構的單頁應用程式
- **主要類別**: `WeatherApp` 類別管理所有前端功能
- **主要功能**:
  - 即時城市搜尋與自動完成
  - 當前天氣顯示及詳細指標
  - 5天預報視覺化
  - 地點顯示的國旗整合
- **樣式**: 使用 CSS Grid 和 Flexbox 佈局，採用玻璃擬態設計

## API 資料流

1. 使用者搜尋 → `searchCities()` → IPC → WeatherAPI 搜尋端點
2. 使用者選擇地點 → `loadWeatherData()` → 並行呼叫當前天氣 + 預報 API
3. 資料處理 → `displayCurrentWeather()` + `displayForecast()` → UI 更新

## WeatherAPI 整合注意事項

- **API Key**: 硬編碼於 main.js 中（建議移至環境變數）
- **語言**: 設定為中文 (`lang=zh`)
- **單位**: 公制系統（攝氏度、km/h 等）
- **使用限制**: 免費版每月 100 萬次請求
- **回應格式**: 與 OpenWeatherMap 不同 - 使用巢狀結構，包含 `current` 和 `forecast.forecastday` 物件

## 地點資料處理

- WeatherAPI 回傳地點物件包含: `name`, `region`, `country`, `lat`, `lon`
- 前端轉換座標供顯示使用，並使用 `region` 而非 `state`
- 應用程式啟動時預設地點設為「台北市, 台灣」