import type { WeatherData } from '../services/api';
import { Droplets, Wind, Thermometer } from 'lucide-react';

interface Props {
    data: WeatherData;
}

export default function CurrentWeather({ data }: Props) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
                        {data.name}, {data.sys.country}
                    </h2>
                    <p className="text-slate-500 capitalize mt-1 text-lg">{data.weather[0]?.description || 'Clear'}</p>
                    <div className="text-7xl font-extrabold text-blue-600 mt-4 tracking-tighter">
                        {Math.round(data.main.temp)}°
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl w-full md:w-auto grid grid-cols-2 gap-x-12 gap-y-6 md:min-w-[300px]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                            <Thermometer className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Feels Like</p>
                            <p className="font-bold text-lg text-slate-800">{Math.round(data.main.feels_like)}°</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Droplets className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Humidity</p>
                            <p className="font-bold text-lg text-slate-800">{Math.round(data.main.humidity)}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 col-span-2">
                        <div className="p-3 bg-slate-200 rounded-full text-slate-600">
                            <Wind className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Wind Speed</p>
                            <p className="font-bold text-lg text-slate-800">{data.wind.speed.toFixed(1)} m/s</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
