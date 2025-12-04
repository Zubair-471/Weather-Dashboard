# Weather Dashboard

A modern, responsive weather application that displays real-time weather information for multiple cities. Features a beautiful card-based layout with weather icons, temperature data, and location-based weather updates.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Weather API](https://img.shields.io/badge/Weather_API-WeatherAPI.com-orange?style=flat-square)

## 🎯 Live Demo

[View Live Demo](https://zubair-471.github.io/Weather-Dashboard/)

## ✨ Features

### 🌤 Weather Information
- **Real-time Weather Data**: Current weather conditions
- **Multiple Cities**: Add and track weather for multiple locations
- **Weather Icons**: Visual representation of weather conditions
- **Temperature Display**: Current temperature in Celsius/Fahrenheit
- **Weather Details**: Humidity, wind speed, and more

### 🎨 User Interface
- **Card-based Layout**: Clean, modern weather cards
- **Responsive Design**: Works perfectly on all devices
- **Weather Icons**: Beautiful SVG weather icons
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error messages

### 🔍 Search & Location
- **City Search**: Search for any city worldwide
- **Location Detection**: Get weather for current location
- **Add Cities**: Add multiple cities to dashboard
- **Remove Cities**: Remove cities from tracking list

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zubair-471/Weather-Dashboard.git
   cd Weather-Dashboard
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000`
   - Or use Node (npm) from the project root:
     ```powershell
     npm install
     npm start
     # Then open http://localhost:8000
     ```

3. **Ready to Use** ✅
   - **GitHub Demo**: Uses Open-Meteo API (free, no API key required)
   - **Local Development**: Use `script-local.js` with your WeatherAPI.com key
   - Both versions work perfectly!

4. **Test the features**
   - Search for a city
   - Use location detection
   - Add multiple cities
   - View weather details

## 🗂 Application Sections

| Section | Description |
|---------|-------------|
| 🔍 **Search Bar** | City search and location detection |
| 🌤 **Weather Cards** | Individual weather cards for each city |
| 📱 **Responsive Grid** | Adaptive layout for all screen sizes |
| ⚡ **Loading States** | Visual feedback during API calls |

## 📁 Project Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── style.css           # CSS styles and animations
├── script.js           # JavaScript functionality
├── images/             # Weather icons and assets
│   ├── sunny.svg       # Sunny weather icon
│   ├── cloudy.svg      # Cloudy weather icon
│   ├── rainy.svg       # Rainy weather icon
│   └── ...             # Other weather icons
├── README.md           # Project documentation
└── LICENSE             # MIT License
```

## 🎨 Features in Detail

### Weather Cards
- **City Name**: Clear city identification
- **Temperature**: Current temperature display
- **Weather Icon**: Visual weather representation
- **Weather Description**: Text description of conditions
- **Additional Data**: Humidity, wind speed, etc.

### Search Functionality
- **City Search**: Type to search for cities
- **Auto-complete**: Suggested city names
- **Location Button**: Get current location weather
- **Add City**: Add searched city to dashboard

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Grid Layout**: Flexible card arrangement
- **Touch-Friendly**: Large buttons and touch targets
- **Adaptive Icons**: Weather icons scale properly

## 🔧 Customization

### API Configuration

**For GitHub Demo (script.js):**
```javascript
// Uses Open-Meteo API (free, no API key required)
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
```

**For Local Development (script-local.js):**
```javascript
// Uses your WeatherAPI.com API key
const WEATHER_API_KEY = 'cfc982980dda4fe99ee151608251708';
const WEATHER_API_BASE_URL = 'http://api.weatherapi.com/v1';
```

**To switch between versions:**
1. For GitHub demo: Use `script.js` (default)
2. For local development: Rename `script-local.js` to `script.js`

### 🛠 Development helpers (live reload & local API)

To make development easier there's now a live-reload dev script and a couple of helper npm scripts in this project:

- Start a live-reloading dev server (will open your browser):
```powershell
npm run dev
```

- Switch to the local WeatherAPI implementation (copy `script-local.js` -> `script.js`):
```powershell
npm run use-local
# then open http://localhost:8000 or run `npm run dev`
```

- Restore the original `script.js` from Git (undo the copy):
```powershell
npm run restore-remote
```

Important: `script-local.js` may contain a placeholder API key — do not commit a real API key to the repository. Keep local keys out of version control or use environment-based build steps for production apps.

### Adding New Weather Icons
1. Add SVG icon to `images/` folder
2. Update the weather icon mapping in `script.js`:
```javascript
const weatherIcons = {
    '01d': 'sunny.svg',
    '02d': 'partly-cloudy.svg',
    // Add new mappings
};
```

### Styling Customization
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --card-bg: #ffffff;
    --text-color: #333333;
}
```

## 🌤 Weather API Integration

The app uses different APIs based on the version:

**GitHub Demo (Open-Meteo):**
- **Current Weather**: `api.open-meteo.com/v1/forecast`
- **Geocoding**: `geocoding-api.open-meteo.com/v1/search`

**Local Development (WeatherAPI.com):**
- **Current Weather**: `api.weatherapi.com/v1/current.json`
- **Forecast**: `api.weatherapi.com/v1/forecast.json`

### Data Retrieved
- Current temperature
- Weather description
- Humidity percentage
- Wind speed
- Weather condition codes

## 🎯 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile**: iOS Safari, Chrome Mobile

## 📊 Performance Features

- **Efficient API Calls**: Optimized data fetching
- **Caching**: Local storage for recent searches
- **Lazy Loading**: Weather icons load as needed
- **Error Handling**: Graceful fallbacks for API failures
- **Responsive Images**: Optimized SVG weather icons

## 🔒 Privacy & Security

- **No Data Storage**: Weather data not stored permanently
- **HTTPS Required**: Secure API communication
- **API Key Protection**: Keep API key secure
- **Location Permission**: Optional location access

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Access via `https://username.github.io/repo-name`

### Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author & Contact

* **M. Zubair Tariq**
* 📧 [ZubairTariq.dev@gmail.com](mailto:ZubairTariq.dev@gmail.com)
* 💼 [LinkedIn](https://www.linkedin.com/in/muhammad-zubair-tariq-70209b364)
* 🎯 [Fiverr – ZubairWebWorks](https://www.fiverr.com/ZubairWebWorks)

---

**Made by M. Zubair Tariq**

⭐ **Star this repo if you found it useful!**
