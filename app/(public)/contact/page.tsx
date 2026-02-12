"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
    Phone, MapPin, Send, MessageCircle, 
    ShieldCheck, Youtube, Instagram, SendHorizontal,
    User, AtSign, Globe
} from "lucide-react"

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        telegram: '',
        subject: 'Umumiy savol',
        message: ''
    })
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const BOT_TOKEN = "8542032478:AAH8CiqFMrRLxTZ6k6bbRKHtl5P9X8Yc98s"
    const CHAT_ID = "6813390517"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormStatus('submitting')

        const message = `🚀 *Yangi murojaat*\n\n👤 *Ism:* ${formData.name}\n📞 *Tel:* ${formData.phone}\n✈️ *Telegram:* ${formData.telegram}\n📝 *Mavzu:* ${formData.subject}\n💬 *Xabar:* ${formData.message}`

        try {
            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            })

            if (res.ok) {
                setFormStatus('success')
                setFormData({ name: '', phone: '', telegram: '', subject: 'Umumiy savol', message: '' })
                setTimeout(() => setFormStatus('idle'), 4000)
            } else {
                throw new Error()
            }
        } catch {
            setFormStatus('error')
            setTimeout(() => setFormStatus('idle'), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
            
            {/* Header Section */}
            <section className="pt-24 pb-12 px-4">
                <motion.div 
                    initial="hidden" animate="visible" variants={fadeInUp}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Biz bilan bog'laning
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Savollaringiz bormi? Bizning jamoamiz sizga yordam berishdan mamnun.
                    </p>
                </motion.div>
            </section>

            <section className="pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Left Side: Info & Socials */}
                        <div className="lg:col-span-5 space-y-8">
                            
                            {/* Contact Details Card */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Aloqa ma'lumotlari</h3>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Telefon</p>
                                        <p className="font-semibold">+998 88 542 08 18</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tezkor yordam</p>
                                        <p className="font-semibold">@enwis_support</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Manzil</p>
                                        <p className="font-semibold text-sm leading-relaxed text-slate-600">
                                            Farg'ona sh., Qirguli mavzesi, Politexnika instituti yaqinida.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Grid - Minimalist style */}
                            <div className="grid grid-cols-3 gap-4">
                                <SocialLink 
                                    href="https://t.me/enwis_uz" 
                                    icon={<SendHorizontal size={20} />} 
                                    label="Telegram" 
                                    color="hover:text-blue-500 hover:bg-blue-50" 
                                />
                                <SocialLink 
                                    href="https://instagram.com/enwis_uz" 
                                    icon={<Instagram size={20} />} 
                                    label="Instagram" 
                                    color="hover:text-rose-500 hover:bg-rose-50" 
                                />
                                <SocialLink 
                                    href="https://youtube.com/@enwis_uz" 
                                    icon={<Youtube size={20} />} 
                                    label="YouTube" 
                                    color="hover:text-red-500 hover:bg-red-50" 
                                />
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-7 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-10"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormInput 
                                        label="Ismingiz" icon={<User size={14}/>} 
                                        placeholder="Ali Valiyev"
                                        value={formData.name}
                                        onChange={(v) => setFormData({...formData, name: v})}
                                    />
                                    <FormInput 
                                        label="Telefon raqam" icon={<Phone size={14}/>} 
                                        placeholder="+998 90 123 45 67"
                                        value={formData.phone}
                                        onChange={(v) => setFormData({...formData, phone: v})}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormInput 
                                        label="Telegram Username" icon={<AtSign size={14}/>} 
                                        placeholder="@username"
                                        value={formData.telegram}
                                        onChange={(v) => setFormData({...formData, telegram: v})}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Mavzu</label>
                                        <select 
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm font-medium appearance-none"
                                        >
                                            <option>Umumiy savol</option>
                                            <option>To'lovlar</option>
                                            <option>Platforma xatosi</option>
                                            <option>Takliflar</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Xabar</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="Xabaringizni yozing..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm font-medium resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                                    className={`w-full h-14 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95
                                    ${formStatus === 'success' ? 'bg-green-500 shadow-green-200' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'}`}
                                >
                                    {formStatus === 'idle' && <>Yuborish <Send size={18}/></>}
                                    {formStatus === 'submitting' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {formStatus === 'success' && <>Yuborildi! <ShieldCheck size={18}/></>}
                                    {formStatus === 'error' && <>Xatolik! Qayta urinib ko'ring</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}

// Reusable Components to keep code clean
function SocialLink({ href, icon, label, color }: { href: string, icon: any, label: string, color: string }) {
    return (
        <a 
            href={href} target="_blank" rel="noreferrer"
            className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 transition-all duration-300 text-slate-400 ${color} group shadow-sm hover:shadow-md`}
        >
            <div className="mb-2 group-hover:scale-110 transition-transform tracking-wider uppercase text-[10px] font-black">
                {icon}
            </div>
            <span className="text-[10px] font-bold tracking-tight">{label}</span>
        </a>
    )
}

function FormInput({ label, icon, placeholder, value, onChange, type = "text" }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wider flex items-center gap-1">
                {icon} {label}
            </label>
            <input 
                required type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-sm font-medium"
            />
        </div>
    )
}