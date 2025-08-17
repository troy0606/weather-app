class WeatherApp {
    constructor() {
        this.currentLocation = null;
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.loadDefaultLocation();
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const citySearch = document.getElementById('citySearch');
        
        searchBtn.addEventListener('click', () => this.searchCities());
        citySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCities();
            }
        });

        citySearch.addEventListener('input', () => {
            if (citySearch.value.length > 2) {
                this.searchCities();
            } else {
                this.clearSearchResults();
            }
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('zh-TW', options);
    }

    async searchCities() {
        const query = document.getElementById('citySearch').value.trim();
        if (!query) return;

        this.showLoading('搜尋城市中...');
        
        try {
            const result = await window.weatherAPI.searchCities(query);
            
            if (result.success) {
                this.displaySearchResults(result.data);
            } else {
                this.showError('搜尋失敗: ' + result.error);
            }
        } catch (error) {
            this.showError('搜尋時發生錯誤: ' + error.message);
        }
    }

    displaySearchResults(cities) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        if (cities.length === 0) {
            resultsContainer.innerHTML = '<div class="loading">找不到符合的城市</div>';
            return;
        }

        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            
            const countryFlag = this.getCountryFlag(city.country);
            const displayName = `${city.name}${city.region ? ', ' + city.region : ''}, ${city.country} ${countryFlag}`;
            
            item.innerHTML = `
                <div><strong>${displayName}</strong></div>
                <div style="font-size: 0.9em; color: #666;">
                    緯度: ${city.lat.toFixed(4)}, 經度: ${city.lon.toFixed(4)}
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectLocation(city, displayName);
            });
            
            resultsContainer.appendChild(item);
        });
    }

    getCountryFlag(countryCode) {
        const flags = {
            'TW': '🇹🇼', 'US': '🇺🇸', 'JP': '🇯🇵', 'KR': '🇰🇷', 
            'CN': '🇨🇳', 'HK': '🇭🇰', 'SG': '🇸🇬', 'MY': '🇲🇾',
            'TH': '🇹🇭', 'VN': '🇻🇳', 'PH': '🇵🇭', 'ID': '🇮🇩',
            'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹',
            'ES': '🇪🇸', 'AU': '🇦🇺', 'CA': '🇨🇦', 'BR': '🇧🇷'
        };
        return flags[countryCode] || '🌍';
    }

    async selectLocation(location, displayName) {
        this.currentLocation = { ...location, displayName };
        this.clearSearchResults();
        document.getElementById('citySearch').value = displayName;
        
        await this.loadWeatherData();
    }

    async loadWeatherData() {
        if (!this.currentLocation) return;

        this.showLoading('載入天氣資料中...');
        document.getElementById('weatherSection').style.display = 'block';

        try {
            const [weatherResult, forecastResult] = await Promise.all([
                window.weatherAPI.getWeather({
                    lat: this.currentLocation.lat,
                    lon: this.currentLocation.lon,
                    city: this.currentLocation.name
                }),
                window.weatherAPI.getForecast({
                    lat: this.currentLocation.lat,
                    lon: this.currentLocation.lon
                })
            ]);

            this.hideLoading();

            if (weatherResult.success) {
                this.displayCurrentWeather(weatherResult.data);
            } else {
                this.showError('載入當前天氣失敗: ' + weatherResult.error);
                return;
            }

            if (forecastResult.success) {
                this.displayForecast(forecastResult.data);
            } else {
                this.showError('載入預報資料失敗: ' + forecastResult.error);
            }

        } catch (error) {
            this.showError('載入天氣資料時發生錯誤: ' + error.message);
        }
    }

    displayCurrentWeather(data) {
        document.getElementById('cityName').textContent = this.currentLocation.displayName;
        document.getElementById('currentTemp').textContent = Math.round(data.current.temp_c);
        document.getElementById('weatherDesc').textContent = data.current.condition.text;
        document.getElementById('feelsLike').textContent = Math.round(data.current.feelslike_c) + '°C';
        document.getElementById('humidity').textContent = data.current.humidity + '%';
        document.getElementById('windSpeed').textContent = data.current.wind_kph.toFixed(1) + ' km/h';
        document.getElementById('pressure').textContent = data.current.pressure_mb + ' hPa';
        document.getElementById('visibility').textContent = data.current.vis_km + ' km';
        document.getElementById('uvIndex').textContent = data.current.uv || '--';
        
        const iconUrl = `https:${data.current.condition.icon}`;
        document.getElementById('weatherIcon').src = iconUrl;
    }

    displayForecast(data) {
        const container = document.getElementById('forecastContainer');
        container.innerHTML = '';

        data.forecast.forecastday.forEach(forecast => {
            const item = document.createElement('div');
            item.className = 'forecast-item';
            
            const date = new Date(forecast.date);
            const dateStr = date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
            
            item.innerHTML = `
                <div class="forecast-date">${dateStr}</div>
                <div class="forecast-icon">
                    <img src="https:${forecast.day.condition.icon}" alt="${forecast.day.condition.text}">
                </div>
                <div class="forecast-description">${forecast.day.condition.text}</div>
                <div class="forecast-temps">
                    <span class="forecast-high">${Math.round(forecast.day.maxtemp_c)}°</span>
                    <span class="forecast-low">${Math.round(forecast.day.mintemp_c)}°</span>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    showLoading(message) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = `<div class="loading">${message}</div>`;
    }

    hideLoading() {
        this.clearSearchResults();
    }

    showError(message) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = `<div class="error">${message}</div>`;
    }

    clearSearchResults() {
        document.getElementById('searchResults').innerHTML = '';
    }

    async loadDefaultLocation() {
        document.getElementById('citySearch').value = '台北市, 台灣';
        await this.searchCities();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});