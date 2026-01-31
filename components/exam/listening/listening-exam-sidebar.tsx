"use client"

import { useState } from "react"
import { Type, Headphones, Video, CheckCircle2, ChevronUp, X } from "lucide-react"

interface SidebarProps {
    currentQuestion: number;
    answered: Record<number, boolean>;
    timeLeft: string;
    fontSize: number;
    volume: number;
    progress: number;
    activePartIndex: number;
    status: string;
    onSelectQuestion: (num: number) => void;
    onFinish: () => void;
    onIncreaseFontSize: () => void;
    onDecreaseFontSize: () => void;
    onVolumeChange: (val: number) => void;
}

export default function ListeningExamSidebar({
    currentQuestion, answered, timeLeft, fontSize, volume, progress, activePartIndex, status,
    onSelectQuestion, onFinish, onIncreaseFontSize, onDecreaseFontSize, onVolumeChange
}: SidebarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const sections = [
        { label: "PART 1", range: [1, 8] }, { label: "PART 2", range: [9, 14] },
        { label: "PART 3", range: [15, 19] }, { label: "PART 4", range: [20, 24] },
        { label: "PART 5", range: [25, 30] }, { label: "PART 6", range: [31, 35] }
    ];

    const currentSection = sections[activePartIndex] || sections[0];

    // --- REUSABLE COMPONENTS ---

    const SettingsContent = () => (
        <>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                    <button onClick={onDecreaseFontSize} className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90 font-bold text-slate-600">A-</button>
                    <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5"><Type size={14} className="text-slate-400" /> Matn Hajmi</span>
                    <button onClick={onIncreaseFontSize} className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90 font-bold text-slate-600">A+</button>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-4 shrink-0">
                <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5"><Headphones size={14} className="text-slate-400" /> Tovush</span>
                        <span className="text-[10px] font-bold text-blue-600">{volume}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                </div>
            </div>
        </>
    );

    const QuestionsContent = () => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col shrink-0 min-h-0 flex-1">
            <div className="px-3 pt-3 pb-2 border-b flex items-center justify-between bg-slate-50/50 rounded-t-xl sticky top-0 z-10">
                <span className="text-[10px] font-black text-slate-600 uppercase italic">Savollar</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{currentSection.label}</span>
            </div>
            <div className="p-[10px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: currentSection.range[1] - currentSection.range[0] + 1 }, (_, i) => currentSection.range[0] + i).map((q) => (
                        <button key={q} onClick={() => { onSelectQuestion(q); setIsMobileOpen(false); }} className={`w-8 h-8 rounded-full text-[10px] font-bold border flex items-center justify-center transition-all relative ${q === currentQuestion ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110" : answered[q] ? "bg-emerald-500 text-white border-emerald-500 shadow-sm" : "bg-slate-50 text-slate-400 hover:bg-white"}`}>
                            {q}
                            {answered[q] && q !== currentQuestion && (
                                <div className="absolute -top-1 -right-1 bg-white rounded-full"><CheckCircle2 size={8} className="text-emerald-600" /></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* =====================================================================================
                1. DESKTOP SIDEBAR
               ===================================================================================== */}
            <div className="hidden lg:flex w-72 h-screen bg-[#F1F5F9] border-l border-slate-200 flex-col p-3 gap-3 shrink-0 overflow-hidden select-none shadow-lg z-40">
                
                {/* Vaqt */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center shrink-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {status === "playing" ? "Audio vaqti" : "Tayyorlanish vaqti"}
                    </span>
                    <div className={`text-2xl font-mono font-black transition-colors ${status === "playing" ? "text-blue-600" : "text-slate-700"}`}>
                        {timeLeft}
                    </div>
                    {status === "playing" && (
                        <div className="w-full mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-blue-500 transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>

                <button onClick={onFinish} className="w-full bg-blue-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg text-xs transition-all active:scale-95 uppercase tracking-wider shrink-0">
                    Yakunlash
                </button>

                <SettingsContent />

                <div className="overflow-y-auto min-h-0">
                    <QuestionsContent />
                </div>

                {/* 🔥 TUZATILDI: 
                    1. shrink-5 -> shrink-0 (Siqilib qolmasligi uchun)
                    2. mt-auto (Har doim pastda turishi uchun)
                */}
                <div className="space-y-1">
                    <div className="bg-slate-900 aspect-video rounded-xl overflow-hidden relative border-2 border-white shadow-md">
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md border border-white/10">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                            <span className="text-[7px] text-white font-black uppercase tracking-widest">Live Proctor</span>
                        </div>
                        <div className="w-full h-full flex items-center justify-center"><Video className="text-slate-700" size={32} /></div>
                    </div>

                    <div className="pb-2 text-center opacity-40">
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Kuzatuv ostida</span>
                    </div>
                </div>
            </div>

            {/* =====================================================================================
                2. MOBILE BOTTOM BAR
               ===================================================================================== */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-[50] flex items-center px-4 justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-safe">
                {status === "playing" && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                        <div className="h-full bg-blue-500 transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Vaqt</span>
                    <span className={`text-lg font-mono font-black ${status === "playing" ? "text-blue-600" : "text-slate-800"}`}>
                        {timeLeft}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileOpen(true)} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-[11px] active:bg-slate-200 transition-colors border border-slate-200">
                        Savollar <ChevronUp size={14} />
                    </button>
                    <button onClick={onFinish} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-[11px] shadow-lg shadow-blue-200 active:scale-95 transition-all">
                        Yakunlash
                    </button>
                </div>
            </div>

            {/* =====================================================================================
                3. MOBILE BOTTOM SHEET
               ===================================================================================== */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-[60] flex flex-col justify-end animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
                    <div className="relative bg-[#F1F5F9] w-full rounded-t-[32px] overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300 shadow-2xl">
                        <div className="bg-white p-4 border-b flex items-center justify-between shrink-0">
                            <span className="text-sm font-black text-slate-800 uppercase italic">Boshqaruv Paneli</span>
                            <button onClick={() => setIsMobileOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-90 transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex flex-col gap-4 pb-8">
                            <SettingsContent />
                            <div className="h-64 flex flex-col">
                                <QuestionsContent />
                            </div>
                            <div className="flex items-center justify-center gap-2 p-3 bg-slate-200 rounded-xl opacity-60 mt-2">
                                <Video size={16} className="text-slate-600" />
                                <span className="text-[10px] font-bold text-slate-600">Proctoring faol (Kamera ishlamoqda)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}