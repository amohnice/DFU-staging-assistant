import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import classifyHandler from './api/classify.js';
import chatHandler from './api/chat.js';
import modelsHandler from './api/models.js';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Local mappings to the serverless functions
app.post('/api/classify', (req, res) => classifyHandler(req, res));
app.post('/api/chat', (req, res) => chatHandler(req, res));
app.get('/api/models', (req, res) => modelsHandler(req, res));

app.listen(port, () => {
    console.log(`Local Dev API running at http://localhost:${port}`);
    console.log('Ensure your .env file in the "frontend" folder has GEMINI_API_KEY');
});
