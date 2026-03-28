# DFU Staging Assistant 🏥🦶

**AI-Powered Clinical Decision Support for Diabetic Foot Ulcer (DFU) Classification.**

The DFU Staging Assistant is a specialized tool providing rapid, standardized **Wagner-Meggitt staging** and clinical recommendations via Google Gemini 2.5 Flash.

---

## 🌟 Key Features

- **Standardized Staging**: Detailed classification across Grades 0–5.
- **Bilingual (EN/SW)**: Multi-language support with localized AI reasoning.
- **Clinical Advisor**: Interactive chatbot for follow-up guidance.
- **Medical Reports**: Professional, printable clinical reports.
- **Zero-Config Deployment**: Optimized for Vercel Serverless Functions.

---

## 🚀 Quick Setup

### 1. Prerequisites
- Google Gemini API Key

### 2. Local Development
```bash
cd frontend
npm install

# Create a .env file with:
# GEMINI_API_KEY=your_key_here
# PORT=3001

# Terminal 1: Start API
npm run server

# Terminal 2: Start UI
npm run dev
```

### 3. Deployment (Vercel)
The project is ready for one-click deployment:
1.  Set **Root Directory** to `frontend`.
2.  Add `GEMINI_API_KEY` to **Environment Variables**.
3.  Deploy!

---

## ⚠️ Disclaimer
**FOR INFORMATIONAL PURPOSES ONLY.** Not a substitute for professional medical advice. All assessments must be verified by a clinician.

&copy; 2026 HealthAI Systems.
