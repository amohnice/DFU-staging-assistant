import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Vercel Serverless Function for Classification
 * Endpoint: /api/classify
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { image, mimeType, language = 'en' } = req.body;

    if (!image || !mimeType) {
        return res.status(400).json({ error: 'Image and mimeType are required.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const langInstruction = language === 'sw'
            ? "Respond strictly in Swahili (Kiswahili)."
            : "Respond strictly in English.";

        const prompt = `You are a podiatric medical assistant. Analyze the foot ulcer in this image. 
        Classify it strictly according to the Wagner-Meggitt Classification. 
        ${langInstruction}
        Provide the output in strict JSON format with the following keys: grade, description, risk_level, and recommendation. 
        Do not add markdown formatting to the JSON.`;

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
        res.status(200).json(JSON.parse(text));
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to analyze image. Ensure GEMINI_API_KEY is in Vercel settings.' });
    }
}
