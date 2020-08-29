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
  return `https://store-inspicio.herokuapp.com/stores`;
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
  setJwt,
};
