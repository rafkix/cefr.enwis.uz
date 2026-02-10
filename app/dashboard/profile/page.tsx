"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Camera, Save, X, Edit3, Loader2,
    Phone, ShieldCheck, CheckCircle2, AlertCircle,
    Smartphone, UserCircle2, ExternalLink, Info, Send, Mail
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI,
    uploadAvatarAPI,
    getMySessionsAPI,
    getMyContactsAPI,
} from "@/lib/api/user"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
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

    const handleOpenBot = (type: 'verify' | 'update') => {
        const cleanPhone = newPhone.replace(/[^\d+]/g, '')
        const url = type === 'verify'
            ? "https://t.me/EnwisAuthBot?start=verify_phone"
            : `https://t.me/EnwisAuthBot?start=${cleanPhone}`;
        window.open(url, "_blank")
    }

    return (
        <div className="w-full pb-20">
            {/* TOP HEADER */}
            <header className="bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 border border-slate-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-[30px] lg:rounded-[38px] bg-slate-50 overflow-hidden ring-4 ring-slate-50 flex items-center justify-center">
                            {uploading ? (
                                <Loader2 className="animate-spin text-teal-600" />
                            ) : user?.profile?.avatar_url ? (
                                <img src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                                <UserCircle2 size={60} className="text-slate-200" />
                            )}
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#17776A] text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                            {user?.profile?.full_name || "Foydalanuvchi"}
                        </h1>
                        <p className="text-teal-600 font-bold text-sm mt-1">@{user?.profile?.username}</p>

                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                                    <Edit3 size={16} /> Tahrirlash
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleSave} disabled={loading} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Saqlash
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm">Bekor qilish</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ASOSIY MA'LUMOTLAR */}
                <div className="lg:col-span-7 space-y-8">
                    <section className="bg-white rounded-[32px] p-6 lg:p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                            <User className="text-teal-600" size={20} /> Shaxsiy ma'lumotlar
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">F.I.SH</label>
                                <input value={formData.full_name} onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))} disabled={!isEditing} className="w-full h-12 px-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-xl outline-none font-bold disabled:opacity-60 transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tug'ilgan sana</label>
                                <input type="date" value={formData.birth_date} onChange={(e) => setFormData(p => ({ ...p, birth_date: e.target.value }))} disabled={!isEditing} className="w-full h-12 px-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-xl outline-none font-bold disabled:opacity-60 transition-all" />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio</label>
                                <textarea rows={2} value={formData.bio} onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))} disabled={!isEditing} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-xl outline-none font-bold disabled:opacity-60 resize-none transition-all" placeholder="O'zingiz haqingizda..." />
                            </div>
                        </div>
                    </section>

                    {/* SEANSLAR */}
                    <section className="bg-white rounded-[32px] p-6 lg:p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-blue-600" size={20} /> Faol seanslar
                        </h3>
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div key={session.id} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                                    <div className="p-2.5 bg-white rounded-xl text-slate-400"><Smartphone size={20} /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">
                                            {session.user_agent.split(' ')[0]}
                                            {session.is_current && <span className="ml-2 text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full uppercase">Hozirgi</span>}
                                        </p>
                                        <p className="text-slate-400 text-[10px]">{session.ip_address} • {new Date(session.last_active).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ALOQA RAQAMLARI / EMAILLAR */}
                <div className="lg:col-span-5 space-y-8">
                    <section className="bg-[#17776A] text-white rounded-[32px] p-6 lg:p-8 shadow-xl shadow-teal-900/10">
                        <h4 className="font-bold text-teal-100 flex items-center gap-2 mb-6 uppercase tracking-widest text-[10px]">
                            <ShieldCheck size={14} /> Tasdiqlangan kontaktlar
                        </h4>

                        <div className="space-y-4">
                            {contacts.map(c => {
                                // Gmail/Email avtomatik tasdiqlangan hisoblanadi
                                const isEmail = c.contact_type === 'email';
                                const isVerified = c.is_verified || isEmail;

                                return (
                                    <div key={c.id} className="p-4 lg:p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-teal-300 uppercase tracking-tighter">
                                                {isEmail ? 'Elektron pochta' : 'Telefon'}
                                            </p>
                                            <p className="text-sm lg:text-base font-black truncate">{c.value}</p>
                                        </div>

                                        <div className="shrink-0">
                                            {isVerified ? (
                                                <div className="flex items-center gap-1.5 bg-teal-500/20 px-3 py-1.5 rounded-full border border-teal-400/30">
                                                    <CheckCircle2 size={14} className="text-teal-300" />
                                                    <span className="text-[10px] font-bold">Tasdiqlangan</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenBot('verify')}
                                                    className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1.5 rounded-full font-black text-[10px] hover:bg-amber-300 transition-colors"
                                                >
                                                    <AlertCircle size={14} /> Tasdiqlash
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <button onClick={() => setShowPhoneModal(true)} className="w-full mt-6 py-4 bg-white text-[#17776A] rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-teal-50 transition-all active:scale-95">
                            <Smartphone size={16} /> Yangi raqam qo'shish
                        </button>
                    </section>

                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex gap-4">
                        <Info size={20} className="text-blue-500 shrink-0" />
                        <p className="text-blue-700 text-[12px] leading-relaxed font-medium">
                            Gmail orqali kirganingizda profilingiz avtomatik tasdiqlanadi. Qo'shimcha telefon raqami qo'shish xavfsizlikni oshiradi.
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {showPhoneModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPhoneModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-slate-900">Raqam qo'shish</h3>
                                    <button onClick={() => setShowPhoneModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase ml-1">Yangi telefon raqami</p>
                                        <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-black text-lg transition-all" placeholder="+998" />
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex gap-3 items-start">
                                            <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-[10px] shrink-0">!</div>
                                            <p className="text-[11px] text-slate-500 font-medium">Telegram botimiz orqali raqamingizni tasdiqlashingiz kerak bo'ladi.</p>
                                        </div>
                                    </div>

                                    <button onClick={() => handleOpenBot('update')} className="w-full py-4 bg-[#229ED9] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                        <Send size={18} /> BOTGA O'TISH
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