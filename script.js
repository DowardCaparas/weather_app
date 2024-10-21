const searchWeather = document.getElementById("searchWeather");
const toggleTemp = document.getElementById("toggle_temperature");

toggleTemp.classList.add("hidden");

let setTemperature = "celcius"; // Default to Celsius
let inputString = "";

async function getData(location) {
  const APIKey = "530cb8b796ad3abace7347cb8c33f7fd";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response error: ${response.status}`);
    }
    const data = await response.json();

    // Update the DOM when the data is ready

    const locationName = document.getElementById("location_name");
    locationName.textContent = `${data.name} ${data.sys.country}`; // City name or country

    const weather = document.getElementById("weather_main_info");

    // Weather status
    const iconCode = data.weather[0].icon; // Get the icon code
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Construct the icon URL
    const icon = document.createElement("img"); // Create an img element
    icon.src = iconUrl; // Set the src attribute
    icon.alt = `Weather icon for ${data.weather[0].main}`; // Set alt text for accessibility
    icon.classList.add("weather_icon");

    // Temperature in Celsius or Fahrenheit
    const temperature = document.createElement("span");
    temperature.classList.add("temperature_text");
    temperature.textContent = `${Math.round(getTemperature(data.main.temp))} °${
      setTemperature === "celcius" ? "C" : "F"
    }`;

    // Clear previous weather text and append new content
    weather.innerHTML = ""; // Clear previous content
    weather.appendChild(icon); // Append the icon
    weather.appendChild(temperature);

    toggleTemp.innerText = `Switch to ${
      setTemperature === "celcius" ? "Fahrenheit" : "Celcius"
    }`;

    const information = document.getElementById("information_text");

    // Create a list
    const list = document.createElement("ul");

    // Humidity
    const humidity = document.createElement("li");
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

    // Wind speed
    const windSpeed = document.createElement("li");
    windSpeed.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;

    // Sea and Ground level
    const seaLevel = document.createElement("li");
    seaLevel.textContent = `Sea level: ${data.main.sea_level} hPa`;

    information.innerHTML = "";
    list.appendChild(humidity);
    list.appendChild(windSpeed);
    list.appendChild(seaLevel);

    information.appendChild(list);
  } catch (error) {
    console.error(error.message);
  }
}

// Event Listener for Searching Weather Data
searchWeather.addEventListener("click", () => {
  toggleTemp.classList.remove("hidden");

  const userInput = document.getElementById("inputLocationName").value;
  inputString = userInput;
  userInput ? getData(userInput) : console.log("Please enter a location");

  document.getElementById("inputLocationName").value = "";
});

// Toggle button to switch temperature
toggleTemp.addEventListener("click", () => {
  setTemperature = setTemperature === "celcius" ? "fahrenheit" : "celcius";
  if (inputString !== "") {
    getData(inputString);
  }
});

// Convert temperature based on current unit setting
const getTemperature = (kelvinValue) => {
  return setTemperature === "celcius"
    ? kelvinValue - 273.15 // Convert Kelvin to Celsius
    : ((kelvinValue - 273.15) * 9) / 5 + 32; // Convert Kelvin to Fahrenheit
};