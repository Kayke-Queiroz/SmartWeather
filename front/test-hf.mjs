import fs from 'fs';
import { HfInference } from "@huggingface/inference";

const env = fs.readFileSync('.env', 'utf-8');
const hfLine = env.split('\n').find(l => l.includes('VITE_HUGGINGFACE_API_KEY'));
let key = hfLine ? hfLine.split('=')[1].trim() : '';
key = key.replace(/^["']|["']$/g, '');

const hf = new HfInference(key);

async function test(modelId) {
    try {
        const out = await hf.chatCompletion({
            model: modelId,
            messages: [{ role: "user", content: "Say hello!" }],
            max_tokens: 10,
        });
        console.log(`[SUCCESS] ${modelId}:`, out.choices[0].message.content.trim());
    } catch (err) {
        console.error(`[FAIL] ${modelId}:`, err.message);
    }
}

async function run() {
    await test("Qwen/Qwen2.5-72B-Instruct");
    await test("Qwen/Qwen2.5-7B-Instruct");
    await test("microsoft/Phi-3-mini-4k-instruct");
    await test("meta-llama/Llama-3.2-3B-Instruct");
    await test("HuggingFaceH4/zephyr-7b-beta");
}
run();
