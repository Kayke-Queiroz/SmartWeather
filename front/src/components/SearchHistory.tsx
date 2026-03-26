import { useState, useEffect } from 'react';
import { strapiApi } from '../services/strapiApi';
import type { WeatherRecord } from '../services/strapiApi';
import { Trash2, Edit2, Check, X, FileJson, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

export default function SearchHistory({ refreshTrigger }: { refreshTrigger: number }) {
    const [records, setRecords] = useState<WeatherRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const loadRecords = async (retryCount = 0) => {
        setLoading(true);
        const data = await strapiApi.getRecords();
        
        // data is null when an error occurs (like connection refused during cold start)
        if (data === null) {
            if (retryCount < 24) {
                console.log(`Strapi API unreachable (cold start). Retrying in 5s... (Attempt ${retryCount + 1}/24)`);
                setTimeout(() => loadRecords(retryCount + 1), 5000);
            } else {
                setLoading(false); // give up after 2 minutes
            }
            return;
        }

        setRecords(data);
        setLoading(false);
    };

    useEffect(() => {
        loadRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger]);

    const handleDelete = async (documentId: string) => {
        await strapiApi.deleteRecord(documentId);
        loadRecords();
    };

    const startEdit = (record: WeatherRecord) => {
        setEditingId(record.documentId);
        setEditValue(record.location);
    };

    const saveEdit = async (documentId: string) => {
        if (!editValue.trim()) return;
        await strapiApi.updateRecordLocation(documentId, editValue);
        setEditingId(null);
        loadRecords();
    };

    const exportToJSON = () => {
        const exportDate = format(new Date(), 'yyyy-MM-dd');

        const structured = records.map(r => {
            const forecastList: any[] = r.weatherData?.forecast?.list || [];

            // Group forecast by day, pick the midday reading or first of each day
            const dailyForecast: Record<string, any[]> = {};
            forecastList.forEach((item: any) => {
                const date = item.dt_txt.split(' ')[0];
                if (!dailyForecast[date]) dailyForecast[date] = [];
                dailyForecast[date].push(item);
            });

            const forecast = Object.entries(dailyForecast).slice(0, 5).map(([date, items]) => {
                // Prefer 12:00 reading, fallback to first
                const mid = items.find(i => i.dt_txt.includes('12:00:00')) || items[0];
                return {
                    date,
                    temp_c: Math.round(mid.main.temp),
                    feels_like_c: Math.round(mid.main.feels_like),
                    humidity_pct: mid.main.humidity,
                    condition: mid.weather?.[0]?.description || '',
                    wind_speed_mps: mid.wind?.speed ?? null,
                };
            });

            return {
                city: r.location,
                period: {
                    from: r.startDate ? format(new Date(r.startDate), 'yyyy-MM-dd') : null,
                    to: r.endDate ? format(new Date(r.endDate), 'yyyy-MM-dd') : null,
                },
                coordinates: {
                    latitude: r.latitude,
                    longitude: r.longitude,
                },
                current_conditions: {
                    temp_c: r.weatherData?.main?.temp != null ? Math.round(r.weatherData.main.temp) : null,
                    feels_like_c: r.weatherData?.main?.feels_like != null ? Math.round(r.weatherData.main.feels_like) : null,
                    humidity_pct: r.weatherData?.main?.humidity ?? null,
                    condition: r.weatherData?.weather?.[0]?.description || null,
                    wind_speed_mps: r.weatherData?.wind?.speed ?? null,
                },
                daily_forecast: forecast,
                saved_at: format(new Date(r.createdAt), "yyyy-MM-dd'T'HH:mm:ss"),
                record_id: r.documentId,
            };
        });

        const output = {
            exported_at: exportDate,
            total_records: structured.length,
            records: structured,
        };

        const dataStr = JSON.stringify(output, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartweather-history-${exportDate}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportToCSV = () => {
        const exportDate = format(new Date(), 'yyyy-MM-dd');

        const headers = [
            'City',
            'Period From',
            'Period To',
            'Latitude',
            'Longitude',
            'Current Temp (°C)',
            'Feels Like (°C)',
            'Humidity (%)',
            'Condition',
            'Wind Speed (m/s)',
            'Day 1 Date', 'Day 1 Temp (°C)', 'Day 1 Condition',
            'Day 2 Date', 'Day 2 Temp (°C)', 'Day 2 Condition',
            'Day 3 Date', 'Day 3 Temp (°C)', 'Day 3 Condition',
            'Day 4 Date', 'Day 4 Temp (°C)', 'Day 4 Condition',
            'Day 5 Date', 'Day 5 Temp (°C)', 'Day 5 Condition',
            'Saved At',
        ];

        const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;

        const rows = records.map(r => {
            const forecastList: any[] = r.weatherData?.forecast?.list || [];

            const dailyForecast: Record<string, any[]> = {};
            forecastList.forEach((item: any) => {
                const date = item.dt_txt.split(' ')[0];
                if (!dailyForecast[date]) dailyForecast[date] = [];
                dailyForecast[date].push(item);
            });

            const days = Object.entries(dailyForecast).slice(0, 5).map(([date, items]) => {
                const mid = items.find(i => i.dt_txt.includes('12:00:00')) || items[0];
                return {
                    date,
                    temp: Math.round(mid.main.temp),
                    condition: mid.weather?.[0]?.description || '',
                };
            });
            while (days.length < 5) days.push({ date: '', temp: NaN, condition: '' });

            const dayColumns = days.flatMap(d => [
                esc(d.date),
                d.date ? d.temp : '',
                esc(d.condition),
            ]);

            return [
                esc(r.location),
                esc(r.startDate ? format(new Date(r.startDate), 'yyyy-MM-dd') : ''),
                esc(r.endDate ? format(new Date(r.endDate), 'yyyy-MM-dd') : ''),
                r.latitude,
                r.longitude,
                r.weatherData?.main?.temp != null ? Math.round(r.weatherData.main.temp) : '',
                r.weatherData?.main?.feels_like != null ? Math.round(r.weatherData.main.feels_like) : '',
                r.weatherData?.main?.humidity ?? '',
                esc(r.weatherData?.weather?.[0]?.description || ''),
                r.weatherData?.wind?.speed ?? '',
                ...dayColumns,
                esc(format(new Date(r.createdAt), "yyyy-MM-dd HH:mm:ss")),
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartweather-history-${exportDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading && records.length === 0) return <div className="text-center py-8 text-white/80 animate-pulse font-medium drop-shadow-md">Loading history...</div>;

    if (records.length === 0) return null;

    return (
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40 mt-12 w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-md">
                    🕒 Search History & Cloud Sync
                </h3>
                <div className="flex gap-2">
                    <button onClick={exportToJSON} className="flex items-center gap-2 px-3 py-1.5 bg-white/30 hover:bg-white/40 text-white text-sm font-semibold rounded-xl transition-colors border border-white/30 shadow-sm">
                        <FileJson className="w-4 h-4" /> Export JSON
                    </button>
                    <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-1.5 bg-white/30 hover:bg-white/40 text-white text-sm font-semibold rounded-xl transition-colors border border-white/30 shadow-sm">
                        <FileSpreadsheet className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>
            <div className="space-y-3">
                {records.map(record => (
                    <div key={record.documentId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl border border-white/20 gap-4 shadow-sm">

                        <div className="flex-1">
                            {editingId === record.documentId ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="border border-white/50 bg-white/40 text-slate-900 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg w-full max-w-[200px]"
                                        autoFocus
                                    />
                                    <button onClick={() => saveEdit(record.documentId)} className="text-green-600 hover:bg-green-100 p-1.5 rounded-md transition-colors"><Check className="w-5 h-5" /></button>
                                    <button onClick={() => setEditingId(null)} className="text-white/80 hover:bg-white/20 p-1.5 rounded-md transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-lg text-white drop-shadow-sm">{record.location}</p>
                                    <button onClick={() => startEdit(record)} title="Rename Location" className="text-white/60 hover:text-white transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <p className="text-sm text-white/80 font-medium mt-1 drop-shadow-sm flex items-center gap-2 flex-wrap">
                                <span>{record.weatherData?.main?.temp ? `${Math.round(record.weatherData.main.temp)}°C` : 'N/A'}</span>
                                <span>•</span>
                                <span>{format(new Date(record.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                                {(record.startDate && record.endDate) && (
                                    <>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="bg-blue-500/20 px-2 py-0.5 rounded-md text-xs border border-blue-400/30">
                                            {format(new Date(record.startDate), "MMM d")} - {format(new Date(record.endDate), "MMM d, yyyy")}
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm font-medium w-full sm:w-auto justify-between sm:justify-end">
                            <button
                                onClick={() => handleDelete(record.documentId)}
                                className="p-2 text-red-500 hover:bg-red-500/20 hover:text-red-600 rounded-xl transition-colors"
                                title="Delete Record"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
