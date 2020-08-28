import axios from "axios";
import { toast } from "react-toastify";
/*
 * The interceptors handles client side errors
 * */
axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) toast("An unexpected error occurred.");
  return Promise.reject(error);
});

function getStoreURL() {
  return `http://localhost:8080/stores`;
}

function getWeatherURL(lat, lng) {
  return `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly&lang=se&units=metric&appid=25f4530d6bd98eb444ce6b94f8db1ef8`;
}

function getTrafficInformationURL(lat, lng) {
  return `https://api.resrobot.se/v2/location.nearbystops?key=c4b5de66-b9c7-471f-86cc-289685544c58&originCoordLat=${lat}&originCoordLong=${lng}&format=json`;
}

function getDepartureDataURL(id) {
  return `https://api.resrobot.se/v2/departureBoard?key=6e22f881-8d86-4669-8c8d-3eddc81c36c9&id=${id}&maxJourneys=5&format=json`;
}

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

/*
 * This script is used to import axios methods in a 'prettier' way
 * */
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  getStoreURL: getStoreURL,
  getWeatherURL: getWeatherURL,
  getTrafficURL: getTrafficInformationURL,
  getDepartureURL: getDepartureDataURL,
  setJwt,
};
