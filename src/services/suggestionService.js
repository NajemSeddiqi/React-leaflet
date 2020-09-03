import http from "./httpService";
import { apiUrl } from "./config";

const apiEndPoint = apiUrl + "/suggestion";

export function add(suggestion) {
  const body = { ...suggestion };
  return http.post(apiEndPoint, body);
}
