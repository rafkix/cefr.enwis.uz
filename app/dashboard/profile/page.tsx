"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Mail, Trash2,
    Calendar, User2, Settings2,
    Check, X, ShieldAlert, SmartphoneNfc,
    ExternalLink, MessageSquare,
    Globe, Lock, LogOut
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfile, uploadAvatar, getMySessions,
    getMyContacts, terminateSession,
    addContactStart, addContactVerify
} from "@/lib/api/user"
import { UserSession, UserContact, UpdateProfilePayload } from "@/lib/types/user"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"
import { toast } from "sonner"
import { IMaskInput } from "react-imask"

export default function ProfilePage() {
    const { user, refreshUser, logout } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // States
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    const [formData, setFormData] = useState<UpdateProfilePayload>({
        full_name: "", bio: "", birth_date: "", gender: 'male'
    })

    // Telefon va OTP States
    const [showOTPModal, setShowOTPModal] = useState(false)
    const [otpCode, setOtpCode] = useState("")
    const [newPhone, setNewPhone] = useState("")
    const [isSendingOTP, setIsSendingOTP] = useState(false)
    
    // --- YANGI: Verify ID State ---
    const [verifyPhoneUserId, setVerifyPhoneUserId] = useState<string | null>(null);

    // Kontaktlarni ajratish
    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);
    const emailContact = useMemo(() => contacts.find(c => c.contact_type === 'email'), [contacts]);

    // --- YANGI: Dinamik Bot Havolasi ---
    const telegramBotLink = useMemo(() => {
        return `https://t.me/EnwisAuthBot?start=${user?.id}`;
    }, [user]);

    const isGoogleUser = useMemo(() => user?.provider === 'google.com', [user]);

    const completion = useMemo(() => {
        let score = 0;
        if (user?.profile?.full_name) score += 25;
        if (user?.profile?.avatar_url) score += 25;
        if (user?.profile?.birth_date) score += 25;
        if (phoneContact?.is_verified) score += 25;
        return score;
    }, [user, phoneContact]);

    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { console.error("Ma'lumot yuklashda xato:", err) }
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

    // --- FUNKSIYALAR ---

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Profil yangilandi");
        } catch { toast.error("Xatolik: Saqlab bo'lmadi") } finally { setLoading(false) }
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return toast.error("Rasm hajmi 2MB dan oshmasligi kerak");

        setLoading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
        } catch { toast.error("Rasmni yuklashda xatolik") } finally { setLoading(false) }
    }

    // --- YANGILANGAN: Verifikatsiyani boshlash ---
    const handleStartVerification = async () => {
        const purePhone = newPhone.replace(/\D/g, "");

        if (!phoneContact && purePhone.length < 12) {
            return toast.error("Iltimos, telefon raqamingizni to'liq kiriting");
        }

        const phoneToVerify = phoneContact ? phoneContact.value : purePhone;

        setIsSendingOTP(true);
        try {
            const res = await addContactStart({ type: 'phone', value: phoneToVerify });
            
            // Backenddan kelgan vaqtinchalik ID ni saqlaymiz
            if (res.data?.user_id) {
                setVerifyPhoneUserId(res.data.user_id);
                setShowOTPModal(true);
                toast.info("Tasdiqlash kodi Telegram botga yuborildi");
                
                // Botni yangi oynada ochish
                window.open(telegramBotLink, "_blank");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Xatolik yuz berdi");
        } finally { setIsSendingOTP(false) }
    }

    // --- YANGILANGAN: Kodni tasdiqlash ---
    const handleVerifyOTP = async () => {
        if (otpCode.length < 6) return toast.error("6 xonali kodni kiriting");
        if (!verifyPhoneUserId) return toast.error("Tasdiqlash ID topilmadi, qaytadan urinib ko'ring");

        setLoading(true);
        try {
            await addContactVerify({
                type: 'phone',
                value: phoneContact ? phoneContact.value : newPhone.replace(/\D/g, ""),
                code: otpCode,
                verify_phone_user_id: verifyPhoneUserId // ID ni yuboramiz
            });
            
            await refreshUser();
            await loadData();
            setShowOTPModal(false);
            setOtpCode("");
            toast.success("Telefon raqami muvaffaqiyatli tasdiqlandi!");
        } catch (err: any) { 
            toast.error(err.response?.data?.message || "Kod noto'g'ri yoki eskirgan");
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen py-6 sm:py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 px-4">
                
                {/* CHAP TOMON */}
                <div className="lg:col-span-8 space-y-6">
                    {/* ... (Google notification qismi o'zgarishsiz qoladi) ... */}

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
                        {/* ... (Profil tahrirlash UI qismi o'zgarishsiz qoladi) ... */}
                    </motion.div>

                    {/* ALOQA VA TASDIQLASH */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-blue-500" /> Aloqa ma'lumotlari
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email Card */}
                            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm"><Mail size={20} /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Email manzili</p>
                                        <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{emailContact?.value || user?.email}</p>
                                    </div>
                                </div>
                                <ShieldCheck className="text-emerald-500" size={18} />
                            </div>

                            {/* Phone Card */}
                            <div className={`p-5 rounded-3xl border transition-all ${phoneContact?.is_verified ? 'bg-slate-50 border-slate-100' : 'bg-amber-50 border-amber-100'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl shadow-sm ${phoneContact?.is_verified ? 'bg-white text-emerald-500' : 'bg-white text-amber-500'}`}><Phone size={20} /></div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Telefon raqam</p>
                                            {phoneContact ? (
                                                <p className="text-sm font-bold text-slate-700">{phoneContact.value}</p>
                                            ) : (
                                                <IMaskInput
                                                    mask="+{998} (00) 000-00-00"
                                                    value={newPhone}
                                                    unmask={true}
                                                    onAccept={(value) => setNewPhone(value)}
                                                    placeholder="+998 (__) ___-__-__"
                                                    className="bg-transparent text-sm font-bold outline-none w-full placeholder:text-slate-400 text-slate-700"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {phoneContact?.is_verified && <ShieldCheck className="text-emerald-500" size={18} />}
                                </div>

                                {!phoneContact?.is_verified && (
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleStartVerification}
                                            disabled={isSendingOTP}
                                            className="w-full py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.97] shadow-lg shadow-blue-100"
                                        >
                                            {isSendingOTP ? <Loader2 className="animate-spin" size={14} /> : <MessageSquare size={14} />}
                                            Kodni olish
                                        </button>
                                        <a
                                            href={telegramBotLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 text-[9px] font-black text-blue-600 uppercase hover:text-blue-700 transition-colors"
                                        >
                                            <ExternalLink size={12} /> Botni ochish
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* O'NG TOMON (SIDEBAR) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* ... (Status Card va Sessions o'zgarishsiz qoladi) ... */}
                </div>
            </div>

            {/* OTP MODAL */}
            <AnimatePresence>
                {showOTPModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] p-8 sm:p-10 max-w-sm w-full text-center shadow-2xl relative"
                        >
                            <button onClick={() => setShowOTPModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>

                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <SmartphoneNfc size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-2">Tasdiqlash kodi</h3>
                            <p className="text-[11px] text-slate-500 mb-8 font-medium px-4 leading-relaxed">
                                <a href={telegramBotLink} target="_blank" className="text-blue-600 font-bold hover:underline">@EnwisAuthBot</a> ga yuborilgan 6 xonali kodni kiriting.
                            </p>

                            <input
                                type="text"
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                className="w-full text-center text-4xl font-black tracking-[10px] p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none mb-8 transition-all"
                                placeholder="000000"
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowOTPModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={loading || otpCode.length < 6}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.97] transition-all"
                                >
                                    {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Tasdiqlash"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}