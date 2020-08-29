import http from "./httpService";

export function getTraffic(lat, lng) {
  return http.get(trafficApiEndPoint(lat, lng));
}

export function getDepartures(id) {
  return http.get(departureApiEndPoint(id));
}

function trafficApiEndPoint(lat, lng) {
  return `https://api.resrobot.se/v2/location.nearbystops?key=c4b5de66-b9c7-471f-86cc-289685544c58&originCoordLat=${lat}&originCoordLong=${lng}&format=json`;
}

function departureApiEndPoint(id) {
  return `https://api.resrobot.se/v2/departureBoard?key=6e22f881-8d86-4669-8c8d-3eddc81c36c9&id=${id}&maxJourneys=5&format=json`;
}
