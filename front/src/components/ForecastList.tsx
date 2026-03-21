import type { ForecastData } from '../services/api';
import { format } from 'date-fns';
import { Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    data: ForecastData;
}

export default function ForecastList({ data }: Props) {
    // Extract one forecast per day (around noon or closest available)
    const uniqueDays = new Set<string>();
    let forecasts = data.list.filter(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!uniqueDays.has(date) && (item.dt_txt.includes('12:00:00') || item.dt_txt.includes('15:00:00'))) {
            uniqueDays.add(date);
            return true;
        }
        return false;
    });

    // Fallback if we couldn't get 5 days around noon
    if (forecasts.length < 5) {
        uniqueDays.clear();
        forecasts = data.list.filter(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!uniqueDays.has(date)) {
                uniqueDays.add(date);
                return true;
            }
            return false;
        });
    }

    forecasts = forecasts.slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40 w-full mb-6"
        >
            <h3 className="text-xl font-bold mb-6 text-white text-center md:text-left drop-shadow-md">5-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {forecasts.map((day, idx) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        key={idx}
                        className="bg-white/30 backdrop-blur-sm border border-white/40 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-white/40 transition-colors shadow-sm"
                    >
                        <p className="font-bold text-slate-800">{format(new Date(day.dt * 1000), 'EEE')}</p>
                        <p className="text-xs text-slate-600 font-semibold mb-2">{format(new Date(day.dt * 1000), 'MMM d')}</p>
                        <div className="p-2 bg-white/60 rounded-full shadow-sm my-2">
                            <img
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                alt={day.weather[0].description}
                                className="w-12 h-12"
                            />
                        </div>
                        <p className="font-extrabold text-xl mt-1 text-slate-800">{Math.round(day.main.temp)}°</p>
                        <div className="flex gap-2 text-xs mt-1 font-bold">
                            <span className="text-blue-600">{Math.round(day.main.temp_min)}°</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-orange-600">{Math.round(day.main.temp_max)}°</span>
                        </div>
                        {day.pop !== undefined && (
                            <div className="flex items-center justify-center gap-1 text-xs font-bold text-indigo-600 mt-2">
                                <Umbrella className="w-3 h-3" /> {Math.round(day.pop * 100)}%
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
