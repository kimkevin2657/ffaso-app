import axios from 'axios';

// axios.defaults.baseURL = 'https://www.ffasoapi.com/v1/';
axios.defaults.baseURL = 'https://www.ffasoapi.com/v1/';

if (process.env.NODE_DEV === 'production') {
  axios.defaults.baseURL = 'https://www.ffasoapi.com/v1/';
}

const api = axios.create({
  baseURL: axios.defaults.baseURL,
  withCredentials: true,
});

export default api;
