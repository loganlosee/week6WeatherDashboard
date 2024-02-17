document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');
    const searchHistoryList = document.getElementById('searchHistory');
    const currentWeatherDisplay = document.getElementById('currentWeatherDisplay');
    const forecastDisplay = document.getElementById('forecastDisplay');
    const apiKey = '626ef244207ceeff70adc1efc9a59708';

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = document.getElementById('cityInput').value;
        fetchWeatherForecast(city);
        saveSearchHistory(city);
        displaySearchHistory();
    });

    function fetchWeatherForecast(city) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayCurrentWeather(data);
                displayForecast(data);
            })
            .catch(error => {
                console.error('An error occurred:', error);
                alert('Failed to fetch weather data. Please check the city name and try again.');
            });
    }

    function displayCurrentWeather(data) {
        currentWeatherDisplay.innerHTML = `<h3>Current Conditions for ${data.city.name}</h3>`;
        const current = data.list[0];
        currentWeatherDisplay.innerHTML += `
            <p>Temperature: ${current.main.temp}°C</p>
            <p>Weather: ${current.weather[0].description}</p>
            <p>Humidity: ${current.main.humidity}%</p>
            <p>Wind Speed: ${current.wind.speed} m/s</p>
        `;
    }

    function displayForecast(data) {
        forecastDisplay.innerHTML = '<h3>5-Day Forecast</h3>';
        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) {
                forecastDisplay.innerHTML += `
                    <div class="forecast-day">
                        <h4>${new Date(forecast.dt_txt).toDateString()}</h4>
                        <p>Temp: ${forecast.main.temp}°C</p>
                        <p>${forecast.weather[0].main}</p>
                    </div>
                `;
            }
        });
    }

    function saveSearchHistory(city) {
        let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searches.includes(city)) {
            searches.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searches));
        }
    }

    function displaySearchHistory() {
        let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryList.innerHTML = '';
        searches.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => {
                fetchWeatherForecast(city);
                // move the input field to the clicked city
                document.getElementById('cityInput').value = city;
            });
            searchHistoryList.appendChild(li);
        });
    }
    
    displaySearchHistory();
});
