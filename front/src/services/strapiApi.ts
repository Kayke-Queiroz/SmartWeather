import axios from 'axios';
import type { WeatherData } from './api';

const rawStrapiUrl = (import.meta.env.VITE_STRAPI_URL || 'https://smartweather-backend.onrender.com').trim();
const cleanedUrl = rawStrapiUrl.includes('-xxxx')
    ? 'https://smartweather-backend.onrender.com'
    : rawStrapiUrl.replace(/\/+$/, '');
const STRAPI_URL = `${cleanedUrl}/api`;
const LOCAL_STORAGE_KEY = 'smartweather_history_records';

export interface WeatherRecord {
    id: number;
    documentId: string;
    location: string;
    latitude: number;
    longitude: number;
    startDate: string;
    endDate: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    weatherData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forecastData?: any;
    createdAt: string;
}

// Local cache helpers to keep the app 100% operational in production
// even when Strapi Cloud instance is sleeping, rate-limited, or expired.
function getLocalRecords(): WeatherRecord[] {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveLocalRecords(records: WeatherRecord[]) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
        console.warn('Could not save to local storage:', e);
    }
}

export const strapiApi = {
    // WARMUP — fires once on app load to wake the Strapi Cloud instance
    async warmup() {
        try {
            await axios.get(`${STRAPI_URL.replace('/api', '')}/_health`, { timeout: 4000 });
        } catch {
            // Best-effort only
        }
    },

    // CREATE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async saveRecord(location: string, data: WeatherData, forecast: any, startDate?: string, endDate?: string): Promise<WeatherRecord | null> {
        const locName = location.trim() || data.name || `Location (${data.coord.lat.toFixed(2)}, ${data.coord.lon.toFixed(2)})`;
        const newRecord: WeatherRecord = {
            id: Date.now(),
            documentId: `local-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            location: locName,
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
            endDate: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            weatherData: {
                ...data,
                forecast: forecast
            },
            createdAt: new Date().toISOString(),
        };

        // Always save locally first so user never loses history
        const currentLocal = getLocalRecords();
        const updated = [newRecord, ...currentLocal.filter(r => r.location !== locName)].slice(0, 50);
        saveLocalRecords(updated);

        // Attempt remote save to Strapi
        try {
            const payload = {
                data: {
                    location: locName,
                    latitude: data.coord.lat,
                    longitude: data.coord.lon,
                    startDate: newRecord.startDate,
                    endDate: newRecord.endDate,
                    weatherData: newRecord.weatherData,
                }
            };
            const res = await axios.post(`${STRAPI_URL}/weather-records`, payload, { timeout: 5000 });
            return res.data?.data || newRecord;
        } catch (e) {
            console.warn('Strapi backend offline/unreachable, cached locally:', e);
            return newRecord;
        }
    },

    // READ
    async getRecords(): Promise<WeatherRecord[]> {
        const local = getLocalRecords();
        try {
            const res = await axios.get(`${STRAPI_URL}/weather-records?sort=createdAt:desc`, { timeout: 4000 });
            const remoteRecords: WeatherRecord[] = res.data?.data || [];
            if (remoteRecords.length > 0) {
                // Merge remote records with local records
                const combined = [...remoteRecords];
                for (const l of local) {
                    if (!combined.some(r => r.location === l.location || r.documentId === l.documentId)) {
                        combined.push(l);
                    }
                }
                saveLocalRecords(combined);
                return combined;
            }
            return local;
        } catch (e) {
            console.warn('Strapi backend offline/unreachable, using local cache:', e);
            return local;
        }
    },

    // UPDATE
    async updateRecordLocation(documentId: string, newLocationName: string) {
        // Update locally
        const currentLocal = getLocalRecords();
        const updated = currentLocal.map(r => r.documentId === documentId ? { ...r, location: newLocationName } : r);
        saveLocalRecords(updated);

        // Update in Strapi if remote document
        if (!documentId.startsWith('local-')) {
            try {
                const payload = { data: { location: newLocationName } };
                const res = await axios.put(`${STRAPI_URL}/weather-records/${documentId}`, payload, { timeout: 5000 });
                return res.data;
            } catch (e) {
                console.warn('Failed to update Strapi remotely:', e);
            }
        }
        return { data: { documentId, location: newLocationName } };
    },

    // DELETE
    async deleteRecord(documentId: string) {
        // Delete locally
        const currentLocal = getLocalRecords();
        const updated = currentLocal.filter(r => r.documentId !== documentId);
        saveLocalRecords(updated);

        // Delete in Strapi if remote document
        if (!documentId.startsWith('local-')) {
            try {
                const res = await axios.delete(`${STRAPI_URL}/weather-records/${documentId}`, { timeout: 5000 });
                return res.data;
            } catch (e) {
                console.warn('Failed to delete from Strapi remotely:', e);
            }
        }
        return { data: { documentId } };
    }
};
