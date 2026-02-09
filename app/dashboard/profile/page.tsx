"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Camera, Save, X, Edit3, Loader2,
    Phone, ShieldCheck,
    CheckCircle2, AlertCircle, Smartphone,
    Trash2, UserCircle2, ExternalLink
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI,
    uploadAvatarAPI,
    getMySessionsAPI,
    logoutDeviceAPI,
    getMyContactsAPI,
} from "@/lib/api/user"

interface Session { id: string; user_agent: string; ip_address: string; last_active: string; is_current?: boolean; }
interface Contact { id: string; contact_type: string; value: string; is_primary: boolean; is_verified: boolean; }

export default function ProfilePage() {
    const { user, refreshUser} = useAuth()
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

    // API URL ni aniqlash (oxiridagi sleshni olib tashlash bilan)
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
        const handleFocus = () => {
            if (showPhoneModal) {
                loadInitialData()
                refreshUser()
            }
        }
        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [showPhoneModal, loadInitialData, refreshUser])

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
        } finally { setUploading(false) }
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
        <div className="min-h-screen bg-[#FDFDFD] pb-24">
            <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-teal-50 to-transparent -z-10" />

            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profil sozlamalari</h1>
                        <p className="text-slate-500 font-medium">Shaxsiy ma'lumotlar va xavfsizlik</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                                <Edit3 size={18} /> Tahrirlash
                            </button>
                        ) : (
                            <div className="flex gap-2 bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
                                <button onClick={() => setIsEditing(false)} className="px-5 py-2 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm">Bekor qilish</button>
                                <button onClick={handleSave} disabled={loading} className="bg-[#17776A] text-white px-6 py-2 rounded-[16px] font-bold shadow-lg shadow-teal-900/20 flex items-center gap-2 text-sm">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Saqlash</>}
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT SIDE */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-[40px] bg-slate-100 overflow-hidden ring-4 ring-white shadow-inner flex items-center justify-center">
                                    {uploading ? (
                                        <Loader2 className="animate-spin text-teal-600" size={32} />
                                    ) : user?.profile?.avatar_url ? (
                                        <img 
                                            src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} 
                                            className="w-full h-full object-cover" 
                                            alt="Profile" 
                                        />
                                    ) : (
                                        <UserCircle2 size={64} className="text-slate-300" />
                                    )}
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#17776A] text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform">
                                    <Camera size={18} />
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                            </div>
                            <h2 className="mt-6 text-xl font-black text-slate-900">@{user?.profile.username || 'user'}</h2>
                            <p className="text-slate-400 text-sm font-medium italic">{user?.profile?.full_name}</p>
                        </div>

                        {/* CONTACTS */}
                        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Phone size={18} className="text-[#17776A]" /> Aloqa</h4>
                                {isEditing && (
                                    <button onClick={() => setShowPhoneModal(true)} className="p-2 bg-teal-50 text-[#17776A] rounded-xl hover:bg-teal-100 transition-colors">
                                        <Edit3 size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {contacts.map(c => (
                                    <div key={c.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">{c.contact_type}</p>
                                            <p className="text-sm font-bold text-slate-700">{c.value}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!c.is_verified && (
                                                <button onClick={() => handleOpenBot('verify')} className="text-[10px] bg-amber-100 text-amber-600 px-2 py-1 rounded-lg font-bold hover:bg-amber-200">
                                                    Tasdiqlash
                                                </button>
                                            )}
                                            {c.is_verified ? <CheckCircle2 size={18} className="text-green-500" /> : <AlertCircle size={18} className="text-amber-500" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* MAIN INFO */}
                    <main className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                                <User size={20} className="text-[#17776A]" /> Shaxsiy ma'lumotlar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">To'liq ism-sharif</label>
                                    <input value={formData.full_name} onChange={(e)=>setFormData(p=>({...p, full_name: e.target.value}))} disabled={!isEditing} className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent focus:border-[#17776A] focus:bg-white rounded-2xl outline-none transition-all font-bold disabled:opacity-60" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tug'ilgan sana</label>
                                    <input type="date" value={formData.birth_date} onChange={(e)=>setFormData(p=>({...p, birth_date: e.target.value}))} disabled={!isEditing} className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent focus:border-[#17776A] focus:bg-white rounded-2xl outline-none transition-all font-bold disabled:opacity-60" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Jinsingiz</label>
                                    <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                                        {['male', 'female'].map((g) => (
                                            <button key={g} disabled={!isEditing} onClick={() => setFormData(p => ({ ...p, gender: g }))} className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all ${formData.gender === g ? 'bg-white shadow-sm text-[#17776A]' : 'text-slate-400'}`}>
                                                {g === 'male' ? 'Erkak' : 'Ayol'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bio</label>
                                    <textarea rows={3} value={formData.bio} onChange={(e)=>setFormData(p=>({...p, bio: e.target.value}))} disabled={!isEditing} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-[#17776A] focus:bg-white rounded-2xl outline-none transition-all font-bold resize-none disabled:opacity-60" />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-[#17776A]" /> Faol seanslar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sessions.map((session) => (
                                    <div key={session.id} className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl text-slate-600"><Smartphone size={22} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 text-sm truncate">
                                                {session.user_agent.split(' ')[0]} {session.is_current && <span className="ml-2 text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Hozirgi</span>}
                                            </p>
                                            <p className="text-slate-400 text-[11px] mt-1">{session.ip_address} • {new Date(session.last_active).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* MODAL: PHONE UPDATE */}
            <AnimatePresence>
                {showPhoneModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPhoneModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative z-10">
                            <button onClick={() => setShowPhoneModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><X size={20} /></button>

                            <div className="mb-8 text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Phone size={32} /></div>
                                <h3 className="text-2xl font-black text-slate-900">Raqamni yangilash</h3>
                                <p className="text-slate-500 font-medium mt-2">Yangi raqamni kiriting va bot orqali tasdiqlang.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Yangi telefon raqam</label>
                                    <input 
                                        type="tel" 
                                        value={newPhone} 
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="w-full h-14 px-5 mt-2 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-lg"
                                        placeholder="+998 90 123 45 67"
                                    />
                                </div>

                                <button onClick={() => handleOpenBot('update')} className="w-full h-14 bg-[#229ED9] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1e8dbf] transition-all">
                                    Telegramda davom etish <ExternalLink size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}