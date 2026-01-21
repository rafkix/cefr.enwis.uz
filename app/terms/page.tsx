import React from 'react';
import { Gavel, UserX, CopySlash, MonitorPlay, ShieldAlert, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
    const lastUpdated = "21-Yanvar, 2026";

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* HEADER SECTION */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 mb-8 border border-slate-100">
                    <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase italic tracking-tight">
                        Foydalanish Shartlari
                    </h1>
                    <p className="text-slate-500 font-medium italic">
                        Enwis platformasidan foydalanish bo‘yicha majburiy qoidalar va cheklovlar.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 w-fit px-4 py-2 rounded-full border border-amber-100">
                        <Gavel size={14} />
                        Hujjat holati: Rasmiy tartibga soluvchi
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-12">

                    {/* 1. Account Usage */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><UserX size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">1. Akkauntdan foydalanish</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                            <p>Har bir foydalanuvchi faqat bitta shaxsiy akkauntga ega bo‘lishi mumkin. Akkaunt ma'lumotlarini boshqa shaxslarga berish qat'iyan man etiladi.</p>
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl text-amber-800 text-xs font-bold">
                                DIQQAT: Bitta akkauntdan bir necha kishi foydalanishi aniqlansa, tizim akkauntni avtomatik bloklash huquqiga ega.
                            </div>
                        </div>
                    </section>

                    {/* 2. Intellectual Property */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><CopySlash size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">2. Intellektual mulk</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                            <p>Platformadagi barcha testlar, audio materiallar, dizayn va kodlar <b>"Enwis"</b> intellektual mulki hisoblanadi.</p>
                            <ul className="list-disc pl-5 space-y-2 italic font-medium">
                                <li>Materiallarni skrinshot qilish yoki yozib olish taqiqlanadi.</li>
                                <li>Test savollarini Telegram yoki boshqa ijtimoiy tarmoqlarda tarqatish qonun bilan jazolanadi.</li>
                            </ul>
                        </div>
                    </section>



                    {/* 3. Service Access */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><MonitorPlay size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">3. Xizmat ko‘rsatish tartibi</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed space-y-3">
                            <p>Platforma simulyatsiya testlarini 24/7 rejimida taqdim etishga intiladi. Biroq, texnik profilaktika ishlari vaqtida xizmatlar vaqtincha to'xtatilishi mumkin.</p>
                            <p>Premium testlar sotib olingan kundan boshlab belgilangan muddat davomida faol bo‘ladi.</p>
                        </div>
                    </section>

                    {/* 4. Prohibited Actions */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><ShieldAlert size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">4. Taqiqlangan harakatlar</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                Avtomatlashtirilgan scriptlar yoki botlardan foydalanish.
                            </div>
                            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                Platforma xavfsizlik tizimini buzishga urinish.
                            </div>
                        </div>
                    </section>

                    {/* FOOTER INFO */}
                    <div className="pt-12 border-t border-slate-100 mt-12 text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 italic uppercase">Enwis</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    Tayyorlov Platformasi © 2026
                                </p>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-2">
                                <a href="mailto:support@enwis.uz" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-bold text-sm italic">
                                    <Mail size={16} /> support@enwis.uz
                                </a>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                    Yangilangan sana: {lastUpdated}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}