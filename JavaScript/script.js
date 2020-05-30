const searchBarEl = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const cityHistory = document.getElementById("city-history");
const weatherCurretn = document.getElementById("current-weather");
const forecastRow = document.getElementById("forecast-row");

const APIKEY = '44f2606e3cb5ec89a96624d7cd8621dc';

/* QueryURLs */
const weatherQuery = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;
const forecastQuery = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`;
const uvIndexQuery = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat={lat}&lon={lon}`;
const weatherIconQuery = `https/openweathermap.org/img/wn/${iconCode}.png`;