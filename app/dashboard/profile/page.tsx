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
// Telefon raqami uchun maska kutubxonasi (o'rnatish: npm install react-imask)
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

    // Foydalanuvchi Google orqali kirganmi?
    const isGoogleUser = useMemo(() => user?.provider === 'google.com', [user]);

    // Kontaktlarni ajratish
    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);
    const emailContact = useMemo(() => contacts.find(c => c.contact_type === 'email'), [contacts]);

    // Profil to'liqligi (%)
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
        } catch { toast.error("Xatolik: Ma'lumotlarni saqlab bo'lmadi") } finally { setLoading(false) }
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error("Rasm hajmi 2MB dan oshmasligi kerak");
        }

        setLoading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
        } catch { toast.error("Rasmni yuklashda xatolik") } finally { setLoading(false) }
    }

    const handleStartVerification = async () => {
        // Maska ichidagi raqamlarni tozalab olish (faqat raqamlar)
        const purePhone = newPhone.replace(/\D/g, "");

        if (!phoneContact && purePhone.length < 12) {
            return toast.error("Iltimos, to'liq telefon raqamingizni kiriting");
        }

        const phoneToVerify = phoneContact ? phoneContact.value : purePhone;

        setIsSendingOTP(true);
        try {
            await addContactStart({ type: 'phone', value: phoneToVerify });
            setShowOTPModal(true);
            toast.info("Tasdiqlash kodi Telegram botga yuborildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Xatolik yuz berdi");
        } finally { setIsSendingOTP(false) }
    }

    const handleVerifyOTP = async () => {
        if (otpCode.length < 6) return toast.error("6 xonali kodni kiriting");
        setLoading(true);
        try {
            await addContactVerify({
                type: 'phone',
                value: phoneContact ? phoneContact.value : newPhone.replace(/\D/g, ""),
                code: otpCode
            });
            await refreshUser();
            await loadData();
            setShowOTPModal(false);
            setOtpCode("");
            toast.success("Telefon raqami tasdiqlandi!");
        } catch { toast.error("Kod noto'g'ri yoki eskirgan") } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen py-6 sm:py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 px-4">

                {/* CHAP TOMON: ASOSIY MA'LUMOTLAR */}
                <div className="lg:col-span-8 space-y-6">

                    {/* GOOGLE USERS NOTIFICATION */}
                    {isGoogleUser && (
                        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4 flex items-center gap-4">
                            <div className="bg-white p-2 rounded-xl shadow-sm">
                                <Globe className="text-blue-500" size={20} />
                            </div>
                            <p className="text-xs font-semibold text-blue-700">
                                Siz Google hisobi orqali kirdingiz. Ba'zi ma'lumotlar avtomatik sinxronizatsiya qilingan.
                            </p>
                        </div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Settings2 /></div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Shaxsiy profil</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Tizimdagi ID: {String(user?.id).slice(0, 8)}...
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                            >
                                {isEditing ? "Bekor qilish" : "Tahrirlash"}
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="relative self-center shrink-0">
                                <div className="w-40 h-40 rounded-[50px] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl group">
                                    {user?.profile?.avatar_url ? (
                                        <img src={user.profile.avatar_url} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={100} /></div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Camera size={18} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">To'liq ism (F.I.SH)</label>
                                    {isEditing ? (
                                        <input
                                            value={formData.full_name}
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Ism va familiyangizni kiriting"
                                        />
                                    ) : (
                                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{user?.profile?.full_name || "Ism kiritilmagan"}</h2>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><Calendar size={12} /> Tug'ilgan sana</span>
                                        {isEditing ? (
                                            <input type="date" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="bg-transparent font-bold outline-none w-full text-slate-900" />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700">{user?.profile?.birth_date || "—"}</p>
                                        )}
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><User2 size={12} /> Jinsi</span>
                                        {isEditing ? (
                                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="bg-transparent font-bold outline-none w-full text-slate-900">
                                                <option value="male">Erkak</option>
                                                <option value="female">Ayol</option>
                                            </select>
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700 uppercase">{user?.profile?.gender === 'male' ? 'Erkak' : user?.profile?.gender === 'female' ? 'Ayol' : '—'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Saqlash
                            </button>
                        )}
                    </motion.div>

                    {/* ALOQA VA TASDIQLASH */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-blue-500" /> Aloqa ma'lumotlari
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.97]"
                                        >
                                            {isSendingOTP ? <Loader2 className="animate-spin" size={14} /> : <MessageSquare size={14} />}
                                            Bot orqali tasdiqlash
                                        </button>
                                        <a
                                            href="https://t.me/EnwisAuthBot"
                                            target="_blank"
                                            className="flex items-center justify-center gap-2 text-[9px] font-black text-blue-600 uppercase hover:text-blue-700 transition-colors"
                                        >
                                            <ExternalLink size={12} /> @EnwisAuthBot ga start bosing
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* O'NG TOMON: SIDEBAR */}
                <div className="lg:col-span-4 space-y-6">

                    {/* STATUS CARD */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6 text-blue-400">
                                <ShieldAlert size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Xavfsizlik darajasi</span>
                            </div>
                            <div className="text-5xl font-black mb-3">{completion}%</div>
                            <div className="w-full bg-slate-800 h-2.5 rounded-full mb-6 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completion}%` }}
                                    className={`h-full rounded-full ${completion === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                />
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                {completion < 100
                                    ? "Diqqat! Imtihonlarga ruxsat olish uchun telefon raqamingizni tasdiqlashingiz va profilni to'liq to'ldirishingiz shart."
                                    : "Profilingiz to'liq himoyalangan. Siz barcha tizim imkoniyatlaridan cheklovsiz foydalanishingiz mumkin."}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* SESSIONS */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Lock size={14} /> Faol sessiyalar
                        </h3>
                        <div className="space-y-4">
                            {sessions.slice(0, 4).map(s => (
                                <div key={s.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group">
                                    <div className={`p-2.5 rounded-xl shadow-sm ${s.is_current ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400'}`}>
                                        <Smartphone size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] font-black text-slate-900 uppercase truncate">
                                                {s.user_agent.includes('Chrome') ? 'Web Browser' : 'Mobile App'}
                                            </p>
                                            {s.is_current && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold italic">
                                            {formatDistanceToNow(new Date(s.updated_at), { addSuffix: true, locale: uz })}
                                        </p>
                                    </div>
                                    {!s.is_current && (
                                        <button
                                            onClick={() => terminateSession(s.id).then(() => loadData())}
                                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LOGOUT */}
                    <button
                        onClick={() => logout()}
                        className="w-full p-6 bg-red-50 text-red-600 rounded-[35px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-100 transition-all border border-red-100 shadow-sm shadow-red-50"
                    >
                        <LogOut size={16} /> Tizimdan chiqish
                    </button>
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

                            <h3 className="text-2xl font-black text-slate-900 mb-2">Botdagi kodni kiriting</h3>
                            <p className="text-[11px] text-slate-500 mb-8 font-medium px-4 leading-relaxed">
                                <a href="https://t.me/EnwisAuthBot" target="_blank" className="text-blue-600 font-bold hover:underline">@EnwisAuthBot</a> ga yuborilgan 6 xonali tasdiqlash kodini kiriting.
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
                                    Yopish
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