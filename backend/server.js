import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Diagnostic endpoint to list models
app.get('/api/models', async (req, res) => {
    try {
        const result = await genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        // This is just a test to see if we can reach it
        res.json({ message: 'Model check endpoint reachable', model: 'gemini-2.5-flash' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/classify', async (req, res) => {
    const { image, mimeType, language = 'en' } = req.body;

    if (!image || !mimeType) {
        return res.status(400).json({ error: 'Image and mimeType are required.' });
    }

    const langInstruction = language === 'sw'
        ? "Respond strictly in Swahili (Kiswahili)."
        : "Respond strictly in English.";

    const prompt = `You are a podiatric medical assistant. Analyze the foot ulcer in this image. 
    Classify it strictly according to the Wagner-Meggitt Classification. 
    ${langInstruction}
    Provide the output in strict JSON format with the following keys: grade, description, risk_level, and recommendation. 
    Do not add markdown formatting to the JSON.

    Expected JSON Mapping (Translate values to the requested language):
    - Grade 0: No ulcer, high-risk foot.
    - Grade 1: Superficial ulcer (full thickness).
    - Grade 2: Deep ulcer (exposed tendon/joint).
    - Grade 3: Deep ulcer with abscess/osteomyelitis.
    - Grade 4: Gangrene of forefoot.
    - Grade 5: Gangrene of entire foot.

    Risk Levels: Low, Moderate, High, Critical.`;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: image.split(',')[1] || image,
                    mimeType: mimeType
                }
            }
        ]);

        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json\n?|\n?```/g, '').trim();
        res.json(JSON.parse(text));
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to analyze image. Please check your API key and network connection.' });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message, context, language = 'en' } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    const langInstruction = language === 'sw'
        ? "Respond in Swahili (Kiswahili)."
        : "Respond in English.";

    const systemPrompt = `You are a Podiatric Clinical Advisor. 
    You are helping a clinician understand a patient's foot ulcer results.
    Current Context: ${JSON.stringify(context || {})}
    ${langInstruction}
    Provide concise, professional, and empathetic medical guidance.
    Clearly state: "This is for informational support and should be verified by a specialist."`;

    try {
        const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const chat = chatModel.startChat({
            history: [
                { role: "user", parts: [{ text: "Hello, I need advice on this ulcer classification." }] },
                { role: "model", parts: [{ text: "I am ready to help. Please provide the context or ask your question." }] },
            ],
        });

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser Question: ${message}`);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate a response. Please try again later.' });
    }
});


// Catch-all for non-existent routes
app.use((req, res) => {
    res.status(404).json({ error: `Path not found: ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Server Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Modified for Vercel Serverless compatibility
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export default app;
