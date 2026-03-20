import { useState } from 'react';
import WeatherMap from '../components/WeatherMap';
import CurrentWeather from '../components/CurrentWeather';
import ForecastList from '../components/ForecastList';
import { weatherApi } from '../services/api';
import type { WeatherData, ForecastData } from '../services/api';
import { strapiApi } from '../services/strapiApi';
import { generateWeatherInsight, type AIInsight } from '../services/aiApi';
import { youtubeApi, type YoutubeVideo } from '../services/youtubeApi';
import SearchHistory from '../components/SearchHistory';
import { Search, Sparkles, Shirt, Activity, Lightbulb } from 'lucide-react';

export default function Home() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [insight, setInsight] = useState<AIInsight | string | null>(null);
    const [video, setVideo] = useState<YoutubeVideo | null | 'not_found'>(null);
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
            generateWeatherInsight(weatherData).then(aiTip => setInsight(aiTip));

            // Fetch YouTube video gracefully
            youtubeApi.getVideoForLocation(weatherData.name).then(v => setVideo(v || 'not_found'));

            // Async save to Strapi without blocking the UI
            strapiApi.saveRecord(weatherData.name, weatherData).then(() => {
                setRefreshHistory(prev => prev + 1); // Trigger history subcomponent to refresh
            });

        } catch (err: any) {
            setError(err?.response?.status === 404 ? 'Location not found.' : 'Failed to fetch weather data. Please try again.');
            setWeather(null);
            setForecast(null);
            setInsight(null);
            setVideo(null);
        } finally {
            setLoading(false);
        }
    };

    const handleMapClick = async (lat: number, lon: number) => {
        setLoading(true);
        setError('');

        try {
            const weatherData = await weatherApi.getCurrentWeather({ lat, lon });
            const forecastData = await weatherApi.getForecast({ lat, lon });

            setQuery(weatherData.name);
            setWeather(weatherData);
            setForecast(forecastData);

            generateWeatherInsight(weatherData).then(aiTip => setInsight(aiTip));
            youtubeApi.getVideoForLocation(weatherData.name).then(v => setVideo(v || 'not_found'));

            strapiApi.saveRecord(weatherData.name, weatherData).then(() => {
                setRefreshHistory(prev => prev + 1);
            });

        } catch (err: any) {
            setError(err?.response?.status === 404 ? 'Location not found.' : 'Failed to fetch weather data for this location. Please try again.');
            setWeather(null);
            setForecast(null);
            setInsight(null);
            setVideo(null);
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
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-2xl shadow-sm animate-in fade-in duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-indigo-900 text-lg">AI Daily Insight</h4>
                            </div>

                            {typeof insight === 'string' ? (
                                <p className="text-indigo-800 text-md pl-12">{insight}</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/60 p-4 rounded-xl border border-indigo-50/50 hover:bg-white/80 transition-colors">
                                        <p className="text-indigo-900 font-bold mb-1 flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-indigo-500"/> SUMMARY</p>
                                        <p className="text-slate-700 text-sm leading-relaxed">{insight.summary}</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-xl border border-indigo-50/50 hover:bg-white/80 transition-colors">
                                        <p className="text-indigo-900 font-bold mb-1 flex items-center gap-2 text-sm"><Shirt className="w-4 h-4 text-indigo-500"/> CLOTHING</p>
                                        <p className="text-slate-700 text-sm leading-relaxed">{insight.clothing}</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-xl border border-indigo-50/50 hover:bg-white/80 transition-colors">
                                        <p className="text-indigo-900 font-bold mb-1 flex items-center gap-2 text-sm"><Activity className="w-4 h-4 text-indigo-500"/> ACTIVITY</p>
                                        <p className="text-slate-700 text-sm leading-relaxed">{insight.activity}</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-xl border border-indigo-50/50 hover:bg-white/80 transition-colors">
                                        <p className="text-indigo-900 font-bold mb-1 flex items-center gap-2 text-sm"><Lightbulb className="w-4 h-4 text-yellow-500"/> HEADS-UP</p>
                                        <p className="text-slate-700 text-sm leading-relaxed">{insight.heads_up}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <CurrentWeather 
                        data={weather} 
                        chanceOfRain={forecast.list[0]?.pop !== undefined ? Math.round(forecast.list[0].pop * 100) : 0} 
                    />
                    <ForecastList data={forecast} />

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                            📍 Location Map <span className="text-sm font-medium text-slate-500 ml-auto bg-slate-100 px-3 py-1 rounded-full">Click anywhere to search</span>
                        </h3>
                        <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} locationName={weather.name} onMapClick={handleMapClick} />
                    </div>

                    {video === 'not_found' ? (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                                🎬 Explore {weather.name}
                            </h3>
                            <p className="text-slate-500 text-center py-6 bg-slate-50 rounded-2xl font-medium">Video not found for this location.</p>
                        </div>
                    ) : video && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                                🎬 Explore {weather.name}
                            </h3>
                            <div className="relative w-full overflow-hidden pt-[56.25%] rounded-2xl bg-slate-100 shadow-inner">
                                <iframe 
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0&modestbranding=1`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <SearchHistory refreshTrigger={refreshHistory} />
        </div>
    );
}
