"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Camera, Edit3, Loader2, Phone, ShieldCheck,
    Smartphone, UserCircle2, Info, Mail, Trash2,
    Calendar, User2, Fingerprint, Settings2,
    Check, X, Globe, Hash, ShieldAlert, SmartphoneNfc
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfile, uploadAvatar, getMySessions,
    getMyContacts, terminateSession,
    // Diqqat: Bu funksiyalar backend API-da bo'lishi kerak
    // sendPhoneOTP, verifyPhoneOTP 
} from "@/lib/api/user"
import { UserSession, UserContact, UpdateProfilePayload } from "@/lib/types/user"
import { formatDistanceToNow, format } from "date-fns"
import { uz } from "date-fns/locale"
import { toast } from "sonner"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // Asosiy holatlar
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    
    // Telefon va OTP holatlari
    const [showOTPModal, setShowOTPModal] = useState(false)
    const [otpCode, setOtpCode] = useState("")
    const [phoneInput, setPhoneInput] = useState("")
    const [isVerifying, setIsVerifying] = useState(false)

    const [formData, setFormData] = useState<UpdateProfilePayload>({ 
        full_name: "", bio: "", birth_date: "", gender: 'male'
    })

    const API_URL = useMemo(() => (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, ''), []);

    // Oxirgi 2 ta sessiya
    const recentSessions = useMemo(() => {
        return [...sessions]
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 2);
    }, [sessions]);

    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { console.error(err) }
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

    // 1. Profilni saqlash
    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Profil yangilandi");
        } catch { toast.error("Xatolik") } finally { setLoading(false) }
    }

    // 2. SMS kod yuborish
    const handleSendOTP = async () => {
        if (!phoneInput && !user?.contacts?.find(c => c.contact_type === 'phone')) {
            return toast.error("Telefon raqamni kiriting");
        }
        setIsVerifying(true);
        try {
            // Agar yangi raqam kiritilgan bo'lsa, avval uni saqlaymiz
            if (phoneInput) {
                await updateProfile({ phone: phoneInput } as any);
            }
            // await sendPhoneOTP(); // API chaqiruvi
            setShowOTPModal(true);
            toast.info("Tasdiqlash kodi yuborildi");
        } catch { toast.error("SMS yuborishda xato") } finally { setIsVerifying(false) }
    }

    // 3. Kodni tasdiqlash
    const handleVerifyCode = async () => {
        setLoading(true);
        try {
            // await verifyPhoneOTP(otpCode); // API chaqiruvi
            await refreshUser();
            setShowOTPModal(false);
            toast.success("Telefon raqami tasdiqlandi!");
        } catch { toast.error("Kod noto'g'ri") } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen py-10 px-4 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* CHAP TOMON: ASOSIY MA'LUMOTLAR */}
                <div className="lg:col-span-8 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm relative">
                        {/* Edit Buttons */}
                        <div className="absolute top-8 right-8">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 h-12 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-wider">
                                    <Edit3 size={16} /> Tahrirlash
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className="h-12 w-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center"><X size={20} /></button>
                                    <button onClick={handleSave} className="h-12 px-6 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase flex items-center gap-2">
                                        <Check size={16} /> Saqlash
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Settings2 size={24} /></div>
                            <h1 className="text-2xl font-black text-slate-900">Profil boshqaruvi</h1>
                        </div>

                        {/* Rasm va Ism */}
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="relative self-center">
                                <div className="w-40 h-40 rounded-[50px] overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                                    {user?.profile?.avatar_url ? <img src={user.profile.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={100} /></div>}
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white"><Camera size={18} /></button>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {/* upload logic */}} />
                            </div>

                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">F.I.SH</label>
                                    {isEditing ? (
                                        <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="text-xl font-bold w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none" />
                                    ) : (
                                        <h2 className="text-3xl font-black text-slate-900">{user?.profile?.full_name || "Ism kiritilmagan"}</h2>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Tug'ilgan sana</span>
                                        <p className="font-bold text-slate-700">{user?.profile?.birth_date || "—"}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Jinsi</span>
                                        <p className="font-bold text-slate-700">{user?.profile?.gender === 'male' ? 'Erkak' : 'Ayol'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* TELEFON TASDIQLASH QISMI (MUHIM) */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Fingerprint size={20} className="text-indigo-600" /> Aloqa va Tasdiqlash
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><Mail size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Email</p>
                                    <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                                </div>
                            </div>

                            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center"><Phone size={20} /></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Telefon</p>
                                        {!user?.phone && !phoneInput ? (
                                            <input 
                                                type="text" 
                                                placeholder="+998..." 
                                                className="bg-transparent font-bold text-slate-700 outline-none w-full"
                                                onChange={(e) => setPhoneInput(e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700">{user?.phone || phoneInput}</p>
                                        )}
                                    </div>
                                    {user?.phone_verified && <ShieldCheck className="text-green-500" size={20} />}
                                </div>

                                {!user?.phone_verified && (
                                    <button 
                                        onClick={handleSendOTP}
                                        disabled={isVerifying}
                                        className="w-full py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                                    >
                                        {isVerifying ? <Loader2 size={14} className="animate-spin" /> : <SmartphoneNfc size={14} />}
                                        {user?.phone ? "Raqamni tasdiqlash" : "Raqamni saqlash va tasdiqlash"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* O'NG TOMON: SIDEBAR */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Sessiyalar */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-emerald-500" /> Faol seanslar
                        </h3>
                        <div className="space-y-3">
                            {recentSessions.map(s => (
                                <div key={s.id} className={`p-4 rounded-2xl border ${s.is_current ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <Smartphone size={18} className="text-slate-400" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-900 truncate uppercase">{s.user_agent?.split(' ')[0]}</p>
                                            <p className="text-[9px] text-slate-400 font-bold">{formatDistanceToNow(new Date(s.updated_at), { addSuffix: true, locale: uz })}</p>
                                        </div>
                                        {!s.is_current && <button onClick={() => terminateSession(s.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 text-blue-400"><ShieldAlert size={20} /><span className="text-[10px] font-black uppercase tracking-widest">Xavfsizlik darajasi</span></div>
                            <h4 className="text-2xl font-black mb-2">{user?.phone_verified ? '100%' : '50%'}</h4>
                            <div className="w-full bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
                                <div className={`h-full bg-blue-500 transition-all duration-1000 ${user?.phone_verified ? 'w-full' : 'w-1/2'}`} />
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Profilingizni to'liq tasdiqlang va barcha imtiyozlarga ega bo'ling.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP MODAL (SMS TASDIQLASH) */}
            <AnimatePresence>
                {showOTPModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"><ShieldCheck size={40} /></div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Kodni kiriting</h3>
                            <p className="text-sm text-slate-500 mb-8 font-medium">Sizning telefon raqamingizga tasdiqlash kodi yuborildi.</p>
                            
                            <input 
                                type="text" 
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="w-full text-center text-4xl font-black tracking-[10px] p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 mb-8"
                                placeholder="000000"
                            />
                            
                            <div className="flex gap-4">
                                <button onClick={() => setShowOTPModal(false)} className="flex-1 h-14 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Yopish</button>
                                <button onClick={handleVerifyCode} className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100">Tasdiqlash</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}