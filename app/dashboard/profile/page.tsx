"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Phone, ShieldCheck, Smartphone, UserCircle2, Mail, Trash2,
    Calendar, Settings2, SmartphoneNfc, Globe, LogOut, X, Info, Heart,
    ShieldAlert, BadgeCheck, Clock,
    Loader2
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
    const [formData, setFormData] = useState<UpdateProfilePayload>({
        full_name: "", bio: "", birth_date: "", gender: 'male'
    })

    // 1. Kontaktlar mantiqi
    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);
    const emailContact = useMemo(() => contacts.find(c => c.contact_type === "email"), [contacts]);

    // 2. Faqat oxirgi 3 ta sessiya
    const latestSessions = useMemo(() => sessions.slice(0, 3), [sessions]);

    // 3. Yoshni aniq hisoblash (Ham chapda, ham o'ngda ishlatiladi)
    const calculateAge = useCallback((birthDate: string | undefined) => {
        if (!birthDate) return "—";
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age < 0 ? 0 : age;
    }, []);

    // 4. Sanani formatlash (Masalan: 12-fevral, 2024)
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "Kiritilmagan";
        return new Date(dateStr).toLocaleDateString('uz-UZ', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { console.error("Ma'lumot yuklashda xatolik:", err) }
    }, [])

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
    }, [user, loadData])

    // --- API FUNKSIYALARI ---

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
        } catch (err) {
            toast.error("Rasm yuklashda xatolik");
        } finally { setUploading(false) }
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
    }

    const handleTerminate = async (sid: string) => {
        try {
            await terminateSession(sid);
            setSessions(prev => prev.filter(s => s.id !== sid));
            toast.success("Sessiya yopildi");
        } catch { toast.error("Sessiyani yopib bo'lmadi") }
    };

    // OTP va Raqam qo'shish uchun yangi statelar
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [step, setStep] = useState<'input' | 'verify'>('input'); // 1-bosqich: raqam kiritish, 2-bosqich: kod
    const [isVerifying, setIsVerifying] = useState(false);

    // Raqamga kod yuborish
    const handleSendCode = async () => {
        if (phoneNumber.length < 9) return toast.error("Raqamni to'liq kiriting");
        setIsVerifying(true);
        try {
            // Backend API: masalan /auth/send-otp
            // await sendOTP(phoneNumber); 
            setStep('verify');
            toast.success("Tasdiqlash kodi yuborildi");
        } catch {
            toast.error("Kod yuborishda xatolik");
        } finally { setIsVerifying(false); }
    };

    // Kodni tasdiqlash
    const handleVerifyCode = async () => {
        if (otpCode.length < 4) return toast.error("Kodni kiriting");
        setIsVerifying(true);
        try {
            // Backend API: masalan /auth/verify-phone
            // await verifyPhone(phoneNumber, otpCode);
            await loadData(); // Kontaktlarni qayta yuklash
            setIsPhoneModalOpen(false);
            setStep('input');
            toast.success("Telefon raqami tasdiqlandi!");
        } catch {
            toast.error("Kod noto'g'ri kiritildi");
        } finally { setIsVerifying(false); }
    };

    return (
        <div className="min-h-screen dark:bg-[#0a0a0b] py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* CHAP USTUN */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5 text-center relative overflow-hidden">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-4 ring-blue-500/5 shadow-2xl bg-slate-100">
                                {user?.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={80} /></div>
                                )}
                                {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform"><Camera size={18} /></button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                        </div>
                        <h1 className="text-2xl font-black dark:text-white leading-tight">{user?.profile?.full_name || "Ism kiritilmagan"}</h1>
                        <p className="text-blue-500 font-bold text-sm mb-6">@{user?.profile.username}</p>

                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(true)} className="flex-1 bg-slate-50 dark:bg-white/5 dark:text-white py-4 rounded-2xl font-black text-[10px] tracking-widest border dark:border-white/5 hover:bg-white transition-all uppercase">
                                <Settings2 size={16} className="inline mr-1" /> Tahrirlash
                            </button>
                            <button onClick={logout} className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl border border-red-100 dark:border-red-500/20"><LogOut size={20} /></button>
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
                            <StatusRow label="Verified" icon={<BadgeCheck className="text-green-500" size={14} />} />
                            <StatusRow label="Two-Factor" icon={<div className="w-2 h-2 rounded-full bg-slate-300" />} />
                        </div>
                    </div>
                </div>

                {/* O'NG USTUN */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-2"><Info size={22} className="text-blue-500" /> Shaxsiy ma'lumotlar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InfoItem
                                icon={<Phone className="text-green-500" />}
                                label="Telefon"
                                value={phoneContact?.value || "Ulanmagan"}
                                verified={phoneContact?.is_verified}
                                action={!phoneContact?.is_verified && (
                                    <button
                                        onClick={() => setIsPhoneModalOpen(true)}
                                        className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg uppercase ml-auto"
                                    >
                                        {phoneContact ? "Tasdiqlash" : "Ulash"}
                                    </button>
                                )}
                            />
                            <InfoItem icon={<Mail className="text-orange-500" />} label="Email" value={emailContact?.value || "—"} verified={true} />
                            {/* EMAIL OSTIGA QO'SHILGAN YANGI BLOK */}
                            <InfoItem icon={<Clock className="text-blue-400" />} label="Ro'yxatdan o'tilgan" value={formatDate(user?.created_at)} />
                            <InfoItem icon={<Calendar className="text-purple-500" />} label="Tug'ilgan sana (Yosh)" value={`${formatDate(user?.profile?.birth_date)} (${calculateAge(user?.profile?.birth_date)})`} />
                            <InfoItem icon={<Heart className="text-pink-500" />} label="BIO" value={user?.profile?.bio || "Bio ma'lumoti mavjud emas"} isFullWidth />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black dark:text-white flex items-center gap-2"><SmartphoneNfc size={22} className="text-blue-500" /> Oxirgi sessiyalar</h3>
                            <span className="text-[10px] font-black bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full text-slate-500 uppercase">Oxirgi 3 ta</span>
                        </div>
                        <div className="space-y-3">
                            {latestSessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-5 rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${s.is_current ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/10 text-slate-400'}`}>
                                            {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold dark:text-white text-sm">{s.ip_address}</p>
                                                {s.is_current && <span className="text-[8px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black">ONLINE</span>}
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium">{s.user_agent.split('(')[0]}</p>
                                        </div>
                                    </div>
                                    {!s.is_current && (
                                        <button onClick={() => handleTerminate(s.id)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* TELEFON TASDIQLASH MODALI */}
            <AnimatePresence>
                {isPhoneModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white dark:bg-[#1c1c1d] w-full max-w-md rounded-[32px] p-8 relative shadow-2xl">
                            <button onClick={() => setIsPhoneModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400"><X size={20} /></button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    {step === 'input' ? <Smartphone size={32} /> : <ShieldCheck size={32} />}
                                </div>
                                <h3 className="text-xl font-black dark:text-white">
                                    {step === 'input' ? "Telefon raqamini ulash" : "Kodni kiriting"}
                                </h3>
                                <p className="text-sm text-slate-500 mt-2">
                                    {step === 'input'
                                        ? "Xizmatlardan to'liq foydalanish uchun raqamingizni tasdiqlang"
                                        : `+998 ${phoneNumber} raqamiga yuborilgan kodni kiriting`}
                                </p>
                            </div>

                            {step === 'input' ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold dark:text-white">+998</span>
                                        <input
                                            type="tel"
                                            placeholder="90 123 45 67"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                            className="w-full py-4 pl-16 pr-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 ring-blue-500 dark:text-white font-bold"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendCode}
                                        disabled={isVerifying || phoneNumber.length < 9}
                                        className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black shadow-lg disabled:opacity-50"
                                    >
                                        {isVerifying ? <Loader2 className="animate-spin mx-auto" size={20} /> : "KOD YUBORISH"}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="0000"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full py-4 text-center text-2xl tracking-[10px] bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 ring-blue-500 dark:text-white font-black"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setStep('input')} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 dark:text-white rounded-2xl font-bold text-xs uppercase">Orqaga</button>
                                        <button
                                            onClick={handleVerifyCode}
                                            disabled={isVerifying || otpCode.length < 4}
                                            className="flex-[2] py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg disabled:opacity-50 text-xs uppercase"
                                        >
                                            {isVerifying ? <Loader2 className="animate-spin mx-auto" size={20} /> : "TASDIQLASH"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- YORDAMCHI KOMPONENTLAR ---

const StatCard = ({ label, value }: { label: string, value: any }) => (
    <div className="bg-white dark:bg-[#151516] p-6 rounded-[32px] border dark:border-white/5 text-center shadow-sm hover:shadow-md transition-shadow">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
        <p className="text-2xl font-black dark:text-white">{value}</p>
    </div>
);

const StatusRow = ({ label, icon }: { label: string, icon: any }) => (
    <div className="flex items-center justify-between text-xs font-bold dark:text-slate-300">
        <span>{label}</span>
        {icon}
    </div>
);

function InfoItem({ icon, label, value, verified, isFullWidth, action }: any) {
    return (
        <div className={`p-5 rounded-[30px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 flex items-start gap-4 ${isFullWidth ? 'md:col-span-2' : ''}`}>
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-center gap-1.5">
                    <p className="font-bold dark:text-white text-[13px] truncate">{value}</p>
                    {verified && <ShieldCheck size={14} className="text-blue-500 shrink-0" />}
                    {action} {/* <--- Tugma shu yerda chiqadi */}
                </div>
            </div>
        </div>
    )
}