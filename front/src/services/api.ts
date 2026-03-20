import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
    name: string;
    sys: { country: string };
    main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number };
    weather: [{ main: string; description: string; icon: string }];
    wind: { speed: number };
    coord: { lat: number; lon: number };
}

export interface ForecastData {
    city: { name: string; coord: { lat: number; lon: number } };
    list: Array<{
        dt: number;
        main: { temp: number; temp_min: number; temp_max: number; humidity: number };
        weather: [{ main: string; description: string; icon: string }];
        wind: { speed: number };
        dt_txt: string;
    }>;
}

// Fallback Mock Data for when the API Key is not yet active (401 Error)
const mockWeatherData: WeatherData = {
    name: 'Mock City (API Key Pending)',
    sys: { country: 'BR' },
    main: { temp: 24.5, feels_like: 25.2, humidity: 65, pressure: 1012, temp_min: 22, temp_max: 27 },
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    wind: { speed: 4.1 },
    coord: { lat: -23.5505, lon: -46.6333 }
};

const mockForecastData: ForecastData = {
    city: { name: 'Mock City', coord: { lat: -23.5505, lon: -46.6333 } },
    list: Array.from({ length: 40 }).map((_, i) => ({
        dt: Date.now() / 1000 + i * 10800,
        main: { temp: 22 + Math.random() * 5, temp_min: 20, temp_max: 28, humidity: 60 },
        weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
        wind: { speed: 3.5 },
        dt_txt: new Date(Date.now() + i * 10800000).toISOString()
    }))
};

export const weatherApi = {
    async getCurrentWeather(query: string): Promise<WeatherData> {
        try {
            const response = await axios.get(`${BASE_URL}/weather`, {
                params: { q: query, appid: OPENWEATHER_API_KEY, units: 'metric' }
            });
            return response.data;
        } catch (error: any) {
            console.warn('Weather API Error (Fallback to Mock):', error.response?.data?.message || error.message);
            return { ...mockWeatherData, name: `${query} (Offline)` };
        }
    },

    async getForecast(query: string): Promise<ForecastData> {
        try {
            const response = await axios.get(`${BASE_URL}/forecast`, {
                params: { q: query, appid: OPENWEATHER_API_KEY, units: 'metric' }
            });
            return response.data;
        } catch (error: any) {
            console.warn('Forecast API Error (Fallback to Mock):', error.response?.data?.message || error.message);
            return mockForecastData;
        }
    }
};
