"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import {
    Camera, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Mail, Trash2,
    Calendar, User2, Settings2,
    Check, ShieldAlert, SmartphoneNfc,
    Globe, Lock, LogOut
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfile, uploadAvatar, getMySessions,
    getMyContacts, terminateSession
} from "@/lib/api/user"
import { UserSession, UserContact, UpdateProfilePayload } from "@/lib/types/user"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"
import { toast } from "sonner"

export default function ProfilePage() {
    const { user, refreshUser, logout } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    const [formData, setFormData] = useState<UpdateProfilePayload>({
        full_name: "", bio: "", birth_date: "", gender: 'male'
    })

    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);
    const emailContact = useMemo(() => contacts.find(c => c.contact_type === 'email'), [contacts]);

    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { console.error("Xatolik:", err) }
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

    // DINAMIK BOT LINKI
    const handleVerify = () => {
        let botLink = "https://t.me/EnwisAuthBot?start=verify_phone";
        
        if (phoneContact?.value) {
            // Raqamdan faqat raqamlarni ajratib olish (masalan: 998901234567)
            const purePhone = phoneContact.value.replace(/\D/g, "");
            botLink = `https://t.me/EnwisAuthBot?start=${purePhone}_${user?.id}`;
        }

        window.open(botLink, "_blank");
        toast.info("Tasdiqlash uchun botga o'tildi");
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Rasm muvaffaqiyatli yangilandi");
        } catch { toast.error("Rasmni yuklashda xato") } finally { setLoading(false) }
    }

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Ma'lumotlar saqlandi");
        } catch { toast.error("Saqlashda xatolik") } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen py-6 sm:py-10 bg-slate-50/50">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 px-4">
                
                <div className="lg:col-span-8 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] border border-slate-200 p-6 sm:p-10 shadow-sm">
                        
                        <div className="flex justify-between items-start mb-8 text-slate-900">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Settings2 /></div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-black">Profil sozlamalari</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {String(user?.id).slice(0, 8)}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditing(!isEditing)} className={`px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${isEditing ? 'bg-red-50 text-red-600' : 'bg-slate-900 text-white'}`}>
                                {isEditing ? "Bekor qilish" : "Tahrirlash"}
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10">
                            {/* AVATAR DISPLAY - TO'G'IRLANGAN */}
                            <div className="relative self-center shrink-0">
                                <div className="w-40 h-40 rounded-[50px] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl flex items-center justify-center relative">
                                    {user?.profile?.avatar_url ? (
                                        <img 
                                            src={user.profile.avatar_url} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = ""; }} 
                                        />
                                    ) : (
                                        <div className="text-slate-300"><UserCircle2 size={100} strokeWidth={1} /></div>
                                    )}
                                    {loading && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                            <Loader2 className="animate-spin text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white hover:scale-110 active:scale-95 transition-all">
                                    <Camera size={18} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">F.I.SH</label>
                                    {isEditing ? (
                                        <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-500" />
                                    ) : (
                                        <h2 className="text-2xl font-black text-slate-900">{user?.profile?.full_name || "Kiritilmagan"}</h2>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><Calendar size={12} /> Tug'ilgan sana</span>
                                        {isEditing ? <input type="date" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="bg-transparent font-bold outline-none w-full text-slate-900" /> : <p className="text-sm font-bold text-slate-700">{user?.profile?.birth_date || "—"}</p>}
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><User2 size={12} /> Jinsi</span>
                                        {isEditing ? (
                                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="bg-transparent font-bold outline-none w-full text-slate-900">
                                                <option value="male">Erkak</option>
                                                <option value="female">Ayol</option>
                                            </select>
                                        ) : <p className="text-sm font-bold text-slate-700 uppercase">{user?.profile?.gender === 'male' ? 'Erkak' : 'Ayol'}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <button onClick={handleUpdateProfile} disabled={loading} className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Saqlash
                            </button>
                        )}
                    </motion.div>

                    {/* ALOQA BO'LIMI */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-blue-500" /> Aloqa ma'lumotlari
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm"><Mail size={20} /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Email</p>
                                        <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{emailContact?.value || user?.email}</p>
                                    </div>
                                </div>
                                <ShieldCheck className="text-emerald-500" size={18} />
                            </div>

                            <div className={`p-5 rounded-3xl border transition-all ${phoneContact?.is_verified ? 'bg-slate-50 border-slate-100' : 'bg-amber-50 border-amber-100'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl shadow-sm ${phoneContact?.is_verified ? 'bg-white text-emerald-500' : 'bg-white text-amber-500'}`}><Phone size={20} /></div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Telefon</p>
                                            <p className="text-sm font-bold text-slate-700">{phoneContact?.value || "Biriktirilmagan"}</p>
                                        </div>
                                    </div>
                                    {phoneContact?.is_verified && <ShieldCheck className="text-emerald-500" size={18} />}
                                </div>
                                
                                {!phoneContact?.is_verified && (
                                    <button onClick={handleVerify} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                                        <SmartphoneNfc size={14} /> 
                                        Bot orqali tasdiqlash
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-6 text-blue-400">
                            <ShieldAlert size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Xavfsizlik</span>
                        </div>
                        <div className="text-5xl font-black mb-3 text-white">{phoneContact?.is_verified ? '100%' : '75%'}</div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full mb-4 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: phoneContact?.is_verified ? '100%' : '75%' }} className={`h-full rounded-full ${phoneContact?.is_verified ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                            {phoneContact?.is_verified ? "Profilingiz to'liq himoyalangan." : "Raqamni tasdiqlab, 100% himoyaga ega bo'ling."}
                        </p>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-200 p-6 shadow-sm flex flex-col h-[400px]">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                            <Lock size={14} className="text-blue-500" /> Sessiyalar
                        </h3>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {sessions.map((s) => (
                                <div key={s.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${s.is_current ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-transparent'}`}>
                                    <div className={`p-2.5 rounded-xl shrink-0 ${s.is_current ? 'bg-white text-blue-600' : 'bg-white text-slate-400'}`}>
                                        {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={16} /> : <Globe size={16} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-slate-900">
                                            <p className="text-[9px] font-black truncate">{s.ip_address}</p>
                                            {s.is_current && <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full" />}
                                        </div>
                                        <p className="text-[8px] text-slate-400 font-bold truncate">{s.user_agent.split(') ')[1] || "Brauzer"}</p>
                                        <p className="text-[7px] text-slate-400 mt-1 uppercase">
                                            {formatDistanceToNow(new Date(s.updated_at), { addSuffix: true, locale: uz })}
                                        </p>
                                    </div>
                                    {!s.is_current && (
                                        <button onClick={() => terminateSession(s.id).then(loadData)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={logout} className="w-full p-6 bg-red-50 text-red-600 rounded-[35px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-100 transition-all border border-red-100">
                        <LogOut size={16} /> Chiqish
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    )
}