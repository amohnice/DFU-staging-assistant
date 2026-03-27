import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Create a router to handle /api prefix reliably
const router = express.Router();

router.get('/models', (req, res) => {
    res.json({ message: 'Model check reachable', model: 'gemini-2.5-flash' });
});

router.post('/classify', async (req, res) => {
    const { image, mimeType, language = 'en' } = req.body;
    if (!image || !mimeType) return res.status(400).json({ error: 'Image and mimeType required.' });

    const langInstruction = language === 'sw' ? "Respond strictly in Swahili." : "Respond strictly in English.";
    const prompt = `You are a podiatric medical assistant. Analyze the foot ulcer in this image. Classify it strictly according to the Wagner-Meggitt Classification. ${langInstruction} Provide JSON: grade, description, risk_level, recommendation.`;

    try {
        const result = await model.generateContent([prompt, { inlineData: { data: image.split(',')[1] || image, mimeType } }]);
        const text = (await result.response).text().replace(/```json\n?|\n?```/g, '').trim();
        res.json(JSON.parse(text));
    } catch (error) {
        res.status(500).json({ error: 'Gemini Analysis Failed. Check Vercel API Key.' });
    }
});

router.post('/chat', async (req, res) => {
    const { message, context, language = 'en' } = req.body;
    const langInstruction = language === 'sw' ? "Respond in Swahili." : "Respond in English.";
    const systemPrompt = `You are a Podiatric Clinical Advisor. Context: ${JSON.stringify(context || {})}. ${langInstruction} Concise guidance only.`;

    try {
        const chat = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }).startChat();
        const result = await chat.sendMessage(`${systemPrompt}\n\nUser Question: ${message}`);
        res.json({ reply: (await result.response).text() });
    } catch (error) {
        res.status(500).json({ error: 'Assistant failed to respond.' });
    }
});

// Mount the router on BOTH /api and /
// This handles cases where Vercel rewrites /api/classify to /classify or keeps the full path
app.use('/api', router);
app.use('/', router);

export default app;
