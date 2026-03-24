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
import { Search, Sparkles, Shirt, Activity, Lightbulb, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherBackground from '../components/WeatherBackground/WeatherBackground';

export default function Home() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [insight, setInsight] = useState<AIInsight | string | null>(null);
    const [video, setVideo] = useState<YoutubeVideo | null | 'not_found'>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [refreshHistory, setRefreshHistory] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDateInfo, setShowDateInfo] = useState(false);

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                handleMapClick(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setError('Unable to retrieve your location. Please check browser permissions.');
                setLoading(false);
            }
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before or equal to the end date.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const weatherData = await weatherApi.getCurrentWeather(query);
            const forecastData = await weatherApi.getForecast(query);

            let finalForecast = forecastData;
            if (startDate && endDate) {
                const sDate = new Date(startDate).getTime();
                const eDate = new Date(endDate).getTime() + 86400000;
                const filteredList = forecastData.list.filter(item => {
                    const itemDate = item.dt * 1000;
                    return itemDate >= sDate && itemDate <= eDate;
                });
                if (filteredList.length > 0) {
                    finalForecast = { ...forecastData, list: filteredList };
                }
            }

            setWeather(weatherData);
            setForecast(finalForecast);

            generateWeatherInsight(weatherData).then(aiTip => setInsight(aiTip));
            youtubeApi.getVideoForLocation(weatherData.name).then(v => setVideo(v || 'not_found'));

            strapiApi.saveRecord(weatherData.name, weatherData, startDate, endDate).then(() => {
                setRefreshHistory(prev => prev + 1);
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before or equal to the end date.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const weatherData = await weatherApi.getCurrentWeather({ lat, lon });
            const forecastData = await weatherApi.getForecast({ lat, lon });

            let finalForecast = forecastData;
            if (startDate && endDate) {
                const sDate = new Date(startDate).getTime();
                const eDate = new Date(endDate).getTime() + 86400000;
                const filteredList = forecastData.list.filter(item => {
                    const itemDate = item.dt * 1000;
                    return itemDate >= sDate && itemDate <= eDate;
                });
                if (filteredList.length > 0) {
                    finalForecast = { ...forecastData, list: filteredList };
                }
            }

            setQuery(weatherData.name);
            setWeather(weatherData);
            setForecast(finalForecast);

            generateWeatherInsight(weatherData).then(aiTip => setInsight(aiTip));
            youtubeApi.getVideoForLocation(weatherData.name).then(v => setVideo(v || 'not_found'));

            strapiApi.saveRecord(weatherData.name, weatherData, startDate, endDate).then(() => {
                setRefreshHistory(prev => prev + 1);
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <>
            <WeatherBackground
                weatherMain={weather?.weather[0]?.main || ''}
                weatherDescription={weather?.weather[0]?.description || ''}
                temperature={weather?.main?.temp}
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 pb-10 relative z-10"
            >
                {!weather && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center space-y-4 pt-10"
                    >
                        <h2 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            Smart Weather
                        </h2>
                        <p className="text-lg text-white/90 max-w-2xl font-medium drop-shadow-md">
                            Experience real-time conditions, 5-day forecasts, and AI-powered insights wrapped in a beautiful glass interface.
                        </p>
                    </motion.div>
                )}

                {/* Dynamic Search Bar */}
                <motion.div
                    layout
                    className={`max-w-2xl mx-auto w-full transition-all duration-500 ${weather ? 'pt-2' : ''}`}
                >
                    <div className="flex gap-2 w-full">
                        <form onSubmit={handleSearch} className="relative flex-1 flex items-center border border-white/40 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 transition-colors focus-within:ring-2 focus-within:ring-white/50 focus-within:border-transparent">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for a city, zip code..."
                                className="w-full py-4 pl-6 pr-32 bg-transparent outline-none rounded-2xl text-white placeholder:text-white/80 font-medium"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 p-3 bg-blue-500 shadow-sm text-white rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <span className="animate-pulse">...</span> : <><Search className="w-4 h-4" /> Search</>}
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={handleCurrentLocation}
                            disabled={loading}
                            className="p-4 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 border border-white/40 shadow-lg transition-colors flex items-center justify-center disabled:opacity-50 flex-shrink-0"
                            title="Use my current location"
                        >
                            <MapPin className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Date Range Optional Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-3 bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm relative">
                        <div className="flex-1 flex items-center gap-2">
                            <label className="text-white/90 text-sm font-semibold whitespace-nowrap">Start Date:</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} onFocus={() => setShowDateInfo(true)} className="w-full bg-white/20 text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/50 border border-white/30 [color-scheme:dark]" />
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <label className="text-white/90 text-sm font-semibold whitespace-nowrap">End Date:</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} onFocus={() => setShowDateInfo(true)} className="w-full bg-white/20 text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/50 border border-white/30 [color-scheme:dark]" />
                        </div>
                    </div>
                    {showDateInfo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 text-center"
                        >
                            <p className="inline-block bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 text-white/90 font-medium text-xs drop-shadow-sm backdrop-blur-md">
                                ℹ️ The free API tier does not support past historical data. Dates act as a filter for the upcoming 5-day forecast.
                            </p>
                        </motion.div>
                    )}

                    {error && <p className="text-red-500 text-sm mt-3 font-bold text-center drop-shadow-md">{error}</p>}
                </motion.div>

                {/* Render Dynamic Weather Results */}
                <AnimatePresence>
                    {weather && forecast && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto w-full pt-6 space-y-6"
                        >
                            {insight && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/30 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-lg"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white/50 rounded-full text-indigo-700 shadow-sm">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg drop-shadow-sm">AI Daily Insight</h4>
                                    </div>

                                    {typeof insight === 'string' ? (
                                        <p className="text-slate-800 font-medium text-md pl-12">{insight}</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/40 p-4 rounded-2xl border border-white/40 hover:bg-white/50 transition-colors shadow-sm">
                                                <p className="text-slate-700 font-bold mb-1 flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-indigo-600" /> SUMMARY</p>
                                                <p className="text-slate-800 font-medium text-sm leading-relaxed">{insight.summary}</p>
                                            </div>
                                            <div className="bg-white/40 p-4 rounded-2xl border border-white/40 hover:bg-white/50 transition-colors shadow-sm">
                                                <p className="text-slate-700 font-bold mb-1 flex items-center gap-2 text-sm"><Shirt className="w-4 h-4 text-indigo-600" /> CLOTHING</p>
                                                <p className="text-slate-800 font-medium text-sm leading-relaxed">{insight.clothing}</p>
                                            </div>
                                            <div className="bg-white/40 p-4 rounded-2xl border border-white/40 hover:bg-white/50 transition-colors shadow-sm">
                                                <p className="text-slate-700 font-bold mb-1 flex items-center gap-2 text-sm"><Activity className="w-4 h-4 text-indigo-600" /> ACTIVITY</p>
                                                <p className="text-slate-800 font-medium text-sm leading-relaxed">{insight.activity}</p>
                                            </div>
                                            <div className="bg-white/40 p-4 rounded-2xl border border-white/40 hover:bg-white/50 transition-colors shadow-sm">
                                                <p className="text-slate-700 font-bold mb-1 flex items-center gap-2 text-sm"><Lightbulb className="w-4 h-4 text-yellow-600" /> HEADS-UP</p>
                                                <p className="text-slate-800 font-medium text-sm leading-relaxed">{insight.heads_up}</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            <CurrentWeather
                                data={weather}
                                chanceOfRain={forecast.list[0]?.pop !== undefined ? Math.round(forecast.list[0].pop * 100) : 0}
                            />

                            <ForecastList data={forecast} />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40"
                            >
                                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2 drop-shadow-md">
                                    📍 Location Map <span className="text-sm font-medium text-white/80 ml-auto bg-white/30 border border-white/40 px-3 py-1 rounded-full shadow-sm">Click to search</span>
                                </h3>
                                <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} locationName={weather.name} onMapClick={handleMapClick} />
                            </motion.div>

                            {video === 'not_found' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40"
                                >
                                    <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2 drop-shadow-md">
                                        🎬 Explore {weather.name}
                                    </h3>
                                    <p className="text-white/80 font-medium text-center py-6 bg-white/20 rounded-2xl border border-white/30">Video not found for this location.</p>
                                </motion.div>
                            ) : video && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40"
                                >
                                    <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2 drop-shadow-md">
                                        🎬 Explore {weather.name}
                                    </h3>
                                    <div className="relative w-full overflow-hidden pt-[56.25%] rounded-2xl bg-white/30 shadow-sm border border-white/40">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0&modestbranding=1`}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <SearchHistory refreshTrigger={refreshHistory} />
            </motion.div>
        </>
    );
}
