import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://api.weatherapi.com/v1'
});

export const local = axios.create({
    baseURL: 'https://nominatim.openstreetmap.org'
});
