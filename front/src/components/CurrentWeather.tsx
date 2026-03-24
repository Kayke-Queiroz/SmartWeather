import type { WeatherData } from '../services/api';
import { Droplets, Wind, Thermometer, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';

interface Props {
    data: WeatherData;
    chanceOfRain?: number;
}

export default function CurrentWeather({ data, chanceOfRain = 0 }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40 w-full"
        >
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-white drop-shadow-md">
                        {data.name}, {data.sys.country}
                    </h2>
                    <p className="text-white/90 capitalize mt-1 text-lg font-medium drop-shadow-sm flex items-center gap-2">
                        {data.weather[0]?.description || 'Clear'}
                    </p>
                    <div className="text-7xl font-extrabold text-white mt-4 tracking-tighter drop-shadow-lg flex items-center gap-6">
                        {Math.round(data.main.temp)}°
                        <WeatherIcon main={data.weather[0]?.main || 'Clear'} className="w-20 h-20" />
                    </div>
                </div>

                <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-white/30 w-full md:w-auto grid grid-cols-2 gap-x-12 gap-y-6 md:min-w-[300px] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/50 rounded-full text-orange-600 shadow-sm">
                            <Thermometer className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Feels Like</p>
                            <p className="font-bold text-lg text-slate-900">{Math.round(data.main.feels_like)}°</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/50 rounded-full text-blue-600 shadow-sm">
                            <Droplets className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Humidity</p>
                            <p className="font-bold text-lg text-slate-900">{Math.round(data.main.humidity)}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/50 rounded-full text-slate-600 shadow-sm">
                            <Wind className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Wind Speed</p>
                            <p className="font-bold text-lg text-slate-900">{data.wind.speed.toFixed(1)} m/s</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/50 rounded-full text-indigo-600 shadow-sm">
                            <Umbrella className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Chance of Rain</p>
                            <p className="font-bold text-lg text-slate-900">{chanceOfRain}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
