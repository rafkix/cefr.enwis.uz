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
    
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    const [checking, setChecking] = useState(false)
    const [phoneInput, setPhoneInput] = useState("+998")
    const [isAddingPhone, setIsAddingPhone] = useState(false)

    const [formData, setFormData] = useState<UpdateProfilePayload>({
        full_name: "", bio: "", birth_date: "", gender: 'male'
    })

    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);
    const emailContact = useMemo(() => contacts.find(c => c.contact_type === "email"), [contacts]);
    const latestSessions = useMemo(() => sessions.slice(0, 3), [sessions]);

    // --- YANGILANGAN BOT LINKI MANTIGI ---
    const telegramBotLink = useMemo(() => {
        // Agar raqam bazada bo'lsa (Google/Telegramdan kirmagan yoki kiritib bo'lingan holat)
        if (phoneContact?.value) {
            return "https://t.me/EnwisAuthBot?start=verify_phone";
        }
        // Agar yangi raqam biriktirilayotgan bo'lsa
        const userId = user?.id || "";
        const cleanPhone = phoneInput.replace(/\D/g, "");
        return `https://t.me/EnwisAuthBot?start=${cleanPhone}_${userId}`;
    }, [user, phoneContact, phoneInput]);

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

    const handleSavePhone = async () => {
        const cleanPhone = phoneInput.replace(/\s/g, "");
        if (cleanPhone.length < 9) {
            toast.error("Raqamni to'g'ri kiriting");
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                full_name: formData.full_name,
                phone: cleanPhone
            };
            if (formData.bio) payload.bio = formData.bio;
            if (formData.birth_date) payload.birth_date = formData.birth_date;
            if (formData.gender) payload.gender = formData.gender;

            await updateProfile(payload);
            await refreshUser();
            await loadData();
            setIsAddingPhone(false);
            toast.success("Raqam saqlandi. Endi bot orqali tasdiqlang.");
        } catch (err) {
            toast.error("Raqamni saqlashda xatolik yuz berdi");
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDE: AVATAR & STATS */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5 text-center relative">
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
                            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform">
                                <Camera size={18} />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                        </div>
                        
                        <h1 className="text-2xl font-black dark:text-white leading-tight mb-6">
                            {user?.profile?.full_name || "Ism kiritilmagan"}
                        </h1>

                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(true)} className="flex-1 bg-slate-50 dark:bg-white/5 dark:text-white py-4 rounded-2xl font-black text-[10px] tracking-widest border dark:border-white/5 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                <Settings2 size={16} /> TAHRIRLASH
                            </button>
                            <button onClick={logout} className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl border border-red-100 dark:border-red-500/20 hover:bg-red-100 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[32px] p-6 border dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <ShieldAlert size={20} />
                            <p className="font-black text-xs uppercase tracking-widest">Xavfsizlik</p>
                        </div>
                        <div className="space-y-3">
                            <StatusRow label="Tasdiqlangan" icon={<BadgeCheck className={phoneContact?.is_verified ? "text-green-500" : "text-slate-300"} size={16} />} />
                            <StatusRow label="Telegram ulanishi" icon={<div className={`w-2.5 h-2.5 rounded-full ${phoneContact?.is_verified ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-300"}`} />} />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: INFO & CONTACTS */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-2">
                            <Info size={22} className="text-blue-500" /> Profil ma'lumotlari
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InfoItem
                                icon={<Phone className="text-green-500" />}
                                label="Telefon raqami"
                                value={phoneContact?.value || "Kiritilmagan"}
                                verified={phoneContact?.is_verified}
                                action={
                                    <div className="ml-auto">
                                        {/* 1. Raqam yo'q bo'lsa */}
                                        {!phoneContact && !isAddingPhone && (
                                            <button 
                                                onClick={() => setIsAddingPhone(true)}
                                                className="text-[10px] font-black text-white bg-blue-600 px-4 py-2 rounded-xl hover:scale-105 transition-transform uppercase"
                                            >
                                                Biriktirish
                                            </button>
                                        )}

                                        {/* 2. Raqam kiritish inputi */}
                                        {!phoneContact && isAddingPhone && (
                                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 p-1 rounded-xl border dark:border-white/10">
                                                <input
                                                    autoFocus
                                                    value={phoneInput}
                                                    onChange={e => setPhoneInput(e.target.value)}
                                                    className="bg-transparent border-none outline-none text-[12px] font-black dark:text-white px-2 w-28"
                                                />
                                                <button onClick={handleSavePhone} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                    {loading ? <Loader2 className="animate-spin" size={14}/> : <Check size={14} />}
                                                </button>
                                                <button onClick={() => setIsAddingPhone(false)} className="p-1.5 bg-red-500 text-white rounded-lg"><X size={14} /></button>
                                            </div>
                                        )}

                                        {/* 3. Raqam bor lekin tasdiqlanmagan (Siz so'ragan asosiy qism) */}
                                        {phoneContact && !phoneContact.is_verified && (
                                            <a
                                                href={telegramBotLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-black text-white bg-[#0088cc] px-4 py-2 rounded-xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                <SendHorizontal size={14} /> BOTGA O'TISH
                                            </a>
                                        )}
                                    </div>
                                }
                            />

                            <InfoItem icon={<Mail className="text-orange-500" />} label="Email" value={emailContact?.value || "—"} verified={true} />
                            <InfoItem icon={<Clock className="text-blue-400" />} label="Ro'yxatdan o'tilgan" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"} />
                            <InfoItem icon={<Heart className="text-pink-500" />} label="BIO" value={user?.profile?.bio || "Bio ma'lumoti yo'q"} isFullWidth />
                        </div>

                        {/* Tasdiqlashdan keyin yangilash tugmasi */}
                        {phoneContact && !phoneContact.is_verified && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/5 rounded-[24px] border border-blue-100 dark:border-blue-500/10 flex items-center justify-between gap-4">
                                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 italic">Botda tasdiqlashni yakunladingizmi?</p>
                                <button
                                    onClick={handleCheckStatus}
                                    disabled={checking}
                                    className="px-6 py-2 bg-white dark:bg-white/10 rounded-xl text-[10px] font-black text-blue-500 border border-blue-200 hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    {checking ? <Loader2 className="animate-spin" size={14} /> : "STATUSNI YANGILASH"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SESSIONS */}
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2">
                            <SmartphoneNfc size={22} className="text-blue-500" /> Oxirgi sessiyalar
                        </h3>
                        <div className="space-y-3">
                            {latestSessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-5 rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${s.is_current ? 'bg-blue-500 text-white' : 'bg-white dark:bg-white/10 text-slate-400'}`}>
                                            {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold dark:text-white text-sm">{s.ip_address} {s.is_current && <span className="ml-2 text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Hozirgi</span>}</p>
                                            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px] md:max-w-xs">{s.user_agent.split('(')[0]}</p>
                                        </div>
                                    </div>
                                    {!s.is_current && (
                                        <button onClick={() => handleTerminate(s.id)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1c1c1d] w-full max-w-xl rounded-[40px] p-8 relative border dark:border-white/10 shadow-2xl">
                            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-white/5 rounded-full dark:text-white hover:rotate-90 transition-transform"><X size={20} /></button>
                            <h2 className="text-2xl font-black dark:text-white mb-8 uppercase tracking-tight">Profilni tahrirlash</h2>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">To'liq ism-sharif</label>
                                    <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-blue-500 dark:text-white font-bold transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Jins</label>
                                        <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white font-bold appearance-none outline-none border border-transparent focus:border-blue-500 transition-all">
                                            <option value="male">Erkak</option>
                                            <option value="female">Ayol</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tug'ilgan sana</label>
                                        <input type="date" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white font-bold outline-none border border-transparent focus:border-blue-500 transition-all" />
                                    </div>
                                </div>
                            </div>
                            
                            <button onClick={handleUpdateProfile} disabled={loading} className="w-full mt-8 py-5 bg-blue-500 text-white rounded-[24px] font-black shadow-xl disabled:opacity-50 hover:brightness-110 active:scale-[0.98] transition-all">
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "SAQLASH"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- SMALL COMPONENTS ---
const StatusRow = ({ label, icon }: any) => (
    <div className="flex items-center justify-between text-[13px] font-bold dark:text-slate-300">
        <span className="opacity-70">{label}</span>
        {icon}
    </div>
);

function InfoItem({ icon, label, value, verified, isFullWidth, action }: any) {
    return (
        <div className={`p-5 rounded-[30px] bg-white dark:bg-white/5 border dark:border-white/5 flex items-center gap-4 ${isFullWidth ? 'md:col-span-2' : ''} shadow-sm transition-all hover:border-blue-500/20`}>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center shrink-0">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <p className={`font-bold text-[13px] truncate ${value === "Kiritilmagan" ? "text-slate-400 italic" : "dark:text-white"}`}>{value}</p>
                    {verified && <ShieldCheck size={14} className="text-blue-500 shrink-0" />}
                </div>
            </div>
            {action}
        </div>
    )
}