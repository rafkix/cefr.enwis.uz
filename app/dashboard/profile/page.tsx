"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Save, Edit3, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Info, Mail, Trash2,
    Calendar, User2, Globe, Clock, Fingerprint, ShieldAlert,
    ChevronRight, Check, Zap, Shield, Star, LayoutGrid, Settings2
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI, uploadAvatarAPI, getMySessionsAPI,
    getMyContactsAPI, terminateSessionAPI
} from "@/lib/api/user"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
    const [formData, setFormData] = useState({ full_name: "", bio: "", birth_date: "", gender: "" })

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    const getSafeDistance = (dateStr: any) => {
        try {
            if (!dateStr) return "hozir";
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? "yaqinda" : formatDistanceToNow(d, { addSuffix: true, locale: uz });
        } catch { return "yaqinda"; }
    }

    const loadData = useCallback(async () => {
        try {
            const [sess, cont] = await Promise.all([getMySessionsAPI(), getMyContactsAPI()]);
            setSessions(sess.data?.sessions || sess.data || []);
            setContacts(cont.data?.contacts || cont.data || []);
        } catch (err) { console.error(err) }
    }, [])

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.profile?.full_name || "",
                bio: user.profile?.bio || "",
                birth_date: user.profile?.birth_date ? user.profile.birth_date.split('T')[0] : "",
                gender: user.profile?.gender || ""
            });
            loadData();
        }
    }, [user, loadData])

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfileAPI(formData);
            await refreshUser();
            setIsEditing(false);
        } catch (e) { console.error(e) }
        finally { setLoading(false); }
    }

    return (
        <div className="min-h-screen py-12 px-6 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- CHAP TOMON: ASOSIY PROFIL --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* ASOSIY PROFIL KARTASI (Sarlavha va Tugmalar ichida) */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden">

                        {/* Header qismi: Sarlavha va Tahrirlash tugmasi */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Settings2 size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Profil boshqaruvi</h1>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Shaxsiy kabinet</p>
                                </div>
                            </div>

                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all active:scale-95">
                                    <Edit3 size={16} /> Tahrirlash
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-5 py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">Bekor qilish</button>
                                    <button onClick={handleSave} className="px-7 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-2 hover:bg-blue-700 transition-all">
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Saqlash</>}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Ma'lumotlar qismi */}
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-[48px] overflow-hidden bg-slate-50 border-4 border-white shadow-2xl transition-transform group-hover:scale-[1.02]">
                                    {user?.profile?.avatar_url ? (
                                        <img src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" />
                                    ) : <UserCircle2 size={160} className="text-slate-200" />}
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 hover:bg-slate-50 transition-all active:scale-90">
                                    <Camera size={20} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const fd = new FormData(); fd.append('file', file);
                                        await uploadAvatarAPI(fd); refreshUser();
                                    }
                                }} />
                            </div>

                            <div className="flex-1 space-y-8 w-full">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To'liq ism va foydalanuvchi</label>
                                    {isEditing ? (
                                        <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="text-xl font-bold w-full p-4 bg-slate-50 rounded-[24px] border border-slate-100 outline-none focus:ring-2 ring-blue-500/20 transition-all" />
                                    ) : (
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 leading-tight">{user?.profile?.full_name || "Ism kiritilmagan"}</h2>
                                            <p className="text-blue-600 font-bold text-sm">@{user?.profile?.username || 'foydalanuvchi'}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-50/50 rounded-[28px] border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1.5 flex items-center gap-2"><Calendar size={12} className="text-blue-500" /> Tug'ilgan sana</p>
                                        {isEditing ? <input type="date" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="bg-transparent w-full font-bold text-slate-700 outline-none" /> : <p className="text-sm font-bold text-slate-700">{formData.birth_date || "—"}</p>}
                                    </div>
                                    <div className="p-5 bg-slate-50/50 rounded-[28px] border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1.5 flex items-center gap-2"><User2 size={12} className="text-blue-500" /> Jinsi</p>
                                        {isEditing ? (
                                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="bg-transparent w-full font-bold text-slate-700 outline-none">
                                                <option value="">Tanlanmagan</option>
                                                <option value="male">Erkak</option>
                                                <option value="female">Ayol</option>
                                            </select>
                                        ) : <p className="text-sm font-bold text-slate-700">{formData.gender === 'male' ? 'Erkak' : formData.gender === 'female' ? 'Ayol' : '—'}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-8 bg-slate-50/50 rounded-[35px] border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                                <Info size={14} className="text-blue-500" /> Tarjimai hol (Bio)
                            </p>
                            {isEditing ? (
                                <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="bg-transparent w-full font-medium text-slate-700 outline-none min-h-[100px] resize-none" placeholder="O'zingiz haqingizda yozing..." />
                            ) : (
                                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                    "{formData.bio || "Hayot yo'limiz - tanlagan qadamlarimizdir..."}"
                                </p>
                            )}
                        </div>
                    </div>

                </div>

                {/* --- O'NG TOMON: SIDEBAR (Identifikatsiya va Seanslar) --- */}
                <div className="lg:col-span-4 space-y-8">
                    {/* ... (O'ng tomon kodi o'zgarishsiz qoladi, avvalgi koddagi kabi chiroyli sidebar) ... */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Fingerprint size={18} className="text-indigo-600" /> Identifikatsiya
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Email manzili", val: contacts.find(c => c.contact_type === 'email')?.value, icon: Mail },
                                { label: "Telefon raqami", val: contacts.find(c => c.contact_type === 'phone')?.value, icon: Phone }
                            ].map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="text-slate-400 group-hover:text-blue-600 transition-colors"><c.icon size={18} /></div>
                                        <div className="max-w-[160px]">
                                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{c.label}</p>
                                            <p className="text-xs font-bold text-slate-700 truncate">{c.val || "Ulanmagan"}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <ShieldCheck size={18} className="text-emerald-500" /> Faol qurilmalar
                            </h3>
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">LIVE</span>
                        </div>
                        <div className="space-y-4">
                            {sessions.slice(0, 3).map(s => (
                                <div key={s.id} className={`p-4 rounded-[24px] border transition-all ${s.is_current ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`${s.is_current ? 'text-blue-600' : 'text-slate-400'}`}>
                                            <Smartphone size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-slate-900 truncate uppercase">
                                                {s.user_agent?.split('(')[0]}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-bold text-slate-400">{s.ip_address}</span>
                                                <span className="text-[9px] font-bold text-slate-400">• {getSafeDistance(s.last_active)}</span>
                                            </div>
                                        </div>
                                        {!s.is_current && <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}