import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api.weatherapi.com/v1'
});

export default api;