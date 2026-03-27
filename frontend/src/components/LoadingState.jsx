import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = "Analyzing wound morphology..." }) => {
    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl shadow-sm animate-in fade-in duration-500">
            <div className="relative">
                <Loader2 className="w-12 h-12 text-medical-600 animate-spin" />
                <div className="absolute inset-0 bg-medical-500/10 rounded-full blur-xl animate-pulse"></div>
            </div>

            <div className="mt-6 flex flex-col items-center">
                <p className="text-slate-900 font-bold text-lg animate-pulse">
                    {message}
                </p>
                <div className="flex gap-1 mt-2">
                    <div className="w-1.5 h-1.5 bg-medical-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-medical-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-medical-400 rounded-full animate-bounce"></div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-8 w-full">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-medical-500 w-full animate-[progress_2s_ease-in-out_infinite] origin-left"></div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-medical-300 w-full animate-[progress_2s_ease-in-out_infinite_0.5s] origin-left"></div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-medical-100 w-full animate-[progress_2s_ease-in-out_infinite_1s] origin-left"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingState;
