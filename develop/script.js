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


// //function to get current date
// function getCurrentDate() {
//   const currentDate = dayjs().format("dddd, MMMM D, YYYY");
//   return currentDate;
// }
// // display current date
// currentDateEl.textContent = getCurrentDate();


formEl.addEventListener('submit', handleFormSubmit);
// historyListEl.addEventListener('click', handleHistoryItemClick);

// Function to handle form submit
async function handleFormSubmit(event) {
  event.preventDefault();

  // Get the city name from the input
  const cityName = cityInputEl.value.trim();

  if (cityName) {
    // Clear the input
    cityInputEl.value = '';

    // Get the current weather and forecast for the city
    const location = await getCurrentWeather(cityName);
    const forecast = await getForecast(location);
    displayForecast(forecast);

    // Add the city to the search history
    addCityToHistory(cityName);
  }
}
async function getCurrentWeather(cityName) {
	//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
 const response = await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' +
			cityName +
			'&appid=' + 
			weatherApiKey)
        const jsonData = await response.json();
        console.log(jsonData);
        return jsonData[0];
        // fetch(weatherApiRootUrl +
        // `/data/2.5//forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`)
        // .then(forecast => {
        //   console.log(forecast);
        // })
    
	// var jsonResponse1 = await response1.json();
	// console.log(jsonResponse1);

	// var lat = jsonResponse1[0].lat;
	// var lon = jsonResponse1[0].lon;

	// var response2 = await fetch(
		
	// );
	// var jsonResponse2 = await response2.json();
	// console.log(jsonResponse2);
}
async function getForecast (location) {
   const response = await fetch(weatherApiRootUrl +
        `/data/2.5//forecast?lat=${location.lat}&lon=${location.lon}&appid=${weatherApiKey}`)
        const jsonData = await response.json();
        console.log(jsonData)

        return jsonData
  
}
// let forecastArea = document.createElement('div');
// let 

function displayForecast(forecast) {
  // Update the city name
  cityNameEl.textContent = forecast.city.name;
  // Get the current weather data
  const currentWeather = forecast.list[0].main;
  // Update the temperature
  const temperature = currentWeather.temp;
  temperatureEl.textContent = `Temperature: ${temperature}°C`;
  // Update the humidity
  const humidity = currentWeather.humidity;
  humidityEl.textContent = `Humidity: ${humidity}%`;
  // Get the wind data
  const wind = forecast.list[0].wind;
  // Update the wind speed
  const windSpeed = wind.speed;
  windSpeedEl.textContent = `Wind Speed: ${windSpeed} m/s`;
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
  // Retrieve the search history from local storage
  const storedHistory = localStorage.getItem('searchHistory');
  // Parse the stored history as an array or use an empty array if it doesn't exist
  const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];

  history = parsedHistory;

  // adds items from history array to list
  history.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    listItem.classList.add('history-item');
    historyListEl.appendChild(listItem);
  });
}

// Loads search history
history = JSON.parse(localStorage.getItem('searchHistory')) || [];

renderSearchHistory();







{/* <div id="current-weather">
      <h2 id="city-name"></h2>
      <h3 id="current-date"></h3>
      <img id="weather-icon" src="" alt="Weather Icon">
      <p id="temperature"></p>
      <p id="humidity"></p>
      <p id="wind-speed"></p>
    </div>
    
    <div id="forecast">
      <h2>5-Day Forecast</h2>
      <ul id="forecast-list"></ul>
    </div>
    
    <div id="search-history">
      <h3>Search History</h3>
      <ul id="history-list"></ul>
    </div> */}