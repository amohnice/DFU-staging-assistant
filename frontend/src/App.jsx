import React, { useState } from 'react'
import { Stethoscope, AlertCircle, Info, Languages } from 'lucide-react'

import UploadZone from './components/UploadZone'
import ResultsCard from './components/ResultsCard'
import LoadingState from './components/LoadingState'
import AdvisorChat from './components/AdvisorChat'
import GeminiService from './services/GeminiService'
import ImageProcessor from './services/ImageProcessor'
import { translations } from './utils/translations'

function App() {
  const [language, setLanguage] = useState('en')
  const [selectedImage, setSelectedImage] = useState(null)
  const [originalFile, setOriginalFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const t = translations[language]

  const handleImageSelect = async (file) => {
    setOriginalFile(file)
    setError(null)
    setResults(null)

    const reader = new FileReader()
    reader.onload = (e) => setSelectedImage(e.target.result)
    reader.readAsDataURL(file)

    analyzeImage(file)
  }

  const analyzeImage = async (file) => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    try {
      const processed = await ImageProcessor.compress(file)
      const gemini = new GeminiService()
      const classification = await gemini.classifyUlcer(processed.base64, file.type, language)
      setResults(classification)
    } catch (err) {
      setError(err.message || "An unexpected error occurred during analysis.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearAll = () => {
    setSelectedImage(null)
    setOriginalFile(null)
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-medical-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="w-full max-w-4xl flex justify-end mb-4">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${language === 'en' ? 'bg-medical-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="text-sm">🇰🇪</span>
            English
          </button>
          <button
            onClick={() => setLanguage('sw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${language === 'sw' ? 'bg-medical-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="text-sm">🇹🇿</span>
            Kiswahili
          </button>
        </div>
      </div>

      <header className="max-w-2xl w-full mt-4 mb-12 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-medical-100 text-medical-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-medical-200">
          <Stethoscope className="w-3 h-3" />
          AI Diagnostic Support
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          {t.title.split(' ')[0]} <span className="text-medical-600">{t.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          {t.subtitle}
        </p>
      </header>

      <main className="max-w-4xl w-full flex-1 flex flex-col items-center">
        <div className="w-full space-y-8">
          <UploadZone
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            clearImage={clearAll}
            language={language}
          />

          {error && (
            <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in shake duration-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {isAnalyzing && <LoadingState message={t.analyzing} />}

          {results && <ResultsCard results={results} imageUrl={selectedImage} language={language} />}

          {!selectedImage && !isAnalyzing && !results && (
            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-medical-500" />
                  Wagner Grade 0-5
                </h4>
                <p className="text-sm text-slate-600">Strict adherence to the Wagner-Meggitt classification system for accurate risk assessment.</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Risk Detection
                </h4>
                <p className="text-sm text-slate-600">Automatically identifies high-risk features like gangrene or deep tissue involvement.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {results && <AdvisorChat context={results} language={language} />}

      <footer className="max-w-3xl w-full mt-20 pb-12 text-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-12"></div>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">Clinical Disclaimer</p>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
          {t.disclaimer}
        </p>
        <div className="mt-8 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
          &copy; 2026 HealthAI Systems • Precision podiatry
        </div>
      </footer>
    </div>
  )
}

export default App
