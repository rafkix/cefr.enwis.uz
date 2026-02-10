"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Edit3, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Info, Mail, Trash2,
    Calendar, User2, Fingerprint, Settings2,
    ChevronRight, Check, ShieldAlert
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI, uploadAvatarAPI, getMySessionsAPI,
    getMyContactsAPI, terminateSessionAPI
} from "@/lib/api/user"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"
import { toast } from "sonner" // Xabarnomalar uchun (ixtiyoriy)

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
    const [formData, setFormData] = useState({ full_name: "", bio: "", birth_date: "", gender: "" })

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    // Rasm URL-ni aniqlash
    const getAvatarUrl = () => {
        if (!user?.profile?.avatar_url) return null;
        if (user.profile.avatar_url.startsWith('http')) return user.profile.avatar_url;
        return `${API_URL}${user.profile.avatar_url}`;
    };

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
        } catch (err) { console.error("Ma'lumot yuklashda xato:", err) }
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
            toast.success("Profil yangilandi");
        } catch (e) { 
            console.error(e);
            toast.error("Saqlashda xato yuz berdi");
        } finally { setLoading(false); }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 10MB limit tekshiruvi (Frontend darajasida)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Fayl hajmi 10MB dan oshmasligi kerak");
            return;
        }

        setUploading(true);
        try {
            // API funksiyangizga faqat faylni beramiz, u o'zi FormData qiladi
            await uploadAvatarAPI(file); 
            await refreshUser();
            toast.success("Rasm yangilandi");
        } catch (err: any) {
            console.error("Avatar yuklashda 422 yoki boshqa xato:", err);
            toast.error(err.response?.data?.detail?.[0]?.msg || "Rasm yuklashda xato");
        } finally { setUploading(false); }
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 font-sans bg-[#f8fafc]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- CHAP TOMON: ASOSIY PROFIL --- */}
                <div className="lg:col-span-8 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[40px] border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden"
                    >
                        {/* Header qismi */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-8 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Settings2 size={28} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil sozlamalari</h1>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Shaxsiy ma'lumotlar</p>
                                </div>
                            </div>

                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                                    <Edit3 size={16} /> Tahrirlash
                                </button>
                            ) : (
                                <div className="flex w-full sm:w-auto gap-3">
                                    <button onClick={() => setIsEditing(false)} className="flex-1 px-5 py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">Bekor qilish</button>
                                    <button onClick={handleSave} disabled={loading} className="flex-1 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-70">
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Saqlash</>}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Rasm va Asosiy inputlar */}
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                            <div className="relative">
                                <div className="w-44 h-44 rounded-[54px] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl relative">
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
                                    disabled={uploading}
                                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-4 rounded-2xl shadow-xl border-4 border-white hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-50"
                                >
                                    <Camera size={20} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </div>

                            <div className="flex-1 space-y-6 w-full">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To'liq ism</label>
                                    {isEditing ? (
                                        <input 
                                            value={formData.full_name} 
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                                            className="text-lg font-bold w-full p-4 bg-slate-50 rounded-[22px] border border-slate-200 outline-none focus:ring-2 ring-blue-500/20 transition-all" 
                                            placeholder="Ismingizni kiriting"
                                        />
                                    ) : (
                                        <div className="p-1">
                                            <h2 className="text-3xl font-black text-slate-900 leading-tight">{user?.profile?.full_name || "Ism kiritilmagan"}</h2>
                                            <p className="text-blue-600 font-bold text-sm mt-1">@{user?.profile?.username || 'user'}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:border-slate-200 transition-colors">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-2 flex items-center gap-2">
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
                                    <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:border-slate-200 transition-colors">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-2 flex items-center gap-2">
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
                        <div className="mt-10 p-8 bg-slate-50 rounded-[35px] border border-slate-100 relative group">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
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
                                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                    {formData.bio ? `"${formData.bio}"` : "Bio ma'lumotlari kiritilmagan..."}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* --- O'NG TOMON: SIDEBAR --- */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Identifikatsiya */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Fingerprint size={20} className="text-indigo-600" /> Identifikatsiya
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Email manzili", val: contacts.find(c => c.contact_type === 'email')?.value, icon: Mail },
                                { label: "Telefon raqami", val: contacts.find(c => c.contact_type === 'phone')?.value, icon: Phone }
                            ].map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><c.icon size={18} /></div>
                                        <div className="max-w-[150px]">
                                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{c.label}</p>
                                            <p className="text-xs font-bold text-slate-700 truncate">{c.val || "Kiritilmagan"}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Qurilmalar */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <ShieldCheck size={20} className="text-emerald-500" /> Faol seanslar
                            </h3>
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-emerald-600 text-[9px] font-black uppercase">Live</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {sessions.length > 0 ? sessions.slice(0, 3).map(s => (
                                <div key={s.id} className={`p-4 rounded-[26px] border transition-all ${s.is_current ? 'bg-blue-50/40 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${s.is_current ? 'text-blue-600' : 'text-slate-400'}`}>
                                            <Smartphone size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tight">
                                                {s.user_agent?.split('(')[0] || 'Noma`lum qurilma'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-bold text-slate-400">{s.ip_address}</span>
                                                <span className="text-[9px] font-bold text-slate-300">•</span>
                                                <span className="text-[9px] font-bold text-slate-400">{getSafeDistance(s.last_active)}</span>
                                            </div>
                                        </div>
                                        {!s.is_current && (
                                            <button 
                                                onClick={async () => {
                                                    await terminateSessionAPI(s.id);
                                                    loadData();
                                                    toast.success("Seans yakunlandi");
                                                }}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-xs text-slate-400 py-4 font-medium">Faol seanslar topilmadi</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}