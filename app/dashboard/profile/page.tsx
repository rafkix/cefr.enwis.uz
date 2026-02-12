"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Phone, ShieldCheck, Smartphone, UserCircle2, Mail, Trash2,
    Calendar, Settings2, SmartphoneNfc, Globe, LogOut, X, Info, Heart,
    ShieldAlert, BadgeCheck, Clock, Loader2, SendHorizontal, Check, Plus
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfile, uploadAvatar, getMySessions,
    getMyContacts, terminateSession, addContactStart
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

    // Bot linkini yasash (Sen aytgan formatda: start=phone)
    const telegramBotLink = useMemo(() => {
        if (phoneContact?.value) {
            const cleanPhone = phoneContact.value.replace(/\+/g, "");
            return `https://t.me/EnwisAuthBot?start=${cleanPhone}`;
        }
        return "https://t.me/EnwisAuthBot?start=verify_phone";
    }, [phoneContact]);

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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (!val.startsWith("998")) val = "998" + val;
        val = val.substring(0, 12);
        setPhoneInput("+" + val);
    };

    const handleSavePhone = async () => {
        const cleanPhone = phoneInput.replace(/\+/g, "");
        if (cleanPhone.length < 12) {
            toast.error("Raqamni to'liq kiriting");
            return;
        }

        setLoading(true);
        try {
            // Alohida kontakt sifatida saqlaymiz
            await addContactStart({
                type: "phone",
                value: "+" + cleanPhone
            });
            
            await refreshUser();
            await loadData();
            setIsAddingPhone(false);
            toast.success("Raqam ulandi! Endi botda tasdiqlang.");
            
            // Avtomatik botga yuborish (ixtiyoriy)
            window.open(`https://t.me/EnwisAuthBot?start=${cleanPhone}`, "_blank");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Ma'lumotlar saqlandi");
        } catch { toast.error("Xatolik") }
        finally { setLoading(false) }
    };

    // Helper: Sana va Yosh
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const calculateAge = (dateStr: string | undefined) => {
        if (!dateStr) return "—";
        const age = new Date().getFullYear() - new Date(dateStr).getFullYear();
        return age > 0 ? age : 0;
    };

    function handleCheckStatus(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error("Function not implemented.")
    }

    function handleTerminate(id: string): void {
        throw new Error("Function not implemented.")
    }

    return (
        <div className="min-h-screen  dark:bg-[#0a0a0b] py-12 px-4 selection:bg-blue-500/30">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT SIDE */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5 text-center relative">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-4 ring-blue-500/5 bg-slate-100 dark:bg-white/5">
                                {user?.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={80} /></div>
                                )}
                                {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-3 rounded-2xl shadow-lg"><Camera size={18} /></button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {/* handleAvatarUpload code */}} accept="image/*" />
                        </div>
                        <h1 className="text-2xl font-black dark:text-white mb-2">{user?.profile?.full_name || "Ism yo'q"}</h1>
                        <p className="text-blue-500 font-bold text-sm mb-6">@{user?.profile.username || "user"}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(true)} className="flex-1 bg-slate-50 dark:bg-white/5 dark:text-white py-4 rounded-2xl font-black text-[10px] tracking-widest border dark:border-white/5 uppercase flex items-center justify-center gap-2"><Settings2 size={16} /> TAHRIRLASH</button>
                            <button onClick={logout} className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl border border-red-100 dark:border-red-500/20"><LogOut size={20} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard label="Yosh" value={calculateAge(user?.profile?.birth_date)} />
                        <StatCard label="Jins" value={user?.profile?.gender === 'female' ? 'Ayol' : 'Erkak'} />
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[32px] p-6 border dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <ShieldAlert size={20} /><p className="font-black text-xs uppercase tracking-widest">Xavfsizlik</p>
                        </div>
                        <div className="space-y-3">
                            <StatusRow label="Tasdiqlangan" icon={<BadgeCheck className={phoneContact?.is_verified ? "text-green-500" : "text-slate-300"} size={16} />} />
                            <StatusRow label="Ikki bosqichli" icon={<div className={`w-2.5 h-2.5 rounded-full ${phoneContact?.is_verified ? "bg-green-500 shadow-lg" : "bg-slate-300"}`} />} />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-2"><Info size={22} className="text-blue-500" /> Kontaktlar</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* TELEFON CARD */}
                            <div className="p-5 rounded-[30px] bg-white dark:bg-white/5 border dark:border-white/5 flex items-center gap-4 shadow-sm hover:bg-slate-50 dark:hover:bg-white/[0.07] transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0"><Phone size={20} className="text-green-500" /></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Telefon</p>
                                    {isAddingPhone ? (
                                        <input autoFocus value={phoneInput} onChange={handlePhoneChange} className="bg-transparent border-none outline-none text-[13px] font-bold dark:text-white w-full" />
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <p className="font-bold text-[13px] dark:text-white truncate">{phoneContact?.value || "Ulanmagan"}</p>
                                            {phoneContact?.is_verified && <ShieldCheck size={14} className="text-blue-500" />}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="ml-auto">
                                    {!phoneContact && !isAddingPhone && (
                                        <button onClick={() => setIsAddingPhone(true)} className="p-2.5 bg-blue-500 text-white rounded-xl"><Plus size={18} /></button>
                                    )}
                                    {isAddingPhone && (
                                        <div className="flex gap-1">
                                            <button onClick={handleSavePhone} className="p-2 bg-green-500 text-white rounded-lg">{loading ? <Loader2 className="animate-spin" size={16}/> : <Check size={16} />}</button>
                                            <button onClick={() => setIsAddingPhone(false)} className="p-2 bg-red-500 text-white rounded-lg"><X size={16} /></button>
                                        </div>
                                    )}
                                    {phoneContact && !phoneContact.is_verified && (
                                        <a href={telegramBotLink} target="_blank" className="text-[9px] font-black text-white bg-[#0088cc] px-3 py-2 rounded-xl uppercase flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"><SendHorizontal size={12} /> TASDIQLASH</a>
                                    )}
                                </div>
                            </div>

                            <InfoItem icon={<Mail className="text-orange-500" />} label="Email" value={emailContact?.value || "—"} verified={true} />
                            <InfoItem icon={<Clock className="text-blue-400" />} label="Sana" value={formatDate(user?.created_at)} />
                            <InfoItem icon={<Calendar className="text-purple-500" />} label="Tug'ilgan kun" value={formatDate(user?.profile?.birth_date)} />
                            <InfoItem icon={<Heart className="text-pink-500" />} label="BIO" value={user?.profile?.bio || "Ma'lumot yo'q"} isFullWidth />
                        </div>

                        {phoneContact && !phoneContact.is_verified && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/5 rounded-[24px] border border-blue-100 dark:border-blue-500/10 flex items-center justify-between gap-4">
                                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Botda tasdiqladingizmi?</p>
                                <button onClick={handleCheckStatus} disabled={checking} className="px-6 py-2 bg-white dark:bg-white/10 rounded-xl text-[10px] font-black text-blue-500 border border-blue-200 dark:border-blue-500/20 uppercase hover:bg-blue-50 transition-all">{checking ? <Loader2 className="animate-spin" size={14} /> : "YANGILASH"}</button>
                            </div>
                        )}
                    </div>

                    {/* SESSIONS */}
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2"><SmartphoneNfc size={22} className="text-blue-500" /> Sessiyalar</h3>
                        <div className="space-y-3">
                            {latestSessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-5 rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 group hover:border-blue-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${s.is_current ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/10 text-slate-400'}`}>{s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Globe size={20} />}</div>
                                        <div>
                                            <p className="font-bold dark:text-white text-sm">{s.ip_address} {s.is_current && <span className="ml-2 text-[8px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">Hozir</span>}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{s.user_agent.split('(')[0]}</p>
                                        </div>
                                    </div>
                                    {!s.is_current && <button onClick={() => handleTerminate(s.id)} className="p-3 text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL - Xuddi sening dizayningdek */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1c1c1d] w-full max-w-xl rounded-[40px] p-8 relative border dark:border-white/10 shadow-2xl">
                            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-white/5 rounded-full dark:text-white"><X size={20} /></button>
                            <h2 className="text-2xl font-black dark:text-white mb-8">Profilni tahrirlash</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Ism-sharif</label>
                                    <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-blue-500 dark:text-white font-bold transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Jins</label>
                                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white font-bold transition-all appearance-none">
                                        <option value="male">Erkak</option>
                                        <option value="female">Ayol</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tug'ilgan sana</label>
                                    <input type="date" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white font-bold transition-all" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Bio</label>
                                    <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white font-medium h-24 resize-none transition-all" />
                                </div>
                            </div>
                            <button onClick={handleUpdateProfile} disabled={loading} className="w-full mt-8 py-5 bg-blue-500 text-white rounded-[24px] font-black shadow-xl shadow-blue-500/20">{loading ? <Loader2 className="animate-spin mx-auto" /> : "SAQLASH"}</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- SUB COMPONENTS ---

const StatCard = ({ label, value }: any) => (
    <div className="bg-white dark:bg-[#151516] p-6 rounded-[32px] border dark:border-white/5 text-center shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{label}</p>
        <p className="text-2xl font-black dark:text-white">{value}</p>
    </div>
);

const StatusRow = ({ label, icon }: any) => (
    <div className="flex items-center justify-between text-[13px] font-bold dark:text-slate-300">
        <span className="opacity-70">{label}</span>
        {icon}
    </div>
);

function InfoItem({ icon, label, value, verified, isFullWidth }: any) {
    return (
        <div className={`p-5 rounded-[30px] bg-white dark:bg-white/5 border dark:border-white/5 flex items-center gap-4 ${isFullWidth ? 'md:col-span-2' : ''} shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/[0.07]`}>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center shrink-0">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <p className={`font-bold text-[13px] truncate ${value === "—" ? "text-slate-400" : "dark:text-white"}`}>{value}</p>
                    {verified && <ShieldCheck size={14} className="text-blue-500 shrink-0" />}
                </div>
            </div>
        </div>
    )
}