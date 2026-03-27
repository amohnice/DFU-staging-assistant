# DFU Staging Assistant 🏥🦶

**AI-Powered Clinical Decision Support for Diabetic Foot Ulcer (DFU) Classification.**

The DFU Staging Assistant is a full-stack, medical-grade SPA designed to provide rapid, standardized **Wagner-Meggitt staging** and clinical recommendations based on wound images. It empowers clinicians with preliminary diagnostic support to prioritize care and prevent limb loss.

---

## 🌟 Key Features

- **Standardized Staging**: Detailed classification across Grades 0–5 of the Wagner-Meggitt scale.
- **Bilingual Interface**: Support for **English 🇰🇪** and **Kiswahili 🇹🇿** (including localized AI reasoning).
- **Clinical Advisor Chatbot**: Interactive conversational support for follow-up medical guidance.
- **Professional Reporting**: Generate print-ready clinical assessment reports with date-stamped wound images.
- **High Performance**: Client-side image compression ensuring sub-2s analysis.
- **Secure Architecture**: Backend proxy for Google Gemini API to protect sensitive credentials.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons.
- **Backend Proxy**: Node.js, Express.
- **Artificial Intelligence**: Google Gemini 2.5 Flash.
- **Design**: "Soft UI" medical-inspired aesthetic with professional print-specific CSS.

---

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js (v18+)
- Google Gemini API Key

### 2. Backend Configuration
```bash
cd backend
npm install
# Create a .env file with:
# GEMINI_API_KEY=your_key_here
# PORT=3001
npm start
```

### 3. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Deployment to Vercel

The project is configured for a seamless monorepo deployment on **Vercel**:

1.  **Environment Variables**: In your Vercel project settings, add `GEMINI_API_KEY`.
2.  **Deployment**: Vercel will automatically detect the `vercel.json` configuration and deploy:
    -   The **Frontend** as a static site.
    -   The **Backend** as Vercel Serverless Functions (via the `api/` directory).

---

## ⚠️ Clinical Disclaimer

**IMPORTANT**: This tool is for **informational and preliminary screening purposes only**. It is not a substitute for professional medical advice, diagnosis, or treatment. All AI-generated assessments **must be verified by a qualified medical professional (GP, Podiatrist, or Vascular Surgeon)**. 

Precision podiatry is a human-led endeavor; this AI is here to provide high-speed clinical support, not final diagnosis.

---

&copy; 2026 HealthAI Systems • Built for Precision Podiatry.
