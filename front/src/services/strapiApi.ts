import axios from 'axios';
import type { WeatherData } from './api';

const STRAPI_URL = 'http://localhost:1337/api';

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
    createdAt: string;
}

export const strapiApi = {
    // CREATE
    async saveRecord(location: string, data: WeatherData, startDate?: string, endDate?: string) {
        try {
            const payload = {
                data: {
                    location,
                    latitude: data.coord.lat,
                    longitude: data.coord.lon,
                    startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
                    endDate: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    weatherData: data,
                }
            };
            const res = await axios.post(`${STRAPI_URL}/weather-records`, payload);
            return res.data;
        } catch (e) {
            console.error('Failed to save to Strapi:', e);
        }
    },

    // READ
    async getRecords(): Promise<WeatherRecord[]> {
        try {
            const res = await axios.get(`${STRAPI_URL}/weather-records?sort=createdAt:desc`);
            return res.data.data;
        } catch (e) {
            console.error('Failed to fetch from Strapi:', e);
            return [];
        }
    },

    // UPDATE (To meet the assessment criteria of allowing users to update records)
    async updateRecordLocation(documentId: string, newLocationName: string) {
        try {
            const payload = { data: { location: newLocationName } };
            const res = await axios.put(`${STRAPI_URL}/weather-records/${documentId}`, payload);
            return res.data;
        } catch (e) {
            console.error('Failed to update Strapi:', e);
        }
    },

    // DELETE
    async deleteRecord(documentId: string) {
        try {
            const res = await axios.delete(`${STRAPI_URL}/weather-records/${documentId}`);
            return res.data;
        } catch (e) {
            console.error('Failed to delete from Strapi:', e);
        }
    }
};
