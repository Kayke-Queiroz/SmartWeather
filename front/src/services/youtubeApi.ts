import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export interface YoutubeVideo {
    id: string;
    title: string;
}

export const youtubeApi = {
    async getVideoForLocation(location: string): Promise<YoutubeVideo | null> {
        if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.trim() === '') return null;
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `"${location}" 4k drone tour`,
                    type: 'video',
                    key: YOUTUBE_API_KEY,
                    maxResults: 1,
                    videoEmbeddable: 'true',
                    safeSearch: 'strict'
                }
            });
            const items = response.data.items;
            if (items && items.length > 0) {
                return {
                    id: items[0].id.videoId,
                    title: items[0].snippet.title
                };
            }
            return null;
        } catch (error) {
            console.warn('YouTube API error:', error);
            return null;
        }
    }
};
