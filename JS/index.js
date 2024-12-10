document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weatherForm');
    const locationInput = document.getElementById('locationInput');
    const weatherDisplay = document.getElementById('weatherDisplay');

    const apiKey = '35ee33e2e00245058f6174228240912';

    async function fetchAndDisplayWeather(location) {
        const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${location}`;
        try {
            const searchResponse = await fetch(searchUrl);
            const searchResults = await searchResponse.json();

            if (searchResults.length === 0) {
                alert('No matching location found.');
                return;
            }

            const selectedCity = searchResults[0];
            const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedCity.name}&days=3`;

            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            displayWeather(forecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
        }
    }

    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = locationInput.value.trim() || 'Cairo'; 
        fetchAndDisplayWeather(location);
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options); 
    }

    function displayWeather(data) {
        const forecastDays = data.forecast.forecastday;
        let htmlContent = '';
    
        const conditionIcons = {
            "partly cloudy": "https://cdn.weatherapi.com/weather/64x64/day/116.png",
            "cloudy": "https://cdn.weatherapi.com/weather/64x64/day/119.png",
            "overcast": "https://cdn.weatherapi.com/weather/64x64/day/122.png",
            "rain": "https://cdn.weatherapi.com/weather/64x64/day/308.png",
            "showers": "https://cdn.weatherapi.com/weather/64x64/day/353.png",
            "thunderstorm": "https://cdn.weatherapi.com/weather/64x64/day/200.png",
            "snow": "https://cdn.weatherapi.com/weather/64x64/day/326.png",
            "clear": "https://cdn.weatherapi.com/weather/64x64/day/113.png",
            "mist": "https://cdn.weatherapi.com/weather/64x64/day/143.png",
            "fog": "https://cdn.weatherapi.com/weather/64x64/day/143.png",
            "blizzard": "https://cdn.weatherapi.com/weather/64x64/day/327.png",
            "hail": "https://cdn.weatherapi.com/weather/64x64/day/350.png",
            "patchy rain nearby": "https://cdn.weatherapi.com/weather/64x64/day/308.png",
            "patchy light rain": "https://cdn.weatherapi.com/weather/64x64/day/308.png",
            "light rain": "https://cdn.weatherapi.com/weather/64x64/day/308.png",
            "moderate rain at times": "https://cdn.weatherapi.com/weather/64x64/day/308.png",
            "heavy rain": "https://cdn.weatherapi.com/weather/64x64/day/308.png",
            "thunderstorms with heavy rain": "https://cdn.weatherapi.com/weather/64x64/day/200.png",
            "thunderstorms with light rain": "https://cdn.weatherapi.com/weather/64x64/day/200.png"
        };
    
        forecastDays.forEach((day, index) => {
            const formattedDate = formatDate(day.date);
            const headerClass = `header${index + 1}`;
            const bodyClass = `body${index + 1}`;
            const conditionText = day.day.condition.text.toLowerCase().replace(/\s+/g, ' ').trim();
            const conditionImage = conditionIcons[conditionText] || "https://cdn.weatherapi.com/weather/64x64/day/113.png";
    
            
            if (index === 0) {
                htmlContent += `
                    <div class="col-lg-4 col-md-12 bg-transparent">
                        <div class="${headerClass} d-flex justify-content-center">
                            <p class="py-2 ps-2 text-center">${formattedDate}</p>
                        </div>
                        <div class="${bodyClass} text-center">
                            <h3>${data.location.name}</h3><br>
                            <img src="${conditionImage}" alt="${conditionText}"><br><br>
                            <h2>${day.day.avgtemp_c}°C</h2><br>
                            <p> ${day.day.mintemp_c}°C </p><br>
                            <span>${conditionText}</span>
                        </div>
                        
                    </div>
                `;
            } else {
                htmlContent += `
                    <div class="col-lg-4 col-md-12 bg-transparent">
                        <div class="${headerClass} d-flex justify-content-center">
                            <p class="py-2 ps-2 text-center">${formattedDate}</p>
                        </div>
                        <div class="${bodyClass} text-center">
                            <img src="${conditionImage}" alt="${conditionText}"><br><br>
                            <h2>${day.day.avgtemp_c}°C</h2><br>
                            <p> ${day.day.mintemp_c}°C </p><br>
                            <span>${conditionText}</span>
                        </div>
                    </div>
                `;
            }
        });
    
        weatherDisplay.querySelector('.row').innerHTML = htmlContent;
    }
    

    fetchAndDisplayWeather('Cairo');
});
