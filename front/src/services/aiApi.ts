import type { WeatherData } from './api';

const _rawGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_KEY = _rawGeminiKey.replace(/^["']|["']$/g, '').trim();

const _rawHfKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
const HF_API_KEY = _rawHfKey.replace(/^["']|["']$/g, '').trim();

const _rawGroqKey = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_KEY = _rawGroqKey.replace(/^["']|["']$/g, '').trim();

export interface AIInsight {
    summary: string;
    clothing: string;
    activity: string;
    heads_up: string;
}

/**
 * Intelligent heuristic fallback to guarantee rich AI insight cards
 * even when offline or before the API key is configured.
 */
function generateLocalInsight(weather: WeatherData): AIInsight {
    const temp = Math.round(weather.main.temp);
    const feelsLike = Math.round(weather.main.feels_like);
    const condition = weather.weather[0]?.main?.toLowerCase() || '';
    const desc = weather.weather[0]?.description || 'current conditions';
    const wind = weather.wind.speed;
    const humidity = weather.main.humidity;

    let summary = `Currently in ${weather.name}, it's ${temp}°C with ${desc}.`;
    if (feelsLike !== temp) {
        summary += ` Feels like ${feelsLike}°C.`;
    }

    let clothing = 'Comfortable casual wear recommended.';
    if (temp < 10) {
        clothing = 'Heavy jacket, warm layers, and a scarf are recommended.';
    } else if (temp < 18) {
        clothing = 'Light jacket, sweater, or hoodie with long pants.';
    } else if (temp > 28) {
        clothing = 'Light breathable clothing, sunglasses, and sun hat.';
    } else {
        clothing = 'T-shirt or light shirt with comfortable pants or jeans.';
    }

    let activity = 'Great time for outdoor strolls or errands.';
    if (condition.includes('rain') || condition.includes('drizzle')) {
        activity = 'Ideal for indoor activities, museum visits, or cozy reading.';
    } else if (condition.includes('thunder')) {
        activity = 'Stay indoors and avoid open or elevated outdoor areas.';
    } else if (condition.includes('snow')) {
        activity = 'Fun for snow sports or winter photography; drive with caution.';
    } else if (temp > 30) {
        activity = 'Keep vigorous outdoor workouts early in the morning or after sunset.';
    } else if (condition.includes('clear')) {
        activity = 'Perfect weather for jogging, cycling, or visiting a scenic park.';
    }

    let heads_up = 'Stay hydrated and have a wonderful day!';
    if (condition.includes('thunder')) {
        heads_up = 'Lightning hazard: keep clear of tall objects and remain inside.';
    } else if (condition.includes('rain')) {
        heads_up = 'Wet surfaces: carry an umbrella and watch your footing.';
    } else if (wind > 10) {
        heads_up = `Gusty winds at ${wind.toFixed(1)} m/s — secure lightweight outdoor items.`;
    } else if (temp > 30) {
        heads_up = 'High heat: drink plenty of fluids and apply SPF 30+ sunscreen.';
    } else if (humidity > 85) {
        heads_up = 'High humidity may make the air feel muggier than the actual temperature.';
    } else if (temp < 5) {
        heads_up = 'Risk of frost: keep warm and watch for slippery patches.';
    }

    return {
        summary,
        clothing,
        activity,
        heads_up,
    };
}

async function callGemini(apiKey: string, prompt: string): Promise<AIInsight | null> {
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        temperature: 0.5,
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    return JSON.parse(text) as AIInsight;
                }
            }
        } catch (e) {
            console.warn(`Gemini (${model}) call failed:`, e);
        }
    }
    return null;
}

export const generateWeatherInsight = async (weather: WeatherData): Promise<AIInsight | string> => {
    const prompt = `You are a specialized AI weather assistant. Analyze this real-time weather data and return ONLY a valid JSON object matching the schema.
Data:
- Location: ${weather.name}
- Temperature: ${Math.round(weather.main.temp)}°C (Feels like: ${Math.round(weather.main.feels_like)}°C)
- Condition: ${weather.weather[0].main} - ${weather.weather[0].description}
- Humidity: ${weather.main.humidity}%
- Wind Speed: ${weather.wind.speed.toFixed(1)} m/s

CRITICAL INSTRUCTIONS:
- "summary": 1 friendly, personalized sentence summarizing today's weather.
- "clothing": Concrete, practical recommendation for what to wear.
- "activity": One great activity suited for this weather (or what to avoid).
- "heads_up": MANDATORY safety notice or health tip (e.g. hydration, UV protection, slippery road, warm layers).

Return strictly this JSON format without markdown wrapping:
{
  "summary": "...",
  "clothing": "...",
  "activity": "...",
  "heads_up": "..."
}`;

    // 1. Google Gemini (Primary free engine)
    if (GEMINI_API_KEY) {
        try {
            const geminiInsight = await callGemini(GEMINI_API_KEY, prompt);
            if (geminiInsight) {
                return geminiInsight;
            }
        } catch (err) {
            console.warn('Gemini failed, trying next provider:', err);
        }
    }

    // 2. Groq (Fast free alternative if configured)
    if (GROQ_API_KEY) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are a specialized JSON-only AI. Output strictly valid JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.5,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                    return JSON.parse(content) as AIInsight;
                }
            }
        } catch (groqErr) {
            console.warn('Groq failed, trying next provider:', groqErr);
        }
    }

    // 3. Hugging Face (Legacy support if key provided)
    if (HF_API_KEY && HF_API_KEY !== 'YOUR_HF_TOKEN') {
        try {
            const { HfInference } = await import('@huggingface/inference');
            const hf = new HfInference(HF_API_KEY);
            const out = await hf.chatCompletion({
                model: 'Qwen/Qwen2.5-7B-Instruct',
                messages: [
                    { role: 'system', content: 'You are a specialized JSON-only AI. Output strictly valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 250,
                temperature: 0.5,
            });
            if (out.choices && out.choices.length > 0 && out.choices[0].message?.content) {
                const content = out.choices[0].message.content.trim();
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]) as AIInsight;
                }
            }
        } catch (hfErr) {
            console.warn('Hugging Face failed:', hfErr);
        }
    }

    // 4. Guaranteed dynamic local fallback
    return generateLocalInsight(weather);
};
