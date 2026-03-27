import React from 'react';
import { AlertTriangle, CheckCircle, Info, Skull, Activity, Printer, Calendar, Clock } from 'lucide-react';
import { cn } from '../utils/cn';
import { translations } from '../utils/translations';

const ResultsCard = ({ results, imageUrl, language = 'en' }) => {
    if (!results) return null;
    const t = translations[language];

    const handlePrint = () => {
        window.print();
    };

    if (results.error) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-900 mb-1">Analysis Error</h3>
                    <p className="text-red-700">{results.error}</p>
                </div>
            </div>
        );
    }

    const { grade, description, risk_level, recommendation } = results;
    const now = new Date();
    const dateStr = now.toLocaleDateString(language === 'sw' ? 'sw-TZ' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString(language === 'sw' ? 'sw-TZ' : 'en-US', { hour: '2-digit', minute: '2-digit' });

    const getRiskStyles = (level) => {
        const lowerLevel = level?.toLowerCase() || '';
        const low = ['low', 'ndogo', 'chini'].some(word => lowerLevel.includes(word));
        const moderate = ['moderate', 'wastani', 'ya kati'].some(word => lowerLevel.includes(word));
        const high = ['high', 'kubwa', 'juu'].some(word => lowerLevel.includes(word));
        const critical = ['critical', 'hatari', 'mbaya'].some(word => lowerLevel.includes(word));

        if (low) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (moderate) return 'bg-amber-100 text-amber-700 border-amber-200';
        if (high) return 'bg-orange-100 text-orange-700 border-orange-200';
        if (critical) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getGradeIcon = (g) => {
        const num = parseInt(g?.toString().match(/\d+/)?.[0] || '0');
        if (num === 0) return <CheckCircle className="w-8 h-8 text-emerald-500" />;
        if (num <= 2) return <Info className="w-8 h-8 text-amber-500" />;
        if (num <= 4) return <Activity className="w-8 h-8 text-orange-500" />;
        return <Skull className="w-8 h-8 text-red-600" />;
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 print:shadow-none print:border-none print:mt-0 print:max-w-none">
            {/* Print-only Header */}
            <div className="hidden print:flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">{t.title} - Clinical Report</h1>
                    <p className="text-slate-500 text-sm font-medium">Precision Podiatry Diagnostic Support</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-600 font-bold text-xs uppercase tracking-wider mb-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-slate-400 font-medium text-xs">
                        <Clock className="w-3 h-3" />
                        {timeStr}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 text-white flex justify-between items-center print:bg-slate-100 print:text-slate-900 print:rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl print:bg-slate-200">
                        {getGradeIcon(grade)}
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold print:text-slate-500">{t.grade}</p>
                        <h2 className="text-2xl font-black tracking-tight">{grade || 'N/A'}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap",
                        getRiskStyles(risk_level)
                    )}>
                        {risk_level || 'Unknown'} {t.risk}
                    </span>
                    <button
                        onClick={handlePrint}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors print:hidden"
                        title={t.print_report}
                    >
                        <Printer className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Image in Printout */}
                <div className="hidden print:block mb-8">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-medical-500"></div>
                        Submitted Wound Image
                    </h3>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                        <img src={imageUrl} alt="Wound" className="max-h-60 w-auto mx-auto object-contain" />
                    </div>
                </div>

                <section>
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-medical-500"></div>
                        {t.observation}
                    </h3>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                        {description}
                    </p>
                </section>

                <section className="p-6 bg-medical-50 border border-medical-100 rounded-2xl print:bg-slate-50 print:border-slate-200">
                    <h3 className="text-xs uppercase tracking-widest text-medical-600 font-bold mb-3 flex items-center gap-2 print:text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-medical-500 print:bg-slate-400"></div>
                        {t.recommendation}
                    </h3>
                    <p className="text-lg text-slate-800 font-bold leading-tight">
                        {recommendation}
                    </p>
                </section>

                <div className="pt-4 flex items-center gap-2 text-amber-600 print:text-slate-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <p className="text-[10px] leading-tight font-medium uppercase tracking-tight">
                        {language === 'en' ? 'FOR INFORMATIONAL PURPOSES ONLY. THIS REPORT MUST BE REVIEWED BY A CLINICIAN.' : 'KWA MADHUMUNI YA HABARI TU. RIPOTI HII LAZIMA IKAGULIWE NA TABIBU.'}
                    </p>
                </div>

                <div className="hidden print:block pt-12 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest font-black">
                        Generated by DFU Staging Assistant AI • HealthAI Systems
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultsCard;
