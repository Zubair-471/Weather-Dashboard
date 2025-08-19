// Configuration for Local Development
// This file uses your WeatherAPI.com API key for local testing
const WEATHER_API_KEY = 'cfc982980dda4fe99ee151608251708'; // WeatherAPI.com API key
const WEATHER_API_BASE_URL = 'http://api.weatherapi.com/v1';

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

// API Functions using WeatherAPI.com
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
            const weatherData = await fetchWeatherData(city);
            const forecastData = await fetchForecastData(city);
            const card = createWeatherCard(weatherData, forecastData);
            weatherCards.appendChild(card);
        } catch (error) {
            showError(`Failed to load weather for ${city}: ${error.message}`);
        }
    });
}

// Event Handlers
searchBtn.addEventListener('click', async () => {
    const city = searchInput.value.trim();
    if (!city) return;
    
    if (cities.includes(city)) {
        showError(`${city} is already in your dashboard`);
        return;
    }
    
    showLoading();
    
    try {
        const weatherData = await fetchWeatherData(city);
        const forecastData = await fetchForecastData(city);
        
        cities.push(city);
        const card = createWeatherCard(weatherData, forecastData);
        weatherCards.appendChild(card);
        
        searchInput.value = '';
        hideLoading();
    } catch (error) {
        showError(error.message);
        hideLoading();
    }
});

locationBtn.addEventListener('click', async () => {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const weatherData = await fetchWeatherByCoords(latitude, longitude);
            const forecastData = await fetchForecastData(weatherData.name);
            
            if (!cities.includes(weatherData.name)) {
                cities.push(weatherData.name);
                const card = createWeatherCard(weatherData, forecastData);
                weatherCards.appendChild(card);
            }
            
            hideLoading();
        } catch (error) {
            showError(error.message);
            hideLoading();
        }
    }, (error) => {
        showError('Unable to get your location. Please check your browser settings.');
        hideLoading();
    });
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

function removeCity(cityName) {
    cities = cities.filter(city => city !== cityName);
    const card = document.querySelector(`[data-city="${cityName}"]`);
    if (card) {
        card.remove();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderWeatherCards();
});
