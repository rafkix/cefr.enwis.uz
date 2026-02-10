"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Camera, Save, X, Edit3, Loader2,
    Phone, ShieldCheck, CheckCircle2, AlertCircle,
    Smartphone, UserCircle2, ExternalLink, Info, Send, Mail, Trash2
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI,
    uploadAvatarAPI,
    getMySessionsAPI,
    getMyContactsAPI,
    terminateSessionAPI, // API'da bor deb hisoblaymiz
} from "@/lib/api/user"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
    const [terminatingId, setTerminatingId] = useState<string | null>(null)
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const [newPhone, setNewPhone] = useState("+998")

    const [formData, setFormData] = useState({
        full_name: "",
        bio: "",
        birth_date: "",
        gender: "",
    })

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    const loadInitialData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([
                getMySessionsAPI(),
                getMyContactsAPI()
            ])
            setSessions(sessRes.data?.sessions || sessRes.data || [])
            setContacts(contRes.data?.contacts || contRes.data || [])
        } catch (err) {
            console.error("Ma'lumot yuklashda xatolik:", err)
        }
    }, [])

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.profile?.full_name || "",
                bio: user.profile?.bio || "",
                birth_date: user.profile?.birth_date ? user.profile.birth_date.split('T')[0] : "",
                gender: user.profile?.gender || "",
            })
            loadInitialData()
        }
    }, [user, loadInitialData])

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        setUploading(true)
        try {
            await uploadAvatarAPI(uploadFormData)
            await refreshUser()
        } catch (error: any) {
            alert(error.response?.data?.detail || "Rasm yuklashda xatolik")
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateProfileAPI(formData)
            await refreshUser()
            setIsEditing(false)
        } catch (error: any) {
            alert(error.response?.data?.detail || "Saqlashda xatolik")
        } finally { setLoading(false) }
    }

    const handleTerminateSession = async (sessionId: string) => {
        if (!confirm("Ushbu seansni yakunlamoqchimisiz?")) return
        setTerminatingId(sessionId)
        try {
            await terminateSessionAPI(sessionId)
            setSessions(prev => prev.filter(s => s.id !== sessionId))
        } catch (error: any) {
            alert(error.response?.data?.detail || "Xatolik yuz berdi")
        } finally { setTerminatingId(null) }
    }

    const handleOpenBot = (type: 'verify' | 'update') => {
        const cleanPhone = newPhone.replace(/[^\d+]/g, '')
        const url = type === 'verify'
            ? "https://t.me/EnwisAuthBot?start=verify_phone"
            : `https://t.me/EnwisAuthBot?start=${cleanPhone}`;
        window.open(url, "_blank")
    }

    return (
        <div className="w-full pb-20 relative">
            {/* NOISE EFFECT OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

            <div className="relative z-[2]">
                {/* HEADER SECTION */}
                <header className="bg-white rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="relative group">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[40px] lg:rounded-[54px] bg-gradient-to-br from-teal-50 to-slate-50 overflow-hidden ring-8 ring-white shadow-inner flex items-center justify-center">
                                {uploading ? (
                                    <Loader2 className="animate-spin text-teal-600" size={32} />
                                ) : user?.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" alt="Avatar" />
                                ) : (
                                    <UserCircle2 size={80} className="text-slate-200" />
                                )}
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-3 rounded-2xl shadow-xl hover:bg-teal-700 hover:scale-110 transition-all active:scale-95">
                                <Camera size={20} />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                                {user?.profile?.full_name || "Foydalanuvchi"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase">
                                    @{user?.profile?.username}
                                </span>
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95">
                                        <Edit3 size={18} /> Profilni tahrirlash
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button onClick={handleSave} disabled={loading} className="bg-teal-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95 transition-all">
                                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Saqlash
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className="bg-white border-2 border-slate-100 text-slate-500 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">Bekor qilish</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: INFO & SESSIONS */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><User size={20} /></div>
                                Shaxsiy ma'lumotlar
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To'liq ism (F.I.SH)</label>
                                    <input value={formData.full_name} onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))} disabled={!isEditing} className="w-full h-14 px-5 bg-slate-50/50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 disabled:opacity-50 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tug'ilgan sana</label>
                                    <input type="date" value={formData.birth_date} onChange={(e) => setFormData(p => ({ ...p, birth_date: e.target.value }))} disabled={!isEditing} className="w-full h-14 px-5 bg-slate-50/50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 disabled:opacity-50 transition-all" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio (Ma'lumot)</label>
                                    <textarea rows={3} value={formData.bio} onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))} disabled={!isEditing} className="w-full p-5 bg-slate-50/50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 disabled:opacity-50 resize-none transition-all" placeholder="O'zingiz haqingizda qisqacha..." />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm overflow-hidden">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ShieldCheck size={20} /></div>
                                Faol seanslar
                            </h3>
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <div key={session.id} className="p-5 bg-slate-50/50 rounded-2xl flex items-center gap-5 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                                        <div className="p-3 bg-white rounded-2xl text-slate-400 group-hover:text-teal-600 transition-colors shadow-sm">
                                            <Smartphone size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
                                                    {session.user_agent.split(' ')[0]}
                                                </p>
                                                {session.is_current && (
                                                    <span className="bg-teal-500 text-white text-[8px] px-2 py-0.5 rounded-md font-black uppercase">Siz</span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-[10px] font-bold mt-0.5">{session.ip_address} • {new Date(session.last_active).toLocaleDateString()}</p>
                                        </div>
                                        {!session.is_current && (
                                            <button 
                                                onClick={() => handleTerminateSession(session.id)}
                                                disabled={terminatingId === session.id}
                                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                            >
                                                {terminatingId === session.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: CONTACTS */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-[#17776A] text-white rounded-[40px] p-8 shadow-2xl shadow-teal-900/20 relative overflow-hidden group">
                            {/* Inner Noise for the Green Box */}
                            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
                            
                            <h4 className="font-black text-teal-200 flex items-center gap-2 mb-8 uppercase tracking-[0.2em] text-[10px]">
                                <Mail size={14} /> Aloqa va Tasdiqlash
                            </h4>

                            <div className="space-y-4 relative z-10">
                                {contacts.map(c => {
                                    const isEmail = c.contact_type === 'email' || c.contact_type === 'google';
                                    const isVerified = c.is_verified || isEmail;

                                    return (
                                        <div key={c.id} className="p-5 bg-white/10 backdrop-blur-xl rounded-[24px] border border-white/10 flex items-center justify-between gap-4 group/item hover:bg-white/15 transition-all">
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black text-teal-300 uppercase tracking-widest mb-1 opacity-80">
                                                    {isEmail ? 'Elektron pochta' : 'Telefon raqami'}
                                                </p>
                                                <p className="text-sm lg:text-[15px] font-black tracking-tight truncate">{c.value}</p>
                                            </div>

                                            <div className="shrink-0">
                                                {isVerified ? (
                                                    <div className="flex items-center gap-1.5 bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 shadow-inner">
                                                        <CheckCircle2 size={14} className="text-teal-300" />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">Faol</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenBot('verify')}
                                                        className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-amber-300 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-amber-900/20"
                                                    >
                                                        <AlertCircle size={14} /> Tasdiqlash
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <button onClick={() => setShowPhoneModal(true)} className="w-full mt-8 py-4.5 bg-white text-[#17776A] rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 relative z-10">
                                <Smartphone size={18} /> Yangi raqam qo'shish
                            </button>
                        </section>

                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-[32px] p-6 flex gap-4 relative overflow-hidden">
                            <div className="p-2 bg-indigo-500 rounded-xl text-white h-fit shadow-md shadow-indigo-200">
                                <Info size={18} />
                            </div>
                            <div>
                                <h5 className="text-indigo-900 font-black text-xs uppercase tracking-widest mb-1">Eslatma</h5>
                                <p className="text-indigo-700/80 text-[12px] leading-relaxed font-bold">
                                    Gmail orqali kirganingizda tizim sizni xavfsiz deb tan oladi. Telefon raqamingizni qo'shib qo'yish parolni tiklashda yordam beradi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DESIGN IMPROVED */}
            <AnimatePresence>
                {showPhoneModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPhoneModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative z-10 border border-white/20">
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                            <div className="p-10 relative z-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Raqam qo'shish</h3>
                                    <button onClick={() => setShowPhoneModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} className="text-slate-400" /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Yangi telefon raqami</p>
                                        <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-black text-xl transition-all" placeholder="+998" />
                                    </div>

                                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                                        <div className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm">!</div>
                                            <p className="text-[12px] text-blue-700 font-bold leading-relaxed">Tasdiqlash uchun Telegram botda "Kontaktni ulash" tugmasini bosishingiz kifoya.</p>
                                        </div>
                                    </div>

                                    <button onClick={() => handleOpenBot('update')} className="w-full py-5 bg-[#229ED9] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 hover:bg-[#1d8cc2] hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest text-xs">
                                        <Send size={20} /> Telegram botni ochish
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}