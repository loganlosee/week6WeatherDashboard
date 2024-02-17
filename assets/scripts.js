document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = document.getElementById('cityInput').value;
        fetchWeatherForecast(city);
    });

    function fetchWeatherForecast(city) {
        const apiKey = '626ef244207ceeff70adc1efc9a59708'; //api key
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayWeatherData(data);
            })
            .catch(error => {
                console.error('An error occurred:', error);
                alert('Failed to fetch weather data. Please check the city name and try again.');
            });
    }

    function displayWeatherData(data) {
        const weatherDiv = document.getElementById('weather');
        weatherDiv.innerHTML = ''; // Clear previous data

        const cityName = data.city.name;
        const country = data.city.country;
        weatherDiv.innerHTML += `<h2>Weather Forecast for ${cityName}, ${country}</h2>`;

        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) {
                const day = new Date(forecast.dt_txt).toDateString();
                const temp = forecast.main.temp;
                const conditions = forecast.weather[0].description;
                weatherDiv.innerHTML += `<p>${day}: ${temp}°C, ${conditions}</p>`;
            }
        });
    }
});
