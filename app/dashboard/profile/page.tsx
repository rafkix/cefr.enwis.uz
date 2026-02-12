"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Mail, Trash2,
    Calendar, User2, Settings2,
    Check, ShieldAlert, SmartphoneNfc,
    Globe, Lock, LogOut, ChevronRight,
    AtSign, AlignLeft, X
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfile, uploadAvatar, getMySessions,
    getMyContacts, terminateSession
} from "@/lib/api/user"
import { UserSession, UserContact, UpdateProfilePayload } from "@/lib/types/user"
import { toast } from "sonner"

// .env dan API URL ni olish
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function ProfilePage() {
    const { user, refreshUser, logout } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    const [formData, setFormData] = useState<UpdateProfilePayload>({
        full_name: "", 
        bio: "", 
        birth_date: "", 
        gender: 'male'
    })

    // Kontaktlarni saralash
    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);

    // Ma'lumotlarni yuklash
    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { 
            console.error("Ma'lumot yuklashda xatolik:", err) 
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

    /**
     * SIZ AYTGAN ANIQ MANTIQ:
     * 1. Raqam mavjud bo'lsa (verified emas) -> verify_phone
     * 2. Raqam mavjud bo'lmasa -> phone_userId
     */
    const handleVerify = () => {
        let botLink = "";
        
        if (phoneContact && phoneContact.value) {
            // 1-shart: Agar foydalanuvchida telefon raqami allaqachon mavjud bo'lsa
            botLink = "https://t.me/EnwisAuthBot?start=verify_phone";
            toast.info("Tasdiqlash uchun botga yo'naltirilmoqda...");
        } else {
            // 2-shart: Agar telefon raqami umuman bo'lmasa
            // (Bu yerda purePhone sifatida mavjud bo'lmagan raqam o'rniga user ma'lumotidan foydalanamiz)
            const userId = user?.id;
            const fallbackPhone = "connect"; // Agar raqam yo'q bo'lsa, identifikator sifatida
            botLink = `https://t.me/EnwisAuthBot?start=${fallbackPhone}_${userId}`;
            toast.info("Raqamni ulash uchun botga o'ting");
        }

        setTimeout(() => {
            window.open(botLink, "_blank");
        }, 500);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return toast.error("Rasm hajmi 5MB dan kichik bo'lishi kerak");

        setLoading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
        } catch { 
            toast.error("Rasmni yuklashda xato yuz berdi");
        } finally { 
            setLoading(false);
        }
    }

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Ma'lumotlar saqlandi");
        } catch { 
            toast.error("Saqlashda xatolik yuz berdi");
        } finally { 
            setLoading(false);
        }
    }

    const getAvatarSrc = () => {
        if (!user?.profile?.avatar_url) return null;
        if (user.profile.avatar_url.startsWith('http')) return user.profile.avatar_url;
        return `${API_URL}${user.profile.avatar_url}`;
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0f0f0f] py-6 px-4 font-sans transition-colors duration-300">
            <div className="max-w-md mx-auto space-y-4">
                
                {/* PROFIL KARTASI */}
                <div className="bg-white dark:bg-[#1c1c1d] rounded-[32px] shadow-sm overflow-hidden border dark:border-white/5">
                    <div className="p-8 flex flex-col items-center border-b dark:border-white/5 relative">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-500/20 dark:ring-blue-500/40">
                                {getAvatarSrc() ? (
                                    <img src={getAvatarSrc()!} className="w-full h-full object-cover" alt="Avatar" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                        <UserCircle2 size={64} />
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 bg-[#0088cc] text-white p-2 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </div>
                        
                        <h2 className="text-xl font-black dark:text-white tracking-tight">
                            {user?.profile?.full_name || "Foydalanuvchi"}
                        </h2>
                        <p className="text-blue-500 text-xs font-bold mt-1">@{user?.username}</p>
                    </div>

                    {/* KONTAKTLAR */}
                    <div className="p-2">
                        <ProfileItem 
                            icon={<Phone size={18} className="text-green-500" />} 
                            label="Telefon" 
                            value={phoneContact?.value || "Ulanmagan"}
                            verified={phoneContact?.is_verified}
                            statusText={phoneContact?.is_verified ? "Tasdiqlangan" : (phoneContact?.value ? "Tasdiqlash" : "Ulash")}
                            onClick={!phoneContact?.is_verified ? handleVerify : undefined}
                        />
                        <ProfileItem 
                            icon={<Mail size={18} className="text-orange-500" />} 
                            label="Elektron pochta" 
                            value={user?.email || "—"} 
                            verified={true}
                        />
                    </div>
                </div>

                {/* TUGMALAR */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-white dark:bg-[#1c1c1d] dark:text-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-2 border dark:border-white/5 hover:bg-slate-50 transition-all"
                    >
                        <Settings2 className="text-blue-500" size={20} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Tahrirlash</span>
                    </button>
                    <button 
                        onClick={logout}
                        className="bg-white dark:bg-[#1c1c1d] text-red-500 p-4 rounded-3xl shadow-sm flex flex-col items-center gap-2 border dark:border-white/5 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Chiqish</span>
                    </button>
                </div>

                {/* SESSYALAR */}
                <div className="bg-white dark:bg-[#1c1c1d] rounded-[32px] p-5 shadow-sm border dark:border-white/5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <SmartphoneNfc size={14} /> Faol qurilmalar
                    </h3>
                    <div className="space-y-3">
                        {sessions.map((s) => (
                            <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                                <div className={`p-2 rounded-xl ${s.is_current ? 'bg-blue-500 text-white' : 'bg-white dark:bg-[#242424] text-slate-400'}`}>
                                    {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={16} /> : <Globe size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold dark:text-white truncate">
                                        {s.ip_address} {s.is_current && <span className="text-blue-500 font-black ml-1 text-[9px]">FAOL</span>}
                                    </p>
                                    <p className="text-[9px] text-slate-400 truncate opacity-70">{s.user_agent.split(') ')[1] || "Browser"}</p>
                                </div>
                                {!s.is_current && (
                                    <button 
                                        onClick={() => terminateSession(s.id).then(loadData)}
                                        className="text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {isEditing && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
                        />
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1d] rounded-t-[40px] z-[60] p-8 max-w-lg mx-auto"
                        >
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-8" />
                            <h2 className="text-xl font-black dark:text-white mb-6">Profilni tahrirlash</h2>
                            
                            <div className="space-y-4">
                                <input 
                                    value={formData.full_name} 
                                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                                    placeholder="Ism sharif"
                                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white"
                                />
                                <textarea 
                                    value={formData.bio} 
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                    placeholder="Bio"
                                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white min-h-[100px]"
                                />
                                <button 
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                    className="w-full py-5 bg-[#0088cc] text-white rounded-[24px] font-black text-sm"
                                >
                                    SAQLASH
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function ProfileItem({ icon, label, value, verified, onClick, statusText }: any) {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-4 p-4 rounded-[24px] transition-all group ${onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 active:scale-[0.98]' : ''}`}
        >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-bold dark:text-slate-200 truncate">{value}</p>
            </div>
            <div className="flex items-center gap-2">
                {verified ? (
                    <ShieldCheck size={18} className="text-blue-500" />
                ) : (
                    onClick && (
                        <div className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-xl font-black text-[10px] uppercase">
                            {statusText}
                            <ChevronRight size={12} />
                        </div>
                    )
                )}
            </div>
        </div>
    )
}