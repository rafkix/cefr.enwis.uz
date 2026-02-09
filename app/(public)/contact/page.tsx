"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    LayoutGrid, ArrowRight, Phone, Mail, MapPin,
    Send, MessageCircle, Clock, ShieldCheck,
    Facebook, Instagram, Linkedin, BrainCircuit
} from "lucide-react"

// --- ANIMATIONS ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
}

export default function ContactPage() {
    const router = useRouter()
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormStatus('submitting')
        // Simulyatsiya
        setTimeout(() => setFormStatus('success'), 1500)
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-[#17776A] selection:text-white overflow-x-hidden">
            
            {/* ================= 2. HERO HEADER ================= */}
            <section className="pt-40 pb-16 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#17776A]/5 rounded-full blur-3xl -z-10" />

                <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl mx-auto">
                    <span className="text-[#17776A] font-bold tracking-widest uppercase text-xs bg-[#17776A]/10 px-3 py-1 rounded-full">24/7 Qo'llab-quvvatlash</span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-6 mb-6 tracking-tight">
                        Biz bilan <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#17776A] to-teal-500">Aloqaga Chiqing</span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Savollaringiz bormi? Texnik muammo kuzatildimi? Yoki shunchaki fikr bildirmoqchimisiz? Biz har doim yordamga tayyormiz.
                    </p>
                </motion.div>
            </section>

            {/* ================= 3. CONTACT GRID & FORM ================= */}
            <section className="py-10 px-4">
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-5 gap-8">

                        {/* LEFT COLUMN: INFO CARDS (BENTO) */}
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-2 flex flex-col gap-6"
                        >
                            {/* Card 1: Location */}
                            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Manzil</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Farg'ona shahar,<br />
                                    Qirguli mavzesi, 108-uy.<br />
                                    <span className="text-xs text-slate-400 mt-2 block">(Mo'ljal: Politexnika instituti yoni)</span>
                                </p>
                            </motion.div>

                            {/* Card 2: Contact Info */}
                            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="bg-[#17776A] p-8 rounded-[32px] shadow-xl shadow-[#17776A]/20 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                        <Phone size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-6">Aloqa kanallari</h3>

                                    <div className="space-y-4">
                                        <a href="tel:+998885420818" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="p-2 bg-white/10 rounded-lg"><Phone size={16} /></div>
                                            <span className="font-mono font-bold text-lg">+998 (88) 542-08-18</span>
                                        </a>
                                        <a href="mailto:info@enwis.uz" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="p-2 bg-white/10 rounded-lg"><Mail size={16} /></div>
                                            <span className="font-medium">info@enwis.uz</span>
                                        </a>
                                        <a href="https://t.me/enwis_support" target="_blank" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="p-2 bg-white/10 rounded-lg"><MessageCircle size={16} /></div>
                                            <span className="font-medium">@enwis_support</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 3: Socials */}
                            <motion.div variants={fadeInUp} className="flex gap-4">
                                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                                    <button key={i} className="flex-1 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#17776A] hover:border-[#17776A] hover:shadow-lg transition-all">
                                        <Icon size={24} />
                                    </button>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* RIGHT COLUMN: FORM */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-3 bg-white rounded-[40px] border border-slate-200 shadow-2xl p-8 md:p-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-50 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>

                            <h2 className="text-3xl font-black text-slate-900 mb-2">Xabar yuborish</h2>
                            <p className="text-slate-500 mb-8">Ma'lumotlaringizni qoldiring, tez orada operatorlarimiz aloqaga chiqishadi.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ismingiz</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ali Valiyev"
                                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#17776A] focus:ring-4 focus:ring-[#17776A]/10 outline-none transition-all font-medium text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefon raqam</label>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+998 (__) ___-__-__"
                                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#17776A] focus:ring-4 focus:ring-[#17776A]/10 outline-none transition-all font-medium text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mavzu</label>
                                    <select className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#17776A] focus:ring-4 focus:ring-[#17776A]/10 outline-none transition-all font-medium text-slate-800 appearance-none cursor-pointer">
                                        <option>Umumiy savol</option>
                                        <option>Texnik yordam</option>
                                        <option>Hamkorlik</option>
                                        <option>To'lov masalalari</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Xabar matni</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Savolingizni batafsil yozing..."
                                        className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#17776A] focus:ring-4 focus:ring-[#17776A]/10 outline-none transition-all font-medium text-slate-800 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                                    className={`w-full h-16 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                                    ${formStatus === 'success'
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-[#17776A] text-white hover:bg-[#125d53] shadow-[#17776A]/30'
                                        }`}
                                >
                                    {formStatus === 'idle' && (
                                        <>Yuborish <Send size={20} /></>
                                    )}
                                    {formStatus === 'submitting' && (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {formStatus === 'success' && (
                                        <>Muvaffaqiyatli yuborildi <ShieldCheck size={20} /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= 4. MAP SECTION ================= */}
            <section className="py-12 px-4">
                <div className="mx-auto max-w-7xl">
                    <div className="h-[400px] w-full bg-slate-200 rounded-[40px] overflow-hidden border border-slate-200 shadow-inner relative group">
                        {/* Google Maps Iframe */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.748317523097!2d71.7800!3d40.3860!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDIzJzA5LjYiTiA3McKwNDYnNDguMCJF!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(100%) contrast(1.2) opacity(0.8)' }}
                            allowFullScreen
                            loading="lazy"
                            className="group-hover:filter-none transition-all duration-700"
                        ></iframe>

                        {/* Overlay Badge */}
                        <div className="absolute bottom-6 left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white animate-bounce">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Ofisimiz</p>
                                <p className="font-bold text-slate-900">Farg'ona, Qirguli</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 5. FAQ SECTION ================= */}
            <section className="py-20 px-4 bg-white border-t border-slate-100">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-black text-center text-slate-900 mb-12">Ko'p so'raladigan savollar</h2>

                    <div className="space-y-4">
                        {[
                            { q: "Platforma qanday ishlaydi?", a: "Siz ro'yxatdan o'tasiz, test topshirasiz va sun'iy intellekt sizning natijalaringizni bir zumda tahlil qilib beradi." },
                            { q: "Speaking va Writing qanday tekshiriladi?", a: "Bizning AI algoritmlarimiz Kembrij mezonlari asosida o'qitilgan. Ular grammatika, talaffuz va lug'at boyligini tekshiradi." },
                            { q: "Natijalar rasmiy hisoblanadimi?", a: "Yo'q, bu diagnostik test. Natijalar o'z darajangizni bilish va imtihonga tayyorlanish uchun mo'ljallangan." },
                            { q: "To'lov qanday amalga oshiriladi?", a: "Payme, Click yoki Uzum orqali onlayn to'lov qilishingiz mumkin." }
                        ].map((item, i) => (
                            <details key={i} className="group bg-[#F8FAFC] border border-slate-200 rounded-2xl overflow-hidden cursor-pointer open:bg-white open:shadow-lg transition-all duration-300">
                                <summary className="flex items-center justify-between p-6 font-bold text-slate-700 list-none">
                                    {item.q}
                                    <span className="bg-white group-open:bg-[#17776A] group-open:text-white w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 group-open:border-[#17776A] transition-all">
                                        <ArrowRight size={16} className="group-open:rotate-90 transition-transform" />
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}