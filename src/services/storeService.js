import http from "./httpService";
import { apiUrl } from "./config";

const apiEndPoint = apiUrl + "/stores";

function storeUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getStores() {
  return http.get(apiEndPoint);
}

export function getStoreById(id) {
  return http.get(storeUrl(id));
}
