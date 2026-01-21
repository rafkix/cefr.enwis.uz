"use client"

import { Type, Headphones, Video, CheckCircle2 } from "lucide-react"

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
    const sections = [
        { label: "PART 1", range: [1, 8] }, { label: "PART 2", range: [9, 14] },
        { label: "PART 3", range: [15, 19] }, { label: "PART 4", range: [20, 24] },
        { label: "PART 5", range: [25, 30] }, { label: "PART 6", range: [31, 35] }
    ];

    const currentSection = sections[activePartIndex] || sections[0];

    return (
        <div className="w-72 h-screen bg-[#F1F5F9] border-l border-slate-200 flex flex-col p-3 gap-3 shrink-0 overflow-hidden select-none shadow-lg z-40">

            {/* 1. VAQT VA PROGRESS BAR */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {status === "playing" ? "Audio vaqti" : "Tayyorlanish vaqti"}
                </span>
                <div className={`text-2xl font-mono font-black transition-colors ${status === "playing" ? "text-blue-600" : "text-slate-700"}`}>
                    {timeLeft}
                </div>

                {/* Dinamik Progress Bar */}
                {status === "playing" && (
                    <div className="w-full mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* 1. YAKUNLASH */}
            <button
                onClick={onFinish}
                className="w-full bg-blue-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg text-xs transition-all active:scale-95 uppercase tracking-wider"
            >
                Yakunlash
            </button>

            {/* Matn Hajmi Bo'limi */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onIncreaseFontSize}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90 font-bold text-slate-600"
                    >
                        A-
                    </button>
                    <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                        <Type size={14} className="text-slate-400" /> Matn Hajmi
                    </span>
                    <button
                        onClick={onIncreaseFontSize}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90 font-bold text-slate-600"
                    >
                        A+
                    </button>
                </div>
            </div>

            {/* 3. SOZLAMALAR */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-4 shrink-0">
                <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                            <Headphones size={14} className="text-slate-400" /> Tovush
                        </span>
                        <span className="text-[10px] font-bold text-blue-600">{volume}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                </div>
            </div>

            {/* 4. SAVOLLAR */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col shrink-0 min-h-0">
                <div className="px-3 pt-3 pb-2 border-b flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                    <span className="text-[10px] font-black text-slate-600 uppercase italic">Savollar</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{currentSection.label}</span>
                </div>
                <div className="p-[10px] overflow-y-auto max-h-[180px]">
                    <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: currentSection.range[1] - currentSection.range[0] + 1 }, (_, i) => currentSection.range[0] + i).map((q) => (
                            <button key={q} onClick={() => onSelectQuestion(q)} className={`w-8 h-8 rounded-full text-[10px] font-bold border flex items-center justify-center transition-all relative ${q === currentQuestion ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110" : answered[q] ? "bg-emerald-500 text-white border-emerald-500 shadow-sm" : "bg-slate-50 text-slate-400 hover:bg-white"}`}>
                                {q}
                                {answered[q] && q !== currentQuestion && (
                                    <div className="absolute -top-1 -right-1 bg-white rounded-full"><CheckCircle2 size={8} className="text-emerald-600" /></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. KAMERA */}
            <div className="bg-slate-900 aspect-video rounded-xl overflow-hidden relative border-2 border-white shadow-md shrink-5 mt-1">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md border border-white/10">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-[7px] text-white font-black uppercase tracking-widest">Live Proctor</span>
                </div>
                <div className="w-full h-full flex items-center justify-center"><Video className="text-slate-700" size={32} /></div>
            </div>

            {/* 6. STATUS */}
            <div className="mt-auto pb-2 text-center opacity-40">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Kuzatuv ostida</span>
            </div>
        </div>
    )
}