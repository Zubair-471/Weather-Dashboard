// Configuration
const WEATHER_API_KEY = 'cfc982980dda4fe99ee151608251708'; // WeatherAPI.com API key
const WEATHER_API_BASE_URL = 'http://api.weatherapi.com/v1';
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

// DOM Elements
const weatherCards = document.getElementById('weather-cards');
const searchInput = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const loading = document.getElementById('loading');

// State
let cities = ['London', 'New York', 'Tokyo']; // Default cities
let isLoading = false;

// Utility Functions
function showLoading() {
    isLoading = true;
    loading.classList.remove('hidden');
}

function hideLoading() {
    isLoading = false;
    loading.classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    weatherCards.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function getWeatherIcon(iconCode) {
    // WeatherAPI.com provides full URLs for icons
    if (iconCode.startsWith('http')) {
        return iconCode;
    }
    // Fallback to OpenWeatherMap icons if needed
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function getCustomWeatherIcon(weatherDescription) {
    const description = weatherDescription.toLowerCase();
    
    if (description.includes('sunny') || description.includes('clear')) {
        return 'images/sunny.svg';
    } else if (description.includes('partly cloudy') || description.includes('partly')) {
        return 'images/partly-cloudy.svg';
    } else if (description.includes('cloudy') || description.includes('overcast')) {
        return 'images/cloudy.svg';
    } else if (description.includes('rain') || description.includes('drizzle') || description.includes('shower')) {
        return 'images/rainy.svg';
    } else if (description.includes('snow') || description.includes('sleet')) {
        return 'images/snowy.svg';
    } else if (description.includes('thunder') || description.includes('storm')) {
        return 'images/thunderstorm.svg';
    } else if (description.includes('fog') || description.includes('mist')) {
        return 'images/foggy.svg';
    } else if (description.includes('wind') || description.includes('breezy')) {
        return 'images/windy.svg';
    } else {
        // Default to cloudy for unknown conditions
        return 'images/cloudy.svg';
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
}

function getWeatherIconCode(code) {
    const iconMap = {
        0: '01d', 1: '01d', 2: '02d', 3: '03d',
        45: '50d', 48: '50d',
        51: '09d', 53: '09d', 55: '09d',
        61: '10d', 63: '10d', 65: '10d',
        71: '13d', 73: '13d', 75: '13d', 77: '13d',
        80: '09d', 81: '09d', 82: '09d',
        85: '13d', 86: '13d',
        95: '11d', 96: '11d', 99: '11d'
    };
    return iconMap[code] || '01d';
}

// API Functions
async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
        );
        
        if (!response.ok) {
            throw new Error(`City not found: ${city}`);
        }
        
        const data = await response.json();
        
        // Transform WeatherAPI.com data to match expected format
        return {
            name: data.location.name,
            main: {
                temp: data.current.temp_c,
                humidity: data.current.humidity,
                feels_like: data.current.feelslike_c,
                pressure: data.current.pressure_mb
            },
            weather: [{
                main: data.current.condition.text,
                description: data.current.condition.text,
                icon: data.current.condition.icon
            }],
            wind: {
                speed: data.current.wind_kph
            },
            sys: {
                country: data.location.country
            }
        };
    } catch (error) {
        throw new Error(`Failed to fetch weather for ${city}: ${error.message}`);
    }
}

