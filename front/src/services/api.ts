import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
    name: string;
    sys: { country: string };
    main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number };
    weather: [{ id: number; main: string; description: string; icon: string }];
    wind: { speed: number };
    coord: { lat: number; lon: number };
}

export interface ForecastData {
    city: { name: string; coord: { lat: number; lon: number } };
    list: Array<{
        dt: number;
        main: { temp: number; temp_min: number; temp_max: number; humidity: number };
        weather: [{ id: number; main: string; description: string; icon: string }];
        wind: { speed: number };
        dt_txt: string;
        pop: number;
    }>;
}

// No mock data - errors should be handled by the UI

export const weatherApi = {
    async getCurrentWeather(query: string | { lat: number; lon: number }): Promise<WeatherData> {
        const params: Record<string, string | number> = { appid: OPENWEATHER_API_KEY, units: 'metric' };
        if (typeof query === 'string') {
            params.q = query;
        } else {
            params.lat = query.lat;
            params.lon = query.lon;
        }
        const response = await axios.get(`${BASE_URL}/weather`, { params });
        return response.data;
    },

    async getForecast(query: string | { lat: number; lon: number }): Promise<ForecastData> {
        const params: Record<string, string | number> = { appid: OPENWEATHER_API_KEY, units: 'metric' };
        if (typeof query === 'string') {
            params.q = query;
        } else {
            params.lat = query.lat;
            params.lon = query.lon;
        }
        const response = await axios.get(`${BASE_URL}/forecast`, { params });
        return response.data;
    }
};
