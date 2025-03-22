const apiKey = "24bb5a06aa021aa444c29033cfedda71";  

async function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        document.getElementById("loadingSpinner").classList.remove("hidden");

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        updateWeatherUI(data);
        fetchHourlyForecast(city);
        fetchPastWeather(city);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Unable to fetch weather. Try again!");
    } finally {
        document.getElementById("loadingSpinner").classList.add("hidden");
    }
}

function updateWeatherUI(data) {
    document.getElementById("location").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById("description").innerText = `Weather: ${data.weather[0].description}`;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind Speed: ${data.wind.speed} m/s`;

    updateBackgroundAndIcons(data.weather[0].main.toLowerCase());
}

function updateBackgroundAndIcons(weather) {
    let bgPath, iconHighlight;

    if (weather.includes("rain")) {
        bgPath = "assets/rainy.png";
        iconHighlight = "rainyIcon";
    } else if (weather.includes("clear")) {
        bgPath = "assets/sunny.png";
        iconHighlight = "sunnyIcon";
    } else if (weather.includes("wind")) {
        bgPath = "assets/windy.png";
        iconHighlight = "windyIcon";
    } else if (weather.includes("snow")) {
        bgPath = "assets/snowy.png";
        iconHighlight = "snowyIcon";
    } else if (weather.includes("thunderstorm")) {
        bgPath = "assets/thunderstorm.png";
        iconHighlight = "thunderstormIcon";
    } else if (weather.includes("haze")) {
        bgPath = "assets/haze.png";
        iconHighlight = "hazeIcon";
    } else if (weather.includes("cloud")) {  
        bgPath = "assets/cloudy.png";  // New addition for cloudy weather
        iconHighlight = "cloudyIcon";
    } else {
        bgPath = "assets/background.jpg";  // Default background image for unknown conditions
        iconHighlight = ""; // No icon highlighted in default case
    }

    // Change background image dynamically
    document.body.style.backgroundImage = `url('${bgPath}')`;

    // Remove 'active' class from all icons
    document.querySelectorAll(".weather-icons img").forEach(img => img.classList.remove("active"));

    // Highlight the correct weather icon (if applicable)
    if (iconHighlight) {
        const activeIcon = document.getElementById(iconHighlight);
        if (activeIcon) {
            activeIcon.classList.add("active");
        }
    }
}




document.getElementById("searchBtn").addEventListener("click", function () {
    const city = document.getElementById("cityInput").value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name!");
    }
});

async function fetchHourlyForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error fetching hourly data");

        const data = await response.json();
        displayHourlyForecast(data.list);
    } catch (error) {
        console.error("Hourly Forecast Error:", error);
    }
}

function displayHourlyForecast(hourlyData) {
    let hourlyHTML = "";
    for (let i = 0; i < 8; i++) {
        let hour = new Date(hourlyData[i].dt * 1000).getHours();
        let temp = hourlyData[i].main.temp;
        let desc = hourlyData[i].weather[0].description;
        hourlyHTML += `<p>${hour}:00 - ${temp}°C, ${desc}</p>`;
    }
    document.getElementById("hourlyForecast").innerHTML = hourlyHTML;
}

async function fetchPastWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error fetching past weather");

        const data = await response.json();
        generateWeatherChart(data.list);
    } catch (error) {
        console.error("Past Weather Error:", error);
    }
}

function generateWeatherChart(weatherData) {
    const labels = weatherData.map(entry => new Date(entry.dt * 1000).toLocaleDateString());
    const temperatures = weatherData.map(entry => entry.main.temp);

    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Temperature (°C)', data: temperatures, borderColor: 'orange', fill: false }] },
        options: { responsive: true }
    });
}
