const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = '2a71c1cc7bf4c204aef0d51a70c0a25e';

let history = [];
const formEl = document.querySelector('form');
const cityInputEl = document.querySelector('input[type="text"]');
const searchButtonEl = document.querySelector('button[type="submit"]');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');
const historyEl = document.querySelector('#search-history');
const historyListEl = document.querySelector('#history-list');
const currentDateEl = document.querySelector('#current-date');
const cityNameEl = document.querySelector('#city-name');
const temperatureEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windSpeedEl = document.querySelector('#wind-speed');
const forecastListEl = document.querySelector('#forecast-list');


// gets the current date using dayjs
function getCurrentDate() {
  const currentDate = dayjs().format("dddd, MMMM D, YYYY");
  return currentDate;
}

// display current date
currentDateEl.textContent = getCurrentDate();

// event listener for submit to run handleFormSubmit
formEl.addEventListener('submit', handleFormSubmit);

// handleFormSubmit function
async function handleFormSubmit(event) {
  event.preventDefault();

  // get the city name from the input
  const cityName = cityInputEl.value.trim();

  if (cityName) {
    // clear the input
    cityInputEl.value = '';

    // get the current weather and forecast for the city
    const location = await getCurrentWeather(cityName);
    const forecast = await getForecast(location);
    displayForecast(forecast);

    // add the city to the search history
    addCityToHistory(cityName);
  }
}

// retrieves current weather based on the cityName input
async function getCurrentWeather(cityName) {
	//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
 const response = await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' +
			cityName +
			'&appid=' + 
			weatherApiKey)
        const jsonData = await response.json();
        console.log(jsonData);
        return jsonData[0];
}

// getForecast function
async function getForecast (location) {
   const response = await fetch(weatherApiRootUrl +
        `/data/2.5//forecast?lat=${location.lat}&lon=${location.lon}&appid=${weatherApiKey}`)
        const jsonData = await response.json();
        console.log(jsonData)

        return jsonData
  
}

function displayForecast(forecast) {
  // get the city name
  cityNameEl.textContent = forecast.city.name;
  // get the current weather data
  const currentWeather = forecast.list[0].main;
  // get the temperature
  const temperature = currentWeather.temp;
  temperatureEl.textContent = `Temperature: ${temperature}°C`;
  // get the humidity
  const humidity = currentWeather.humidity;
  humidityEl.textContent = `Humidity: ${humidity}%`;
  // get the wind data
  const wind = forecast.list[0].wind;
  // updated the wind speed
  const windSpeed = wind.speed;
  windSpeedEl.textContent = `Wind Speed: ${windSpeed} m/s`;

// gets 5 day for forecast via for-loop and creating new element for each list item
  forecastListEl.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const forecastItem = forecast.list[i];
    const date = new Date(forecastItem.dt * 1000);
    const temperature = forecastItem.main.temp;
    const weatherDescription = forecastItem.weather[0].description;

    const listItem = document.createElement('li');
    listItem.textContent = `${date.toDateString()}: ${weatherDescription}, Temperature: ${temperature}°C`;
    listItem.classList.add('forecast-item');
    forecastListEl.appendChild(listItem);
  }
}

     
function addCityToHistory(city) {
  // adds city to history array
  history.unshift(city);
  // limits history array to 10
  if (history.length > 10) {
    history.pop();
  }
  localStorage.setItem('searchHistory', JSON.stringify(history));
  renderSearchHistory();
}


function renderSearchHistory() {
  historyListEl.innerHTML = '';
  // get search history from local storage
  const storedHistory = localStorage.getItem('searchHistory');
  // prase the stored history as an array or use an empty array if it doesn't exist
  const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];

  history = parsedHistory;

  // adds items from history array to list and creates new element for each item
  history.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    listItem.classList.add('history-item');
    historyListEl.appendChild(listItem);
  });
}

// loads search history
history = JSON.parse(localStorage.getItem('searchHistory')) || [];

renderSearchHistory();
