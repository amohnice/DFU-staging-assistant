import React, { useRef } from 'react'
import { Upload, X, FileImage, ShieldCheck } from 'lucide-react'
import { cn } from '../utils/cn'
import { translations } from '../utils/translations'

const UploadZone = ({ onImageSelect, selectedImage, clearImage, language = 'en' }) => {
    const fileInputRef = useRef(null)
    const t = translations[language]

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file)
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            onImageSelect(file)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto UploadZone-container">
            {!selectedImage ? (
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-slate-300 bg-white hover:border-medical-400 hover:bg-medical-50 transition-all rounded-3xl p-12 text-center cursor-pointer group"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="w-16 h-16 bg-slate-100 group-hover:bg-medical-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-medical-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t.upload_title}</h3>
                    <p className="text-slate-500 font-medium mb-6">{t.upload_desc}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <ShieldCheck className="w-4 h-4" />
                        Privacy Mode Active
                    </div>
                </div>
            ) : (
                <div className="relative bg-white border border-slate-200 rounded-3xl p-4 shadow-sm animate-in zoom-in-95 duration-500">
                    <button
                        onClick={clearImage}
                        className="absolute -top-3 -right-3 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 relative group">
                        <img
                            src={selectedImage}
                            alt="Selected wound"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <FileImage className="w-5 h-5" />
                                Captured Image
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadZone
