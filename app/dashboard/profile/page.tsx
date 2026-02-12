"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Phone, ShieldCheck, Smartphone, UserCircle2, Mail, Trash2,
    Calendar, Settings2, SmartphoneNfc, Globe, LogOut, X, Info, Heart,
    ShieldAlert, BadgeCheck, Clock, Loader2, SendHorizontal, Check
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfile, uploadAvatar, getMySessions,
    getMyContacts, terminateSession
} from "@/lib/api/user"
import { UserSession, UserContact, UpdateProfilePayload } from "@/lib/types/user"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function ProfilePage() {
    const { user, refreshUser, logout } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // States
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    const [checking, setChecking] = useState(false)
    const [phoneInput, setPhoneInput] = useState("")
    const [isAddingPhone, setIsAddingPhone] = useState(false)

    const [formData, setFormData] = useState<UpdateProfilePayload>({
        full_name: "", bio: "", birth_date: "", gender: 'male'
    })

    // Memoized Data
    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);
    const emailContact = useMemo(() => contacts.find(c => c.contact_type === "email"), [contacts]);
    const latestSessions = useMemo(() => sessions.slice(0, 3), [sessions]);

    const telegramBotLink = useMemo(() => {
        const userId = user?.id || "unknown";
        if (!phoneContact?.value) {
            const cleanPhone = phoneInput.replace(/\+/g, "");
            return `https://t.me/EnwisAuthBot?start=${cleanPhone}_${userId}`;
        }
        return "https://t.me/EnwisAuthBot?start=verify_phone";
    }, [phoneContact, user, phoneInput]);

    // Helpers
    const calculateAge = useCallback((birthDate: string | undefined) => {
        if (!birthDate) return "—";
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age < 0 ? 0 : age;
    }, []);

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "Kiritilmagan";
        try {
            return new Date(dateStr).toLocaleDateString('uz-UZ', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch { return "Xato sana"; }
    };

    // Actions
    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { 
            console.error("Ma'lumot yuklashda xatolik:", err);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.profile?.full_name || "",
                bio: user.profile?.bio || "",
                birth_date: user.profile?.birth_date?.split('T')[0] || "",
                gender: (user.profile?.gender as any) || "male"
            });
            loadData();
        }
    }, [user, loadData]);

    const handleAddPhone = async () => {
        const cleanPhone = phoneInput.replace(/\s/g, "");
        if (!cleanPhone.startsWith("+998") || cleanPhone.length !== 13) {
            toast.error("Raqamni +998XXXXXXXXX formatida kiriting");
            return;
        }
        setLoading(true);
        try {
            await updateProfile({ ...formData, phone: cleanPhone } as any);
            await refreshUser();
            await loadData();
            setIsAddingPhone(false);
            toast.success("Raqam saqlandi!");
        } catch {
            toast.error("Raqamni saqlashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckStatus = async () => {
        setChecking(true);
        try {
            await refreshUser();
            await loadData();
            toast.success("Ma'lumotlar yangilandi");
        } catch {
            toast.error("Yangilashda xatolik");
        } finally { setChecking(false) }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Rasm hajmi 5MB dan oshmasligi kerak");
            return;
        }
        setUploading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
        } catch { toast.error("Rasm yuklashda xatolik") }
        finally { setUploading(false) }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Ma'lumotlar saqlandi");
        } catch { toast.error("Xatolik yuz berdi") }
        finally { setLoading(false) }
    };

    const handleTerminate = async (sid: string) => {
        try {
            await terminateSession(sid);
            setSessions(prev => prev.filter(s => s.id !== sid));
            toast.success("Sessiya yopildi");
        } catch { toast.error("Sessiyani yopib bo'lmadi") }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] py-12 px-4 selection:bg-blue-500/30">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5 text-center relative overflow-hidden">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-4 ring-blue-500/5 shadow-2xl bg-slate-100 dark:bg-white/5">
                                {user?.profile?.avatar_url ? (
                                    <img
                                        src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`}
                                        className="w-full h-full object-cover"
                                        alt="avatar"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={80} /></div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-90 transition-all"
                            >
                                <Camera size={18} />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                        </div>
                        
                        <h1 className="text-2xl font-black dark:text-white leading-tight break-words">
                            {user?.profile?.full_name || "Ism kiritilmagan"}
                        </h1>
                        <p className="text-blue-500 font-bold text-sm mb-6">@{user?.profile?.username || "username"}</p>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex-1 bg-slate-50 dark:bg-white/5 dark:text-white py-4 rounded-2xl font-black text-[10px] tracking-widest border dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-all uppercase flex items-center justify-center gap-2"
                            >
                                <Settings2 size={16} /> Tahrirlash
                            </button>
                            <button 
                                onClick={logout} 
                                className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard label="Yosh" value={calculateAge(user?.profile?.birth_date)} />
                        <StatCard label="Jins" value={user?.profile?.gender === 'male' ? 'Erkak' : 'Ayol'} />
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[32px] p-6 border dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <ShieldAlert size={20} />
                            <p className="font-black text-xs uppercase tracking-widest">Hisob holati</p>
                        </div>
                        <div className="space-y-3">
                            <StatusRow 
                                label="Tasdiqlangan" 
                                icon={<BadgeCheck className={phoneContact?.is_verified ? "text-green-500" : "text-slate-300"} size={16} />} 
                            />
                            <StatusRow 
                                label="Ikki bosqichli" 
                                icon={<div className={`w-2.5 h-2.5 rounded-full ${phoneContact?.is_verified ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-300"}`} />} 
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-2">
                            <Info size={22} className="text-blue-500" /> Shaxsiy ma'lumotlar
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InfoItem
                                icon={<Phone className="text-green-500" />}
                                label="Telefon"
                                value={isAddingPhone ? "" : (phoneContact?.value || "Ulanmagan")}
                                verified={phoneContact?.is_verified}
                                action={
                                    <div className="ml-auto">
                                        {!phoneContact && !isAddingPhone && (
                                            <button 
                                                onClick={() => setIsAddingPhone(true)} 
                                                className="text-[10px] font-black text-white bg-blue-500 px-3 py-2 rounded-xl uppercase hover:bg-blue-600 transition-colors"
                                            >
                                                Kiritish
                                            </button>
                                        )}

                                        {!phoneContact && isAddingPhone && (
                                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 p-1 rounded-xl border dark:border-white/10">
                                                <input
                                                    autoFocus
                                                    value={phoneInput}
                                                    placeholder="+998"
                                                    onChange={e => setPhoneInput(e.target.value)}
                                                    className="bg-transparent border-none outline-none text-[11px] font-bold dark:text-white px-2 w-28"
                                                />
                                                <button onClick={handleAddPhone} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"><Check size={14} /></button>
                                                <button onClick={() => setIsAddingPhone(false)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"><X size={14} /></button>
                                            </div>
                                        )}

                                        {phoneContact && !phoneContact.is_verified && (
                                            <a
                                                href={telegramBotLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-black text-white bg-[#0088cc] px-3 py-2 rounded-xl uppercase flex items-center gap-2 hover:brightness-110 transition-all"
                                            >
                                                <SendHorizontal size={12} /> Tasdiqlash
                                            </a>
                                        )}
                                    </div>
                                }
                            />

                            <InfoItem icon={<Mail className="text-orange-500" />} label="Email" value={emailContact?.value || "—"} verified={true} />
                            <InfoItem icon={<Clock className="text-blue-400" />} label="Ro'yxatdan o'tilgan" value={formatDate(user?.created_at)} />
                            <InfoItem icon={<Calendar className="text-purple-500" />} label="Tug'ilgan sana" value={`${formatDate(user?.profile?.birth_date)} (${calculateAge(user?.profile?.birth_date)})`} />
                            <InfoItem icon={<Heart className="text-pink-500" />} label="BIO" value={user?.profile?.bio || "Bio ma'lumoti mavjud emas"} isFullWidth />
                        </div>

                        {phoneContact && !phoneContact.is_verified && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/5 rounded-[24px] border border-blue-100 dark:border-blue-500/10 flex items-center justify-between gap-4">
                                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Bot orqali tasdiqlab bo'ldingizmi?</p>
                                <button
                                    onClick={handleCheckStatus}
                                    disabled={checking}
                                    className="px-6 py-2 bg-white dark:bg-white/10 rounded-xl text-[10px] font-black text-blue-500 border border-blue-200 dark:border-blue-500/20 uppercase hover:bg-blue-50 dark:hover:bg-white/20 transition-all disabled:opacity-50"
                                >
                                    {checking ? <Loader2 className="animate-spin" size={14} /> : "Tekshirish"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SESSIONS */}
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                                <SmartphoneNfc size={22} className="text-blue-500" /> Oxirgi sessiyalar
                            </h3>
                            <span className="text-[10px] font-black bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">
                                Faol qurilmalar
                            </span>
                        </div>
                        <div className="space-y-3">
                            {latestSessions.length > 0 ? latestSessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-5 rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 group transition-all hover:border-blue-500/20">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl transition-colors ${s.is_current ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/10 text-slate-400'}`}>
                                            {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold dark:text-white text-sm">{s.ip_address}</p>
                                                {s.is_current && <span className="text-[8px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">ONLINE</span>}
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px] md:max-w-xs">{s.user_agent.split('(')[0]}</p>
                                        </div>
                                    </div>
                                    {!s.is_current && (
                                        <button 
                                            onClick={() => handleTerminate(s.id)} 
                                            className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all md:opacity-0 md:group-hover:opacity-100"
                                            title="Sessiyani yakunlash"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-8 bg-slate-50 dark:bg-white/5 rounded-[28px] border-2 border-dashed border-slate-200 dark:border-white/5">
                                    <p className="text-slate-400 text-sm font-medium">Sessiyalar topilmadi</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, y: 20, scale: 0.95 }} 
                            className="bg-white dark:bg-[#1c1c1d] w-full max-w-xl rounded-[40px] p-8 md:p-10 relative shadow-2xl border dark:border-white/10"
                        >
                            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-white/5 rounded-full dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"><X size={20} /></button>
                            
                            <h2 className="text-2xl font-black dark:text-white mb-8">Profilni tahrirlash</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">To'liq ism-sharif</label>
                                    <input 
                                        value={formData.full_name} 
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                                        className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 ring-blue-500/50 dark:text-white font-bold transition-all border border-transparent focus:border-blue-500" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Jins</label>
                                    <select 
                                        value={formData.gender} 
                                        onChange={e => setFormData({ ...formData, gender: e.target.value as any })} 
                                        className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white font-bold transition-all border border-transparent focus:border-blue-500 appearance-none"
                                    >
                                        <option value="male">Erkak</option>
                                        <option value="female">Ayol</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tug'ilgan sana</label>
                                    <input 
                                        type="date" 
                                        value={formData.birth_date} 
                                        onChange={e => setFormData({ ...formData, birth_date: e.target.value })} 
                                        className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white font-bold transition-all border border-transparent focus:border-blue-500" 
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Bio</label>
                                    <textarea 
                                        value={formData.bio} 
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                                        className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 ring-blue-500/50 dark:text-white font-medium min-h-[100px] transition-all border border-transparent focus:border-blue-500 resize-none" 
                                    />
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleUpdateProfile} 
                                disabled={loading} 
                                className="w-full mt-8 py-5 bg-blue-500 text-white rounded-[24px] font-black shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "SAQLASH"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value }: { label: string, value: any }) => (
    <div className="bg-white dark:bg-[#151516] p-6 rounded-[32px] border dark:border-white/5 text-center shadow-sm hover:shadow-md transition-all group">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest group-hover:text-blue-500 transition-colors">{label}</p>
        <p className="text-2xl font-black dark:text-white">{value}</p>
    </div>
);

const StatusRow = ({ label, icon }: { label: string, icon: any }) => (
    <div className="flex items-center justify-between text-[13px] font-bold dark:text-slate-300">
        <span className="opacity-70">{label}</span>
        {icon}
    </div>
);

function InfoItem({ icon, label, value, verified, isFullWidth, action }: any) {
    return (
        <div className={`p-5 rounded-[30px] bg-white dark:bg-white/5 border dark:border-white/5 flex items-center gap-4 ${isFullWidth ? 'md:col-span-2' : ''} shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/[0.07]`}>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <p className={`font-bold text-[13px] truncate ${value === "Ulanmagan" || value === "—" ? "text-slate-400" : "dark:text-white"}`}>{value}</p>
                    {verified && <ShieldCheck size={14} className="text-blue-500 shrink-0" />}
                </div>
            </div>
            {action}
        </div>
    )
}