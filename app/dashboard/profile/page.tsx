"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Camera, Save, X, Edit3, Loader2,
    Phone, ShieldCheck, CheckCircle2, AlertCircle, 
    Smartphone, UserCircle2, ExternalLink, Info
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI,
    uploadAvatarAPI,
    getMySessionsAPI,
    getMyContactsAPI,
} from "@/lib/api/user"

interface Session { id: string; user_agent: string; ip_address: string; last_active: string; is_current?: boolean; }
interface Contact { id: string; contact_type: string; value: string; is_primary: boolean; is_verified: boolean; }

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<Session[]>([])
    const [contacts, setContacts] = useState<Contact[]>([])
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

    // 422 Xatosini tuzatish: FormData ni to'g'ri shakllantirish
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const uploadFormData = new FormData()
        uploadFormData.append('file', file) // 'file' kaliti backend bilan mos bo'lishi shart

        setUploading(true)
        try {
            await uploadAvatarAPI(uploadFormData)
            await refreshUser()
        } catch (error: any) {
            alert(error.response?.data?.detail || "Rasm yuklashda xatolik yuz berdi")
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
        if (type === 'update' && cleanPhone.length < 12) return alert("Raqamni to'liq kiriting")
        
        const url = type === 'verify' 
            ? "https://t.me/EnwisAuthBot?start=verify_phone"
            : `https://t.me/EnwisAuthBot?start=${cleanPhone}`;
            
        window.open(url, "_blank")
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Dekorativ fon qismi */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-teal-600/10 via-blue-500/5 to-transparent -z-10" />

            <div className="max-w-5xl mx-auto px-4 pt-12 space-y-8">
                
                {/* HEAD SECTION */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[38px] bg-white overflow-hidden ring-8 ring-white shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                {uploading ? (
                                    <Loader2 className="animate-spin text-teal-600" size={32} />
                                ) : user?.profile?.avatar_url ? (
                                    <img 
                                        src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} 
                                        className="w-full h-full object-cover" 
                                        alt="Avatar" 
                                    />
                                ) : (
                                    <UserCircle2 size={70} className="text-slate-200" />
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-3 rounded-2xl shadow-xl hover:bg-teal-700 transition-all hover:scale-110 active:scale-95"
                                title="Rasmni almashtirish"
                            >
                                <Camera size={18} />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>

                        <div className="text-center md:text-left space-y-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                {user?.profile?.full_name || "Foydalanuvchi"}
                            </h1>
                            <p className="text-teal-600 font-bold flex items-center justify-center md:justify-start gap-2">
                                @{user?.profile?.username} <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                                <Edit3 size={18} /> Tahrirlash
                            </button>
                        ) : (
                            <div className="flex gap-2 bg-white p-2 rounded-3xl shadow-lg border border-slate-100">
                                <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Bekor qilish</button>
                                <button onClick={handleSave} disabled={loading} className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Saqlash</>}
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: SHAXSIY MA'LUMOTLAR */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><User size={20} /></div>
                                Shaxsiy ma'lumotlar
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">F.I.SH</label>
                                    <input value={formData.full_name} onChange={(e)=>setFormData(p=>({...p, full_name: e.target.value}))} disabled={!isEditing} className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-[20px] outline-none transition-all font-bold disabled:opacity-50" placeholder="Ismingizni kiriting..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tug'ilgan sana</label>
                                    <input type="date" value={formData.birth_date} onChange={(e)=>setFormData(p=>({...p, birth_date: e.target.value}))} disabled={!isEditing} className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-[20px] outline-none transition-all font-bold disabled:opacity-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Jins</label>
                                    <div className="flex gap-2 p-1 bg-slate-50 rounded-[20px]">
                                        {['male', 'female'].map((g) => (
                                            <button key={g} disabled={!isEditing} onClick={() => setFormData(p => ({ ...p, gender: g }))} className={`flex-1 py-3 rounded-[16px] font-bold capitalize transition-all ${formData.gender === g ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}>
                                                {g === 'male' ? 'Erkak' : 'Ayol'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Men haqimda (Bio)</label>
                                    <textarea rows={3} value={formData.bio} onChange={(e)=>setFormData(p=>({...p, bio: e.target.value}))} disabled={!isEditing} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-[20px] outline-none transition-all font-bold resize-none disabled:opacity-50" placeholder="O'zingiz haqingizda qisqacha..." />
                                </div>
                            </div>
                        </section>

                        {/* SEANSLAR SECTION */}
                        <section className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShieldCheck size={20} /></div>
                                Xavfsizlik va Seanslar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sessions.map((session) => (
                                    <div key={session.id} className="p-5 bg-slate-50 rounded-[24px] flex items-center gap-4 group hover:bg-slate-100 transition-colors">
                                        <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-blue-500 transition-colors"><Smartphone size={22} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 text-sm truncate">
                                                {session.user_agent.split(' ')[0]} 
                                                {session.is_current && <span className="ml-2 text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-black">Hozirgi</span>}
                                            </p>
                                            <p className="text-slate-400 text-[11px] mt-0.5">{session.ip_address} • {new Date(session.last_active).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: ALOQA VA TASDIQLASH */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-teal-900 text-white rounded-[40px] p-8 shadow-2xl shadow-teal-900/20 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                            
                            <h4 className="font-bold text-teal-100 flex items-center gap-2 mb-8 uppercase tracking-widest text-xs">
                                <Phone size={16} /> Aloqa raqamlari
                            </h4>
                            
                            <div className="space-y-4">
                                {contacts.map(c => (
                                    <div key={c.id} className="p-6 bg-white/10 backdrop-blur-md rounded-[30px] border border-white/10 flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-teal-300 uppercase opacity-70">Telefon raqam</p>
                                            <p className="text-lg font-black tracking-tight">{c.value}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {!c.is_verified && (
                                                <button 
                                                    onClick={() => handleOpenBot('verify')} 
                                                    className="text-[11px] bg-amber-400 text-amber-950 px-4 py-2 rounded-xl font-black hover:bg-amber-300 transition-all active:scale-95"
                                                >
                                                    Tasdiqlash
                                                </button>
                                            )}
                                            {c.is_verified ? (
                                                <div className="p-2 bg-teal-500/20 rounded-full"><CheckCircle2 size={24} className="text-teal-400" /></div>
                                            ) : (
                                                <div className="p-2 bg-amber-500/20 rounded-full"><AlertCircle size={24} className="text-amber-400" /></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => setShowPhoneModal(true)} 
                                className="w-full mt-8 py-5 bg-white text-teal-900 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 hover:bg-teal-50 transition-all active:scale-[0.98]"
                            >
                                <Smartphone size={18} /> Yangi raqam qo'shish
                            </button>
                        </section>

                        {/* INFO CARD */}
                        <div className="bg-blue-50 border border-blue-100 rounded-[30px] p-6 flex gap-4">
                            <div className="p-2 bg-blue-100 text-blue-600 h-fit rounded-lg"><Info size={20} /></div>
                            <div className="space-y-1">
                                <p className="text-blue-900 font-bold text-sm">Yordam kerakmi?</p>
                                <p className="text-blue-700/70 text-[13px] leading-relaxed">
                                    Raqamingizni tasdiqlash uchun Telegram botimizga o'tishingiz kerak. Bu tizim xavfsizligini ta'minlaydi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL: PHONE UPDATE STEP-BY-STEP */}
            <AnimatePresence>
                {showPhoneModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPhoneModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[45px] overflow-hidden shadow-2xl relative z-10">
                            <div className="p-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-slate-900">Raqamni yangilash</h3>
                                        <p className="text-slate-500 font-medium">Buni amalga oshirish uchun 2 ta bosqich:</p>
                                    </div>
                                    <button onClick={() => setShowPhoneModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><X size={20} /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-black flex-shrink-0">1</div>
                                        <div className="flex-1 space-y-3">
                                            <p className="font-bold text-slate-800">Yangi raqamni kiriting</p>
                                            <input 
                                                type="tel" 
                                                value={newPhone} 
                                                onChange={(e) => setNewPhone(e.target.value)}
                                                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-xl"
                                                placeholder="+998 90 123 45 67"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start opacity-60">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black flex-shrink-0">2</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800">Telegram botda tasdiqlang</p>
                                            <p className="text-xs text-slate-500 mt-1">Pastdagi tugmani bossangiz, botga yo'naltirilasiz.</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleOpenBot('update')} 
                                    className="w-full py-6 bg-[#229ED9] text-white rounded-[25px] font-black flex items-center justify-center gap-3 hover:bg-[#1e8dbf] transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                                >
                                    Telegramni ochish <ExternalLink size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}