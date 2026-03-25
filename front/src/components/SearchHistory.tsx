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

    const loadRecords = async () => {
        setLoading(true);
        const data = await strapiApi.getRecords();
        setRecords(data || []);
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadRecords();
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
        const dataStr = JSON.stringify(records, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartweather-history-${format(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportToCSV = () => {
        const headers = [
            'ID', 'Location', 'Latitude', 'Longitude', 'CreatedAt', 'StartDate', 'EndDate', 
            'Current Temp (C)', 'Condition',
            'Day 1 Temp', 'Day 2 Temp', 'Day 3 Temp', 'Day 4 Temp', 'Day 5 Temp'
        ];

        const rows = records.map(r => {
            const forecastList = r.weatherData?.forecast?.list || [];
            
            // Basic grouping by day to get representative temperatures
            const dailyTemps: string[] = [];
            const seenDates = new Set();
            
            forecastList.forEach((item: any) => {
                const date = item.dt_txt.split(' ')[0];
                if (!seenDates.has(date) && dailyTemps.length < 5) {
                    seenDates.add(date);
                    dailyTemps.push(`${Math.round(item.main.temp)}°C`);
                }
            });

            // Ensure we always have 5 columns for forecast
            while (dailyTemps.length < 5) dailyTemps.push('');

            return [
                r.documentId,
                `"${r.location}"`,
                r.latitude,
                r.longitude,
                `"${r.createdAt}"`,
                `"${r.startDate || ''}"`,
                `"${r.endDate || ''}"`,
                r.weatherData?.main?.temp || '',
                `"${r.weatherData?.weather?.[0]?.description || ''}"`,
                ...dailyTemps
            ];
        });

        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartweather-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
