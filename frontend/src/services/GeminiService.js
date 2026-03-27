import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * GeminiService handles interactions with the Google Gemini API.
 */
class GeminiService {
    constructor() {
        // In local development, we point to the Express server on :3001
        // In production (Vercel), we use relative paths as they share the same origin
        // NOTE: We check for 'production' string or undefined depending on build tool
        const isProd = import.meta.env?.PROD || process.env.NODE_ENV === 'production';
        this.apiBase = isProd ? '' : 'http://localhost:3001';
        this.genAI = null;
    }

    /**
     * Helper to safely parse JSON from a response
     */
    async safeParseJSON(response) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            const text = await response.text();
            console.error("Non-JSON response received:", text);
            throw new Error(`Server returned non-JSON response (${response.status}). Is the backend running?`);
        }
    }

    /**
     * Classifies a foot ulcer image using the backend proxy with language support.
     * @param {string} base64Image - The base64 encoded image string.
     * @param {string} mimeType - The mime type of the image.
     * @param {string} language - The requested language ('en' or 'sw').
     * @returns {Promise<Object>} - The classification result.
     */
    async classifyUlcer(base64Image, mimeType, language = 'en') {
        try {
            const response = await fetch(`${this.apiBase}/api/classify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    mimeType: mimeType,
                    language: language
                })
            });

            if (!response.ok) {
                const errorData = await this.safeParseJSON(response);
                throw new Error(errorData.error || 'Backend analysis failed.');
            }

            return await this.safeParseJSON(response);
        } catch (error) {
            console.error("Backend API Error:", error);
            throw new Error(error.message || "Failed to connect to backend server.");
        }
    }

    /**
     * Sends a message to the Clinical Advisor chatbot.
     * @param {string} message - The user's message.
     * @param {Object} context - The current classification result context.
     * @param {string} language - The requested language ('en' or 'sw').
     * @returns {Promise<Object>} - The AI response.
     */
    async talkToAdvisor(message, context, language = 'en') {
        try {
            const response = await fetch(`${this.apiBase}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    context: context,
                    language: language
                })
            });

            if (!response.ok) {
                const errorData = await this.safeParseJSON(response);
                throw new Error(errorData.error || 'Chat analysis failed.');
            }

            return await this.safeParseJSON(response);
        } catch (error) {
            console.error("Chat API Error:", error);
            throw new Error(error.message || "Failed to connect to advisor.");
        }
    }
}

export default GeminiService;
