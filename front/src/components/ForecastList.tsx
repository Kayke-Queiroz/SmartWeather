import type { ForecastData } from '../services/api';
import { format } from 'date-fns';

interface Props {
    data: ForecastData;
}

export default function ForecastList({ data }: Props) {
    // Extract one forecast per day (around noon or closest available)
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00') || item.dt_txt.includes('15:00:00')).slice(0, 5);

    // Fallback array slicer if API returns a weird timeframe
    const forecasts = dailyForecasts.length === 5 ? dailyForecasts : data.list.filter((_, i) => i % 8 === 0).slice(0, 5);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 w-full mb-6">
            <h3 className="text-xl font-bold mb-6 text-slate-800">5-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {forecasts.map((day, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-slate-100 transition-colors">
                        <p className="font-semibold text-slate-800">{format(new Date(day.dt * 1000), 'EEE')}</p>
                        <p className="text-xs text-slate-500 mb-2">{format(new Date(day.dt * 1000), 'MMM d')}</p>
                        <div className="p-2 bg-white rounded-full shadow-sm my-2">
                            <img
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                alt={day.weather[0].description}
                                className="w-12 h-12"
                            />
                        </div>
                        <p className="font-bold text-xl mt-1 text-slate-800">{Math.round(day.main.temp)}°</p>
                        <div className="flex gap-2 text-xs mt-1 font-medium">
                            <span className="text-blue-500">{Math.round(day.main.temp_min)}°</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-orange-500">{Math.round(day.main.temp_max)}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
