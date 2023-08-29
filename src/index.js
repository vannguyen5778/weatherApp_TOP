import { ICON_MAP, AIR_QUALITY_MAP } from "./iconMap";
import { getWeather } from "./weather";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
        getAirQuality(coords.latitude, coords.longitude);
        getWeather(coords.latitude, 
                    coords.longitude, 
                     Intl.DateTimeFormat().resolvedOptions().timeZone)
        .then(res => renderWeather(res))
        .then(checkWeather("Hanoi"))
        .catch(e => {
            console.log(e);
        })    
        document.body.classList.remove("blurred");

}

function positionError() {
    alert('There was an error getting your location. Please allow us to use your location and refresh the page.')
}

function getIconUrl(weatherCode) {
    return `images/${weatherCode}.png`;
}

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value;
}

const apiKey = "e9ebe848cb36185752030a03860fa705";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


function renderWeather( { daily, hourly }) {
    renderDailyWeather(daily);
    renderHourlyWeather(hourly);
    document.body.classList.remove("blurred");
}

const searchBox = document.querySelector(".search-bar");
const currentWeatherIcon = document.querySelector(".current-weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status == 404) {
        document.querySelector('.error').style.display = "block";
    } else {
        let data = await response.json();
        setValue("city", data.name);
        setValue('current-temp', Math.round(data.main.temp));
        setValue('current-humidity', data.main.humidity);
        setValue('current-wind', data.wind.speed);
        setValue('current-rf', Math.round(data.main.feels_like));
        currentWeatherIcon.src = getIconUrl(data.weather[0].main.toLowerCase())
        document.querySelector('.error').style.display = "none";
        return [data.coord.lat, data.coord.lon];
    }  
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


async function getAirQuality(lat, lon) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let data = await response.json();
    setValue("current-air-quality", AIR_QUALITY_MAP.get(data.list[0].main.aqi));
}

const dailySection = document.querySelector('[data-day-section');
const dayCardTemplate = document.getElementById("day-card-template");
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "short" });
function renderDailyWeather(daily) {
    dailySection.innerHTML = "";
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true);
        setValue("high-temp", day.maxTemp, { parent: element });
        setValue("low-temp", day.minTemp, { parent: element });
        setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
        setValue("desc", capitalize(ICON_MAP.get(day.iconCode)), { parent: element });
        element.querySelector("[data-icon]").src = getIconUrl(ICON_MAP.get(day.iconCode));
        dailySection.append(element);
    })
}

function convertTimestamp(time) {
    return new Date(time).toLocaleString('en-US', { hour: 'numeric', hour12: true });
}
const hourlySection = document.querySelector('[data-hour-section]');
const hourCardTemplate = document.getElementById("hour-card-template");
function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = "";
    hourly.slice(0, 6).forEach(hour => {
        const element = hourCardTemplate.content.cloneNode(true);
        setValue("hour", convertTimestamp(hour.timestamp), { parent: element });
        setValue("temp", hour.temp, { parent: element });
        element.querySelector("[data-icon]").src = getIconUrl(ICON_MAP.get(hour.iconCode));
        hourlySection.append(element);

    })
}

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value)
        .then((values) => {
            let lat = values[0];
            let lon = values[1];
            getAirQuality(lat, lon);
            getWeather(lat, lon, Intl.DateTimeFormat().resolvedOptions().timeZone).then(res => renderWeather(res));
        })
        .catch(e => {
            console.log(e);
        })
    }})