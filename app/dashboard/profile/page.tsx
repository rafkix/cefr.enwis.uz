"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Edit3, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Info, Mail, Trash2,
    Calendar, User2, Fingerprint, Settings2,
    ChevronRight, Check, X, LogOut, Globe
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI, uploadAvatarAPI, getMySessionsAPI,
    getMyContactsAPI, terminateSessionAPI
} from "@/lib/api/user"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"
import { toast } from "sonner"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // State-lar
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
    const [formData, setFormData] = useState({ 
        full_name: "", 
        bio: "", 
        birth_date: "", 
        gender: "" 
    })

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    // Rasm URL-ni shakllantirish
    const getAvatarUrl = () => {
        if (!user?.profile?.avatar_url) return null;
        if (user.profile.avatar_url.startsWith('http')) return user.profile.avatar_url;
        return `${API_URL}${user.profile.avatar_url}`;
    };

    // Vaqtni chiroyli formatlash
    const getSafeDistance = (dateStr: any) => {
        try {
            if (!dateStr) return "hozir";
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? "yaqinda" : formatDistanceToNow(d, { addSuffix: true, locale: uz });
        } catch { return "yaqinda"; }
    }

    // Ma'lumotlarni yuklash (Seanslar va Kontaktlar)
    const loadData = useCallback(async () => {
        try {
            const [sess, cont] = await Promise.all([getMySessionsAPI(), getMyContactsAPI()]);
            setSessions(sess.data?.sessions || sess.data || []);
            setContacts(cont.data?.contacts || cont.data || []);
        } catch (err) {
            console.error("Ma'lumot yuklashda xato:", err)
        }
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

    // Profilni saqlash
    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfileAPI(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Profil muvaffaqiyatli yangilandi");
        } catch (e) { 
            toast.error("Ma'lumotlarni saqlashda xato yuz berdi");
        } finally { setLoading(false); }
    }

    // Avatarni yuklash
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Fayl hajmi 10MB dan oshmasligi kerak");
            return;
        }

        setUploading(true);
        try {
            await uploadAvatarAPI(file); 
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
        } catch (err: any) {
            toast.error("Rasm yuklashda xato");
        } finally { setUploading(false); }
    }

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- CHAP TOMON: ASOSIY MA'LUMOTLAR --- */}
                <div className="lg:col-span-8 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[40px] border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden"
                    >
                        {/* 🟢 TAHRIRLASH TUGMASI (Qalamcha - Hoverda matn chiqadi) */}
                        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20">
                            {!isEditing ? (
                                <motion.button
                                    whileHover={{ width: "160px" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    onClick={() => setIsEditing(true)}
                                    className="group flex items-center justify-center gap-3 h-14 w-14 bg-slate-900 text-white rounded-[20px] font-bold text-sm shadow-2xl shadow-slate-300 overflow-hidden"
                                >
                                    <Edit3 size={20} className="min-w-[20px]" />
                                    <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 uppercase tracking-tighter">
                                        Tahrirlash
                                    </span>
                                </motion.button>
                            ) : (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="h-14 w-14 bg-slate-100 text-slate-500 rounded-[20px] flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        <X size={22} />
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="h-14 px-8 bg-blue-600 text-white rounded-[20px] font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-70 active:scale-95"
                                    >
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <><Check size={20} /> Saqlash</>}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sarlavha */}
                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Settings2 size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil sozlamalari</h1>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Shaxsiy identifikatsiya</p>
                            </div>
                        </div>

                        {/* Rasm va Ism */}
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                            <div className="relative group">
                                <div className="w-48 h-48 rounded-[60px] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl relative">
                                    {getAvatarUrl() ? (
                                        <img src={getAvatarUrl()!} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <UserCircle2 size={120} />
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                            <Loader2 size={32} className="text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-4 rounded-2xl shadow-2xl border-4 border-white hover:bg-blue-700 hover:scale-110 transition-all active:scale-90"
                                >
                                    <Camera size={20} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </div>

                            <div className="flex-1 space-y-8 w-full">
                                <div className="space-y-2 text-center md:text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To'liq ism va familiya</label>
                                    {isEditing ? (
                                        <input 
                                            value={formData.full_name} 
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                                            className="text-xl font-bold w-full p-5 bg-slate-50 rounded-[24px] border border-slate-200 outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500 transition-all" 
                                            placeholder="Ismingizni kiriting"
                                        />
                                    ) : (
                                        <div className="py-2">
                                            <h2 className="text-4xl font-black text-slate-900 leading-tight">{user?.profile?.full_name || "Ism kiritilmagan"}</h2>
                                            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">@{user?.profile?.username || 'user'}</span>
                                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                                <span className="text-slate-400 text-xs font-medium">ID: {user?.id?.toString().slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Calendar size={14} className="text-blue-500" /> Tug'ilgan sana
                                        </p>
                                        {isEditing ? (
                                            <input 
                                                type="date" 
                                                value={formData.birth_date} 
                                                onChange={e => setFormData({ ...formData, birth_date: e.target.value })} 
                                                className="bg-transparent w-full font-bold text-slate-700 outline-none cursor-pointer" 
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700">{formData.birth_date || "—"}</p>
                                        )}
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <User2 size={14} className="text-blue-500" /> Jinsi
                                        </p>
                                        {isEditing ? (
                                            <select 
                                                value={formData.gender} 
                                                onChange={e => setFormData({ ...formData, gender: e.target.value })} 
                                                className="bg-transparent w-full font-bold text-slate-700 outline-none cursor-pointer"
                                            >
                                                <option value="">Tanlanmagan</option>
                                                <option value="male">Erkak</option>
                                                <option value="female">Ayol</option>
                                            </select>
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700">
                                                {formData.gender === 'male' ? 'Erkak' : formData.gender === 'female' ? 'Ayol' : '—'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio qismi */}
                        <div className="mt-12 p-8 bg-slate-50 rounded-[35px] border border-slate-100 group transition-all hover:bg-slate-100/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2 tracking-[0.1em]">
                                <Info size={16} className="text-blue-500" /> Tarjimai hol (Bio)
                            </p>
                            {isEditing ? (
                                <textarea 
                                    value={formData.bio} 
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                                    className="bg-transparent w-full font-medium text-slate-700 outline-none min-h-[120px] resize-none leading-relaxed" 
                                    placeholder="O'zingiz haqingizda qisqacha yozing..." 
                                />
                            ) : (
                                <p className="text-base text-slate-600 leading-relaxed font-medium italic">
                                    {formData.bio ? `"${formData.bio}"` : "Hali hech narsa yozilmagan..."}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* --- O'NG TOMON: SIDEBAR --- */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Identifikatsiya Card */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <Fingerprint size={22} className="text-indigo-600" /> Aloqa ma'lumotlari
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Email manzili", val: contacts.find(c => c.contact_type === 'email')?.value, icon: Mail, color: "bg-orange-50 text-orange-600" },
                                { label: "Telefon raqami", val: contacts.find(c => c.contact_type === 'phone')?.value, icon: Phone, color: "bg-green-50 text-green-600" }
                            ].map((c, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${c.color}`}>
                                            <c.icon size={20} />
                                        </div>
                                        <div className="max-w-[140px]">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{c.label}</p>
                                            <p className="text-[13px] font-bold text-slate-700 truncate">{c.val || "Biriktirilmagan"}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Qurilmalar va Xavfsizlik */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <ShieldCheck size={22} className="text-emerald-500" /> Faol seanslar
                            </h3>
                            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-emerald-600 text-[9px] font-black uppercase tracking-tighter">Xavfsiz</span>
                            </div>
                        </div>

                        <div className="space-y-4 relative">
                            {sessions.length > 0 ? sessions.map(s => (
                                <div key={s.id} className={`p-4 rounded-[28px] border transition-all duration-300 ${s.is_current ? 'bg-blue-50/50 border-blue-100 ring-1 ring-blue-100' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-lg'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${s.is_current ? 'bg-white text-blue-600' : 'bg-white text-slate-400'}`}>
                                            <Smartphone size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[11px] font-black text-slate-900 truncate uppercase">
                                                    {s.user_agent?.split('(')[0] || 'Qurilma'}
                                                </p>
                                                {s.is_current && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-bold uppercase">Hozirgi</span>}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400">{s.ip_address}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="text-[10px] font-bold text-slate-400 italic">{getSafeDistance(s.last_active)}</span>
                                            </div>
                                        </div>
                                        {!s.is_current && (
                                            <button 
                                                onClick={async () => {
                                                    await terminateSessionAPI(s.id);
                                                    loadData();
                                                    toast.success("Seans muvaffaqiyatli o'chirildi");
                                                }}
                                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <Loader2 className="mx-auto text-slate-200 animate-spin mb-2" size={30} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yuklanmoqda...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}