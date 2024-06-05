const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

// Use your actual API key here
const API_KEY = "de3ffc19530024cb3027e2fbddaf281f";

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) { // HTML for main weather card
        return `
        <div class="container">
            <div class="weather-data">
                <div class="current-weather">
                    <div class="details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]}) </h2>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                        <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                    </div>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h4>${weatherItem.weather[0].description}</h4>
                    </div>
                </div>
            </div>
        </div>`;
    } else { // HTML for five days forecast
        return `
        <li class="cards">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
            <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
            <h4>Humidity: ${weatherItem.main.humidity} %</h4>
        </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // Filter the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return true;
            }
            return false;
        });

        // Clearing previous cards
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get entered city names
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Getting entered city coordinates
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates");
    });
}

searchButton.addEventListener("click", getCityCoordinates);
