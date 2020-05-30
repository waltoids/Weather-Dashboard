const searchBar = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const cityHistory = document.getElementById("city-history");
const weatherCurretn = document.getElementById("current-weather");
const forecastRow = document.getElementById("forecast-row");

const APIKEY = '44f2606e3cb5ec89a96624d7cd8621dc';

/* QueryURLs */
const weatherQuery = (city, apikey) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;
const forecastQuery = (city, apikey) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`;
const uvIndexQuery = (lat, lon, apikey) => `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`;
const weatherIconQuery = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}.png`;

let cityList = JSON.parse(localStorage.getItem('city')) || [];


/* search button */
searchBtn.addEventListener('click', function() {
    const search = searchBar.value;

    cityList.push(search)

    localStorage.setItem('city', JSON.stringify(cityList));

    updateWeather(search);
    updateForecast(search);
    updateCityList();
})
/* clear function */
function clear(el) {
    [...el.childNodes].forEach(function (element) {
        element.remove();
    });
}

/* fetching data from queries */
function fetchWeatherData(city){
    return fetch(weatherQuery(city, APIKEY)).then((response) => response.json());
};

function fetchForecastData(city){
    return fetch(forecastQuery(city, APIKEY)).then((response) => response.json());
};

function fetchUvIndexData(lat, lon){
    return fetch(uvIndexQuery(lat, lon, APIKEY)).then((response) => response.json());
};

/* function to convert kelvin to farhrenheit */
function convertKelvin(kelvin) {
    return (((kelvin - 273.15) *9) / 5 + 32).toFixed(2);
};

/* update the weather status when user inputs a city */
function updateWeather(search) {
    const weatherHeader = document.getElementById("weather-header");
    const statusWeather = document.getElementById("status-weather");
    const temperature = document.getElementById("weather-text-temp");
    const humidity = document.getElementById("weather-text-humidity");
    const windSpeed = document.getElementById("weather-text-wind");
    const uvIndex = document.getElementById("weather-text-uv");

    fetchWeatherData(search).then((data) => {
        const date = new Intl.DateTimeFormat('en-US').format(new Date(data.dt * 1000),);
        weatherHeader.textContent = `Today in ${data.name}: `;
        statusWeather.setAttribute("src", weatherIconQuery(data.weather[0].icon));
        temperature.textContent = `${convertKelvin(data.main.temp)} degrees fahrenheit`;
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = data.wind.speed;
        fetchUvIndexData(data.coord.lat, data.coord.lon).then((data) => {
            uvIndex.textContent = data.value;
        });
    });    
}
/* update forecast when user enters a city */
function updateForecast(search) {
    fetchForecastData(search).then((data) => {

        clear(forecastRow);

        const forecastArray = data.list;

        for (let i=4; i < forecastArray.length; i+=8) {
            const col = document.createElement("div");
            const card = document.createElement("div");
            const cardHeader = document.createElement("header");
            const cardTitle = document.createElement("h3");
            const forecastIcon = document.createElement("img");
            const cardBody = document.createElement("div");
            const cardParagraph = document.createElement("p");
            const cardTemp = document.createElement("p");
            const cardHumid = document.createElement("p");
            
            const date = new Intl.DateTimeFormat("en-US").format( new Date(forecastArray[i].dt * 1000),);

            cardTitle.textContent = date;
            forecastIcon.setAttribute("src", weatherIconQuery(forecastArray[i].weather[0].icon),);

            col.classList= 'col';
            card.classList= 'card text-white bg-primary';
            cardHeader.classList= 'card-header';
            cardTitle.classList= 'card-title';
            forecastIcon.setAttribute('id', 'forecast-icon');
            cardBody.classList= 'card-body';
            cardParagraph.classList= 'card-text'
            cardTemp.textContent= `Temp ${convertKelvin(forecastArray[i].main.temp)} degrees fahrenheit`;
            cardHumid.textContent= `Humidity: ${forecastArray[i].main.humidity}%`;

            cardParagraph.appendChild(cardTemp).appendChild(cardHumid);
            cardHeader.append(cardTitle);
            cardHeader.append(forecastIcon);
            cardBody.append(cardParagraph);
            card.append(cardHeader);
            card.append(cardBody);
            col.append(card);
            forecastRow.appendChild(col);
        }
    });
}
/* updates list of cities user puts in */
function updateCityList() {
    clear(cityHistory)

    cityList.forEach((city) => {
        const cityBtn = document.createElement("button");
        cityBtn.textContent = city;
        cityBtn.classList= 'list-group-item list-group-item-action';
        cityBtn.setAttribute('data-value', city);
        cityBtn.addEventListener("click", function() {
            updateWeather(city);
            updateForecast(city);
        });
    cityHistory.appendChild(cityBtn);    
    })
}