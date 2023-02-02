import axios from 'axios';

const apiv3 = axios.create({
  baseURL: 'https://www.ffasoapi.com/v3/',
  withCredentials: true,

  headers: { 'Content-Type': 'application/json' },
});

export default apiv3;
