# 天氣查詢桌面應用程式

一個使用 Electron + Node.js 開發的全球天氣查詢桌面應用程式，支援全世界國家、城市及地區的詳細天氣資訊。

## 功能特色

- 🌍 **全球天氣查詢**: 支援世界各國城市天氣查詢
- 🏙️ **精確到區域**: 可查詢特定區域天氣 (例如: 內湖區)
- 📊 **詳細資訊**: 溫度、濕度、風速、氣壓、能見度等
- 📅 **5天預報**: 未來5天天氣預報
- 🎨 **美觀界面**: 現代化設計，支援中文介面
- 💻 **跨平台**: Windows、macOS、Linux 支援

## 技術架構

- **框架**: Electron
- **後端**: Node.js
- **API**: WeatherAPI (免費版)
- **前端**: HTML5 + CSS3 + JavaScript
- **HTTP請求**: Axios

## 安裝使用

### 1. 安裝依賴

```bash
cd weather-app
npm install
```

### 2. 設定 API Key

1. 前往 [WeatherAPI](https://www.weatherapi.com/) 註冊免費帳號
2. 取得免費的 API Key（每月100萬次請求）
3. 在 `main.js` 中將 `YOUR_WEATHERAPI_KEY` 替換為您的 API Key

### 3. 啟動應用程式

開發模式：
```bash
npm run dev
```

正式啟動：
```bash
npm start
```

### 4. 建置應用程式

```bash
npm run build
```

## 使用說明

1. 啟動應用程式後，在搜尋框輸入城市名稱
2. 支援中文（台北）和英文（New York）搜尋
3. 可搜尋到區域級別（例如：內湖區、大安區）
4. 點選搜尋結果即可查看該地區天氣
5. 應用程式會顯示當前天氣和未來5天預報

## 專案結構

```
weather-app/
├── main.js          # Electron主進程
├── preload.js       # 安全預載腳本
├── package.json     # 專案設定
├── renderer/        # 前端檔案
│   ├── index.html   # 主頁面
│   ├── style.css    # 樣式檔案
│   └── script.js    # 前端邏輯
└── README.md        # 說明檔案
```

## 開發注意事項

- API Key 請勿提交到版本控制系統
- 建議使用環境變數管理敏感資訊
- 支援離線快取功能可在未來版本中加入
- 可考慮加入地圖選擇功能