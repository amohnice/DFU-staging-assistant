import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Vercel Serverless Function for Clinical Advisor
 * Endpoint: /api/chat
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, context, language = 'en' } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const langInstruction = language === 'sw'
            ? "Respond in Swahili (Kiswahili)."
            : "Respond in English.";

        const systemPrompt = `You are a Podiatric Clinical Advisor. 
        Context: ${JSON.stringify(context || {})}
        ${langInstruction}
        Provide concise, professional medical guidance.`;

        const chat = chatModel.startChat({
            history: [
                { role: "user", parts: [{ text: "Hello, advice me on this ulcer." }] },
                { role: "model", parts: [{ text: "Ready to help. Provide context." }] },
            ],
        });

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser Question: ${message}`);
        const response = await result.response;
        res.status(200).json({ reply: response.text() });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate a response.' });
    }
}
