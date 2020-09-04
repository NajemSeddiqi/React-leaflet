import http from "./httpService";

export function getWeather(lat, lng) {
  return http.get(apiEndPoint(lat, lng));
}

function apiEndPoint(lat, lng) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly&lang=se&units=metric&appid=25f4530d6bd98eb444ce6b94f8db1ef8`;
}
