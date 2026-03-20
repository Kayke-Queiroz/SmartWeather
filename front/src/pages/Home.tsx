import { useState } from 'react';
import WeatherMap from '../components/WeatherMap';
import CurrentWeather from '../components/CurrentWeather';
import ForecastList from '../components/ForecastList';
import { weatherApi } from '../services/api';
import type { WeatherData, ForecastData } from '../services/api';
import { strapiApi } from '../services/strapiApi';
import { generateWeatherInsight } from '../services/aiApi';
import SearchHistory from '../components/SearchHistory';
import { Search, Sparkles } from 'lucide-react';

export default function Home() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [insight, setInsight] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [refreshHistory, setRefreshHistory] = useState(0);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');

        try {
            const weatherData = await weatherApi.getCurrentWeather(query);
            const forecastData = await weatherApi.getForecast(query);

            setWeather(weatherData);
            setForecast(forecastData);

            // Fetch AI Insight gracefully (doesn't block the UI rendering)
            generateWeatherInsight(weatherData.name, Math.round(weatherData.main.temp), weatherData.weather[0].description)
                .then(aiTip => setInsight(aiTip));

            // Async save to Strapi without blocking the UI
            strapiApi.saveRecord(weatherData.name, weatherData).then(() => {
                setRefreshHistory(prev => prev + 1); // Trigger history subcomponent to refresh
            });

        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {!weather && (
                <div className="flex flex-col items-center text-center space-y-4 pt-10">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Weather Forecast
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Enter a location to get real-time weather conditions, a 5-day forecast, and AI-powered insights for your day.
                    </p>
                </div>
            )}

            {/* Dynamic Search Bar */}
            <div className={`max-w-xl mx-auto w-full transition-all duration-500 ${weather ? 'pt-2' : ''}`}>
                <form onSubmit={handleSearch} className="relative flex items-center border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a city, zip code or landmark..."
                        className="w-full py-4 pl-6 pr-24 bg-transparent outline-none rounded-l-2xl text-slate-700 placeholder:text-slate-400 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <span className="animate-pulse">Loading...</span> : <><Search className="w-4 h-4" /> Search</>}
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mt-3 font-medium text-center">{error}</p>}
            </div>

            {/* Render Dynamic Weather Results */}
            {weather && forecast && (
                <div className="max-w-4xl mx-auto w-full pt-6 space-y-6 animate-in slide-in-from-bottom-6 fade-in duration-700">

                    {insight && (
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in duration-500">
                            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 mb-1">AI Daily Insight</h4>
                                <p className="text-indigo-800 text-md">{insight}</p>
                            </div>
                        </div>
                    )}

                    <CurrentWeather data={weather} />
                    <ForecastList data={forecast} />

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                            📍 Location Map
                        </h3>
                        <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} locationName={weather.name} />
                    </div>
                </div>
            )}

            <SearchHistory refreshTrigger={refreshHistory} />
        </div>
    );
}