async function fetchForecastData(city) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
            throw new Error(`Forecast not available for: ${city}`);
        }
        
        const data = await response.json();
        
        // Transform WeatherAPI.com forecast data to match expected format
        return data.forecast.forecastday.slice(1, 4).map(day => ({
            dt: new Date(day.date).getTime() / 1000,
            main: {
                temp_max: day.day.maxtemp_c,
                temp_min: day.day.mintemp_c,
                temp: day.day.avgtemp_c
            },
            weather: [{
                main: day.day.condition.text,
                description: day.day.condition.text,
                icon: day.day.condition.icon
            }]
        }));
    } catch (error) {
        throw new Error(`Failed to fetch forecast for ${city}: ${error.message}`);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=no`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather for your location');
        }
        
        const data = await response.json();
        
        // Transform WeatherAPI.com data to match expected format
        return {
            name: data.location.name,
            main: {
                temp: data.current.temp_c,
                humidity: data.current.humidity,
                feels_like: data.current.feelslike_c,
                pressure: data.current.pressure_mb
            },
            weather: [{
                main: data.current.condition.text,
                description: data.current.condition.text,
                icon: data.current.condition.icon
            }],
            wind: {
                speed: data.current.wind_kph
            },
            sys: {
                country: data.location.country
            }
        };
    } catch (error) {
        throw new Error(`Location weather error: ${error.message}`);
    }
}

// UI Functions
function createWeatherCard(weatherData, forecastData = []) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.city = weatherData.name;
    
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const humidity = weatherData.main.humidity;
    const windSpeed = Math.round(weatherData.wind.speed * 3.6); // Convert m/s to km/h
    
    card.innerHTML = `
        <button class="remove-btn" onclick="removeCity('${weatherData.name}')">
            <i class="fas fa-times"></i>
        </button>
        
        <h2><i class="fas fa-map-marker-alt"></i> ${weatherData.name}, ${weatherData.sys.country}</h2>
        
                 <img src="${getCustomWeatherIcon(weatherData.weather[0].description)}" 
              alt="${weatherData.weather[0].description}" 
              class="weather-icon">
        
        <div class="temperature">${temp}°C</div>
        <div class="weather-description">${weatherData.weather[0].description}</div>
        
                 <div class="weather-details">
             <div class="detail">
                 <i class="fas fa-thermometer-half"></i>
                 <span>Feels like ${feelsLike}°C</span>
             </div>
             <div class="detail">
                 <i class="fas fa-tint"></i>
                 <span>Humidity ${humidity}%</span>
             </div>
             <div class="detail">
                 <i class="fas fa-wind"></i>
                 <span>Wind ${windSpeed} km/h</span>
             </div>
             <div class="detail">
                 <i class="fas fa-compress-alt"></i>
                 <span>${weatherData.main.pressure || 'N/A'} hPa</span>
             </div>
         </div>
        
        ${forecastData.length > 0 ? `
            <div class="forecast">
                ${forecastData.map(day => `
                    <div class="forecast-day">
                        <small>${formatDate(day.dt)}</small>
                                                 <img src="${getCustomWeatherIcon(day.weather[0].description)}" 
                              alt="${day.weather[0].description}">
                        <div class="temp">${Math.round(day.main.temp)}°C</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
    
    return card;
}

function renderWeatherCards() {
    weatherCards.innerHTML = '';
    
    cities.forEach(async (city) => {
        try {
            showLoading();
            
            const [weatherData, forecastData] = await Promise.all([
                fetchWeatherData(city),
                fetchForecastData(city)
            ]);
            
            const card = createWeatherCard(weatherData, forecastData);
            weatherCards.appendChild(card);
            
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    });
}

function addCity(cityName) {
    const trimmedCity = cityName.trim();
    
    if (!trimmedCity) {
        showError('Please enter a city name');
        return;
    }
    
    if (cities.includes(trimmedCity)) {
        showError(`${trimmedCity} is already in your dashboard`);
        return;
    }
    
    cities.push(trimmedCity);
    renderWeatherCards();
    searchInput.value = '';
}

function removeCity(cityName) {
    cities = cities.filter(city => city !== cityName);
    renderWeatherCards();
}

async function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    try {
        showLoading();
        
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: true
            });
        });
        
        const { latitude, longitude } = position.coords;
        const weatherData = await fetchWeatherByCoords(latitude, longitude);
        
        if (!cities.includes(weatherData.name)) {
            cities.unshift(weatherData.name);
            renderWeatherCards();
        } else {
            showError(`${weatherData.name} is already in your dashboard`);
        }
        
    } catch (error) {
        if (error.code === 1) {
            showError('Location access denied. Please allow location access.');
        } else if (error.code === 2) {
            showError('Location unavailable. Please try again.');
        } else if (error.code === 3) {
            showError('Location request timed out. Please try again.');
        } else {
            showError(error.message);
        }
    } finally {
        hideLoading();
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    if (!isLoading) {
        addCity(searchInput.value);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isLoading) {
        addCity(searchInput.value);
    }
});

locationBtn.addEventListener('click', () => {
    if (!isLoading) {
        getCurrentLocation();
    }
});

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderWeatherCards();
});

// Auto-refresh weather data every 30 minutes
setInterval(() => {
    if (cities.length > 0) {
        renderWeatherCards();
    }
}, 30 * 60 * 1000);