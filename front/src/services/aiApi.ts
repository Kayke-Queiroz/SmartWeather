import { HfInference } from "@huggingface/inference";

const _rawKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
const HF_API_KEY = _rawKey.replace(/^["']|["']$/g, '').trim();

const hf = HF_API_KEY && HF_API_KEY !== 'YOUR_HF_TOKEN' ? new HfInference(HF_API_KEY) : null;

export const generateWeatherInsight = async (cityName: string, currentTemp: number, description: string): Promise<string> => {
    if (!hf) {
        return "🤖 AI Offline: A chave da Hugging Face API não foi encontrada no arquivo .env.";
    }

    try {
        const out = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                { role: "system", content: "You are a concise AI weather assistant. Provide exactly one short sentence of practical advice for someone going outside." },
                { role: "user", content: `The current weather in ${cityName} is ${currentTemp}°C with ${description}. Provide a very short, one sentence practical insight.` }
            ],
            max_tokens: 45,
            temperature: 0.7,
        });

        if (out.choices && out.choices.length > 0 && out.choices[0].message?.content) {
            return out.choices[0].message.content.trim().replace(/^"|"$/g, '');
        }

        return "🤖 AI Offline: A Hugging Face não devolveu um texto legível.";
    } catch (err: any) {
        console.warn("Hugging Face API falhou:", err);
        return `🤖 AI Offline: Erro na Hugging Face. (${err.message})`;
    }
};
