import { HfInference } from "@huggingface/inference";

const _rawKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
const HF_API_KEY = _rawKey.replace(/^["']|["']$/g, '').trim();

const hf = HF_API_KEY && HF_API_KEY !== 'YOUR_HF_TOKEN' ? new HfInference(HF_API_KEY) : null;

import type { WeatherData } from './api';

export interface AIInsight {
    summary: string;
    clothing: string;
    activity: string;
    heads_up: string;
}

export const generateWeatherInsight = async (weather: WeatherData): Promise<AIInsight | string> => {
    if (!hf) {
        return "🤖 AI Offline: A chave da Hugging Face API não foi encontrada no arquivo .env.";
    }

    try {
        const prompt = `You are a specialized AI weather assistant. Analyze the weather data and return ONLY a valid JSON object without any extra text or markdown.
Data: Location: ${weather.name}, Temp: ${Math.round(weather.main.temp)}°C, Feels like: ${Math.round(weather.main.feels_like)}°C, Humidity: ${weather.main.humidity}%, Wind: ${weather.wind.speed.toFixed(1)}m/s, Description: ${weather.weather[0].description}.
CRITICAL INSTRUCTION: The "heads_up" field is MANDATORY. If there is bad weather, provide a safety warning. If the weather is good, provide a helpful "heads-up" (e.g., "Drink plenty of water", "Don't forget your sunglasses!", "Perfect condition for a walk"). NEVER leave it empty.
Return EXACTLY this JSON format:
{
  "summary": "Greeting and 1 sentence overall summary",
  "clothing": "Short recommendation on what to wear",
  "activity": "One suggested activity or what to avoid",
  "heads_up": "MANDATORY safety warning or helpful heads-up based on weather."
}`;

        const out = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                { role: "system", content: "You are a specialized JSON-only AI. Output strictly valid JSON." },
                { role: "user", content: prompt }
            ],
            max_tokens: 200,
            temperature: 0.5,
        });

        if (out.choices && out.choices.length > 0 && out.choices[0].message?.content) {
            const content = out.choices[0].message.content.trim();
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as AIInsight;
            }
            return content; // Fallback
        }

        return "🤖 AI Offline: A Hugging Face não devolveu um texto legível.";
    } catch (err: any) {
        console.warn("Hugging Face API falhou:", err);
        return `🤖 AI Offline: Erro na Hugging Face. (${err.message})`;
    }
};
