import axios from "axios";
export function getWeather(lat, lon, timezone) {
    return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timeformat=unixtime",
    { 
        params: {
            latitude: lat,
            longitude: lon,
            timezone,
    },
    })
    .then(({ data}) => {
        console.log(data);
        return {
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data)
        }
    })
}




function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            minTemp: Math.round(daily.temperature_2m_min[index]),
        }
    })
}

function parseHourlyWeather( { hourly, current_weather }) {
    return hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: Math.round(hourly.weathercode[index]),
            temp: Math.round(hourly.temperature_2m[index]),
        }
    }).filter(({ timestamp }) => timestamp >= current_weather.time * 1000)
}
