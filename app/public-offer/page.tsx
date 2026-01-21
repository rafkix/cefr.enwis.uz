import React from 'react';
import { ShieldCheck, Scale, CreditCard, Lock, Info } from 'lucide-react';

export default function PublicOfferPage() {
    const lastUpdated = "21-Yanvar, 2026";

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Sarlavha qismi */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 mb-8 border border-slate-100">
                    <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase italic tracking-tight">
                        Ommaviy Oferta
                    </h1>
                    <p className="text-slate-500 font-medium italic">
                        OMMAVIY OFERTA (FOYDALANISH SHARTLARI)
                        Mazkur hujjat "Enwis" (keyingi o‘rinlarda – Platforma) ma’muriyati tomonidan jismoniy shaxslarga (keyingi o‘rinlarda – Foydalanuvchi) xizmat ko‘rsatish shartlarini belgilovchi rasmiy ommaviy oferta hisoblanadi.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-4 py-2 rounded-full border border-blue-100">
                        <Info size={14} />
                        Oxirgi yangilanish: {lastUpdated}
                    </div>
                </div>

                {/* Asosiy matn */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-12">

                    {/* 1-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><Scale size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">1. ATAMALAR VA TA'RIFLAR</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                            <p>
                                Platforma – enwis.uz manzilida joylashgan, IELTS va CEFR imtihonlariga tayyorlanish uchun mo'ljallangan dasturiy majmua.

                                Foydalanuvchi – Platformada ro‘yxatdan o‘tgan va xizmatlardan foydalanayotgan har qanday jismoniy shaxs.

                                Shaxsiy kabinet – Foydalanuvchining test natijalari, shaxsiy ma'lumotlari va faoliyati saqlanadigan individual bo'lim.

                                Kontent – Platformada joylashtirilgan testlar, matnlar, audio materiallar va dasturiy kodlar.</p>
                        </div>
                    </section>

                    {/* 2-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><ShieldCheck size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">2. SHARTNOMANING PREDMETI</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                            <p>2.1. Platforma Foydalanuvchiga ingliz tili darajasini aniqlash va imtihonlarga tayyorlanish uchun onlayn simulyatsiya testlarini taqdim etadi.</p>
                            <p>2.2. Mazkur shartnoma Foydalanuvchi Platformada ro‘yxatdan o‘tgan yoki xizmatlardan haqiqiy foydalanishni boshlagan paytdan boshlab tuzilgan hisoblanadi.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Platformadagi testlar va materiallar intellektual mulk hisoblanadi.</li>
                                <li>Materiallarni nusxalash yoki tarqatish qat'iyan man etiladi.</li>
                                <li>Ma'muriyat qoidalarni buzgan foydalanuvchini bloklash huquqiga ega.</li>
                            </ul>
                        </div>
                    </section>



                    {/* 3-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><CreditCard size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">3. FOYDALANUVCHINING HUQUQ VA MAJBURIYATLARI</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                            <p>3.1. Foydalanuvchi majburiyatlari:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Ro‘yxatdan o‘tishda haqiqiy va dolzarb ma’lumotlarni taqdim etish.</li>
                                <li>Shaxsiy login va parolni uchinchi shaxslarga oshkor qilmaslik.</li>
                                <li>Platformadagi kontentni nusxalash, tarqatish yoki tijoriy maqsadlarda foydalanmaslik.</li>
                                <li>Platformaning texnik ishiga xalaqit beruvchi har qanday harakatlardan tiyilish.</li>
                            </ul>
                            <p>3.2. Foydalanuvchi huquqlari:</p>
                            <ul>
                                <li>Platformadagi mavjud bepul va sotib olingan pullik xizmatlardan cheklovsiz foydalanish.</li>
                                <li>Texnik nosozliklar yuzaga kelganda qo'llab-quvvatlash xizmatiga murojaat qilish.</li>
                            </ul>
                            <p>3.3 Pullik xizmatlar uchun to‘lovlar Click, Payme yoki boshqa integratsiya qilingan tizimlar orqali amalga oshiriladi.</p>

                            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
                                <p className="text-rose-700 font-bold">Muhim:</p>
                                <p className="text-rose-600 text-xs">Raqamli kontent (testlar) taqdim etilganligi sababli, foydalanuvchi tizimga kirish huquqini olganidan keyin to‘lov qaytarilmaydi.</p>
                            </div>
                        </div>
                    </section>

                    {/* 4-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><Lock size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">4. PLATFORMANING HUQUQ VA MAJBURIYATLARI</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed">
                            <p>4.1. Platforma majburiyatlari:</p>
                            <ul>
                                <li>Xizmatlarning uzluksiz ishlashini ta'minlash (texnik profilaktika ishlaridan tashqari).</li>
                                <li>Foydalanuvchining shaxsiy ma'lumotlari maxfiyligini saqlash.</li>
                            </ul>
                            <p>4.2. Platforma huquqlari:</p>
                            <ul>
                                <li>Mazkur oferta shartlarini buzgan foydalanuvchini ogohlantirishsiz bloklash.</li>
                                <li>Xizmatlar narxi va testlar tarkibini bir tomonlama o‘zgartirish.</li>
                                <li>Foydalanuvchining faolligi haqidagi statistik ma'lumotlardan platforma sifatini oshirishda foydalanish.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 5-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><Lock size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">5. TO‘LOV VA QAYTARISH SHARTLARI</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed">
                            <p>5.1. Pullik xizmatlar (premium testlar) narxi Platformada ko'rsatilgan.

                                5.2. To‘lovlar integratsiya qilingan to‘lov tizimlari (Click, Payme va h.k.) orqali amalga oshiriladi.

                                5.3. To'lovni qaytarish: O'zbekiston Respublikasi "Iste'molchilar huquqlarini himoya qilish to'g'risida"gi qonunining 15-moddasiga muvofiq, raqamli kontent (testlar, o'quv materiallari) taqdim etilganidan so'ng to'lov qaytarilmaydi. Chunki foydalanuvchi xizmatdan (ma'lumotdan) foydalanish imkoniyatiga ega bo'lgan hisoblanadi.</p>
                        </div>
                    </section>

                    {/* 6-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><Lock size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">6. JAVOBGARLIKNI CHEKLASH</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed">
                            <p>6.1. Platforma Foydalanuvchining haqiqiy imtihonlardagi (IELTS/CEFR) natijalari uchun javobgar emas. Platforma faqat yordamchi o‘quv qurolidir.

                                6.2. Platforma uchinchi tomon (internet provayder, elektr ta'minoti) aybi bilan yuzaga kelgan uzilishlar uchun javobgar emas.</p>
                        </div>
                    </section>

                    {/* 7-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><Lock size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">7. INTELLEKTUAL MULK</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed">
                            <p>7.1. Platformadagi barcha materiallar mualliflik huquqi bilan himoyalangan. Ularni ruxsatsiz tarqatish (Telegram kanallar, guruhlar va h.k.) qat'iyan man etiladi va qonuniy javobgarlikka sabab bo'ladi.</p>
                        </div>
                    </section>

                    {/* 8-bo'lim */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <div className="p-2 bg-slate-100 rounded-xl"><Lock size={20} /></div>
                            <h2 className="text-xl font-black uppercase italic">8. YAKUNIY QOIDALAR</h2>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed">
                            <p>8.1. Ma’muriyat mazkur Ofertani istalgan vaqtda o‘zgartirishi mumkin. O‘zgarishlar e’lon qilingan vaqtdan boshlab kuchga kiradi.

                                8.2. Yuzaga kelgan barcha nizolar muzokaralar yo'li bilan, kelishuv bo'lmaganda esa O'zbekiston Respublikasi sudlari orqali hal etiladi.</p>
                        </div>
                    </section>

                    {/* Footer qismi */}
                    <div className="pt-12 border-t border-slate-100 mt-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center md:text-left">
                            {/* Brend va Copyright */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-black text-slate-900 italic tracking-tighter uppercase">Enwis</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                                    Tayyorlov Platformasi <br />
                                    © 2026 Barcha huquqlar himoyalangan.
                                </p>
                            </div>

                            {/* Kontakt Ma'lumotlari */}
                            <div className="space-y-3 flex flex-col items-center md:items-start">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Bog'lanish</p>
                                <a href="mailto:support@enwis.uz" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-bold text-sm italic underline decoration-slate-200 underline-offset-4">
                                    <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                    support@enwis.uz
                                </a>
                            </div>

                            {/* Sana va Status */}
                            <div className="space-y-3 flex flex-col items-center md:items-end">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Hujjat holati</p>
                                <div className="flex flex-col items-center md:items-end gap-1">
                                    <span className="text-xs font-black text-slate-700 italic uppercase tracking-tight">21-Yanvar, 2026</span>
                                    <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                        Faol holatda
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pastki qat'iy chiziq (Ixtiyoriy) */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}