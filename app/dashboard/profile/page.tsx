"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Edit3, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Info, Mail, Trash2,
    Calendar, User2, Fingerprint, Settings2,
    ChevronRight, Check, X, Globe, Hash, ShieldAlert
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfile,
    uploadAvatar,
    getMySessions,
    getMyContacts,
    terminateSession
} from "@/lib/api/user"
import { UserSession, UserContact, UpdateProfilePayload } from "@/lib/types/user"
import { formatDistanceToNow, format } from "date-fns"
import { uz } from "date-fns/locale"
import { toast } from "sonner"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // State-lar
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    const [formData, setFormData] = useState<UpdateProfilePayload>({ 
        full_name: "", 
        bio: "", 
        birth_date: "", 
        gender: 'male'
    })

    const API_URL = useMemo(() => (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, ''), []);

    // Avatar URL
    const avatarUrl = useMemo(() => {
        if (!user?.profile?.avatar_url) return null;
        if (user.profile.avatar_url.startsWith('http')) return user.profile.avatar_url;
        return `${API_URL}${user.profile.avatar_url}`;
    }, [user?.profile?.avatar_url, API_URL]);

    // Oxirgi 2 ta sessiyani saralash
    const recentSessions = useMemo(() => {
        return [...sessions]
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 2);
    }, [sessions]);

    // Profil to'liqlik foizi
    const profileCompletion = useMemo(() => {
        if (!user?.profile) return 0;
        const fields = [user.profile.full_name, user.profile.bio, user.profile.birth_date, user.profile.avatar_url];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    }, [user]);

    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) {
            console.error("Ma'lumot yuklashda xato:", err)
        }
    }, [])

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.profile?.full_name || "",
                bio: user.profile?.bio || "",
                birth_date: user.profile?.birth_date || "",
                gender: (user.profile?.gender as any) || "male"
            });
            loadData();
        }
    }, [user, loadData])

    const handleSave = async () => {
        if (!formData.full_name?.trim()) {
            toast.error("Ism va familiya bo'sh bo'lishi mumkin emas");
            return;
        }
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Profil yangilandi");
        } catch (e) { 
            toast.error("Xatolik yuz berdi");
        } finally { setLoading(false); }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            await uploadAvatar(file); 
            await refreshUser();
            toast.success("Rasm yangilandi");
        } catch (err) {
            toast.error("Rasm yuklashda xato");
        } finally { setUploading(false); }
    }

    const handleTerminate = async (sid: string) => {
        try {
            await terminateSession(sid);
            setSessions(prev => prev.filter(s => s.id !== sid));
            toast.success("Sessiya yopildi");
        } catch { toast.error("Xatolik"); }
    }

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- ASOSIY QISM --- */}
                <div className="lg:col-span-8 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[40px] border border-slate-200 p-6 sm:p-10 shadow-sm relative"
                    >
                        {/* Edit/Save Buttons */}
                        <div className="absolute top-6 right-6 z-20">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 h-12 bg-slate-900 text-white rounded-2xl font-bold text-sm">
                                    <Edit3 size={18} /> TAHRIRLASH
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className="h-12 w-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center"><X size={20} /></button>
                                    <button onClick={handleSave} disabled={loading} className="h-12 px-6 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} SAQLASH
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Settings2 size={24} /></div>
                            <div>
                                <h1 className="text-xl font-black text-slate-900">Profil sozlamalari</h1>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ID: {user?.id || 'Aniqlanmagan'}</p>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="relative self-center md:self-start">
                                <div className="w-40 h-40 rounded-[50px] overflow-hidden bg-slate-100 border-4 border-white shadow-xl relative">
                                    {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={100} /></div>}
                                    {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"><Loader2 size={30} className="text-white animate-spin" /></div>}
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-xl shadow-lg border-2 border-white"><Camera size={18} /></button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </div>

                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">F.I.SH</label>
                                    {isEditing ? (
                                        <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="text-lg font-bold w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none" />
                                    ) : (
                                        <h2 className="text-3xl font-black text-slate-900 leading-tight">{user?.profile?.full_name || "Ism kiritilmagan"}</h2>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><Calendar size={12} /> Tug'ilgan sana</span>
                                        {isEditing ? (
                                            <input type="date" value={formData.birth_date || ""} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="bg-transparent w-full font-bold text-slate-700 outline-none" />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700">{user?.profile?.birth_date ? format(new Date(user.profile.birth_date), "d-MMMM, yyyy", { locale: uz }) : "—"}</p>
                                        )}
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><User2 size={12} /> Jinsi</span>
                                        {isEditing ? (
                                            <select value={formData.gender || ""} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="bg-transparent w-full font-bold text-slate-700 outline-none">
                                                <option value="male">Erkak</option>
                                                <option value="female">Ayol</option>
                                            </select>
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700">{user?.profile?.gender === 'male' ? 'Erkak' : 'Ayol'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mt-10 p-6 bg-slate-50 rounded-[30px] border border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-3"><Info size={14} /> Tarjimai hol</span>
                            {isEditing ? (
                                <textarea value={formData.bio || ""} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="bg-transparent w-full font-medium text-slate-700 outline-none min-h-[80px] resize-none" />
                            ) : (
                                <p className="text-slate-600 italic">"{user?.profile?.bio || "Ma'lumot mavjud emas..."}"</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Meta Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "ID", val: `#${user?.id?.toString().slice(0,6)}`, icon: Hash },
                            { label: "Sana", val: user?.created_at ? format(new Date(user.created_at), "MMM yyyy") : '—', icon: Calendar },
                            { label: "Til", val: "O'zbek", icon: Globe },
                            { label: "Holat", val: user?.is_active ? 'Faol' : 'Nofaol', icon: ShieldCheck },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-200 text-center">
                                <item.icon size={16} className="mx-auto mb-2 text-slate-400" />
                                <p className="text-[8px] font-black text-slate-400 uppercase">{item.label}</p>
                                <p className="text-xs font-bold text-slate-900">{item.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SIDEBAR --- */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Contacts */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Fingerprint size={20} className="text-indigo-600" /> Aloqa</h3>
                        <div className="space-y-3">
                            {['email', 'phone'].map((type) => {
                                const contact = contacts.find(c => c.contact_type === type);
                                return (
                                    <div key={type} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'email' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                                {type === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase">{type}</p>
                                                <p className="text-xs font-bold text-slate-700">{contact?.value || "Kiritilmagan"}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Sessions (Oxirgi 2 ta) */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500" /> Seanslar</h3>
                            <span className="text-[8px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-black">XAVFSIZ</span>
                        </div>
                        <div className="space-y-3">
                            {recentSessions.map(s => (
                                <div key={s.id} className={`p-3 rounded-2xl border ${s.is_current ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Smartphone size={18} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-900 truncate uppercase">{s.user_agent?.split(' ')[0] || 'Qurilma'}</p>
                                            <p className="text-[9px] text-slate-400 font-bold italic">{formatDistanceToNow(new Date(s.updated_at), { addSuffix: true, locale: uz })}</p>
                                        </div>
                                        {!s.is_current && (
                                            <button onClick={() => handleTerminate(s.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                        )}
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