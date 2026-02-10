"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Camera, Save, X, Edit3, Loader2,
    Phone, ShieldCheck, CheckCircle2, AlertCircle,
    Smartphone, UserCircle2, Info, Send, Mail, Trash2,
    ShieldAlert, Calendar, VenusMars, User2
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI,
    uploadAvatarAPI,
    getMySessionsAPI,
    getMyContactsAPI,
    terminateSessionAPI,
} from "@/lib/api/user"

// Tasdiqlash Modali
const ActionConfirmModal = ({ isOpen, onClose, onConfirm, title, desc, icon: Icon, confirmText, isDanger }: any) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-[380px] rounded-[40px] shadow-2xl relative z-10 p-8 text-center">
                    <div className={`w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-600'}`}>
                        <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{desc}</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={onConfirm} className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${isDanger ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-slate-900 text-white shadow-lg shadow-slate-200'}`}>
                            {confirmText || "Tasdiqlash"}
                        </button>
                        <button onClick={onClose} className="w-full py-4 text-slate-400 font-bold text-sm">Bekor qilish</button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
)

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
    const [confirmConfig, setConfirmConfig] = useState<any>({ isOpen: false });
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const [newPhone, setNewPhone] = useState("+998")

    const [formData, setFormData] = useState({
        full_name: "", bio: "", birth_date: "", gender: "",
    })

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    const loadInitialData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessionsAPI(), getMyContactsAPI()])
            setSessions(sessRes.data?.sessions || sessRes.data || [])
            setContacts(contRes.data?.contacts || contRes.data || [])
        } catch (err) { console.error(err) }
    }, [])

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.profile?.full_name || "",
                bio: user.profile?.bio || "",
                birth_date: user.profile?.birth_date ? user.profile.birth_date.split('T')[0] : "",
                gender: user.profile?.gender || "",
            })
            loadInitialData()
        }
    }, [user, loadInitialData])

    // Profilni saqlashdan oldin tasdiqlash
    const promptSaveProfile = () => {
        setConfirmConfig({
            isOpen: true,
            title: "O'zgarishlarni saqlash",
            desc: "Kiritilgan yangi ma'lumotlar profilingizda yangilanadi. Davom etasizmi?",
            icon: Save,
            confirmText: "Ha, saqlash",
            isDanger: false,
            action: async () => {
                setLoading(true);
                try {
                    await updateProfileAPI(formData);
                    await refreshUser();
                    setIsEditing(false);
                } catch (e) { alert("Xatolik!"); }
                finally { setLoading(false); setConfirmConfig({ isOpen: false }); }
            }
        });
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const uploadFormData = new FormData(); uploadFormData.append('file', file);
        setUploading(true);
        try { await uploadAvatarAPI(uploadFormData); await refreshUser(); }
        catch (e) { alert("Rasm yuklashda xatolik"); }
        finally { setUploading(false) }
    }

    return (
        <div className="max-w-[1000px] mx-auto pb-24 px-4 pt-10">
            <div className="fixed inset-0 -z-10 bg-[#F0F2F5]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ASOSIY QISIM */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[35px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 mb-6 flex justify-between items-end">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full ring-8 ring-white overflow-hidden bg-slate-100 shadow-xl">
                                        {uploading ? <div className="w-full h-full flex items-center justify-center bg-white/80"><Loader2 className="animate-spin text-blue-500" /></div> :
                                            user?.profile?.avatar_url ? <img src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" alt="" /> :
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={64} /></div>}
                                    </div>
                                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border text-blue-600 hover:scale-110 transition-transform"><Camera size={18} /></button>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                                </div>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="mb-2 px-8 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2">
                                        <Edit3 size={16} /> Tahrirlash
                                    </button>
                                ) : (
                                    <div className="mb-2 flex gap-2">
                                        <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-400 font-bold">Bekor qilish</button>
                                        <button onClick={promptSaveProfile} disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50">
                                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Saqlash"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-8">
                                {/* Ism va Username */}
                                <div>
                                    {isEditing ? (
                                        <input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="text-2xl font-black text-slate-900 w-full bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 ring-blue-500/20" placeholder="To'liq ismingiz" />
                                    ) : (
                                        <h1 className="text-3xl font-black text-slate-900 px-1">{user?.profile?.full_name || "Ism kiritilmagan"}</h1>
                                    )}
                                    <p className="text-blue-600 font-bold text-sm px-1 mt-1">@{user?.profile?.username}</p>
                                </div>

                                {/* Batafsil Ma'lumotlar */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-1 group">
                                        <div className="flex items-center gap-2 text-slate-400 mb-2 px-1">
                                            <Calendar size={14} className="group-hover:text-blue-500 transition-colors" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Tug'ilgan sana</span>
                                        </div>
                                        {isEditing ? (
                                            <input type="date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-slate-700 outline-none border-2 border-transparent focus:border-blue-500 transition-all" />
                                        ) : (
                                            <p className="text-slate-700 font-bold p-1">{formData.birth_date || "Kiritilmagan"}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1 group">
                                        <div className="flex items-center gap-2 text-slate-400 mb-2 px-1">
                                            <VenusMars size={14} className="group-hover:text-blue-500 transition-colors" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Jinsi</span>
                                        </div>
                                        {isEditing ? (
                                            <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-slate-700 outline-none border-2 border-transparent focus:border-blue-500 transition-all appearance-none">
                                                <option value="">Tanlanmagan</option>
                                                <option value="male">Erkak</option>
                                                <option value="female">Ayol</option>
                                            </select>
                                        ) : (
                                            <p className="text-slate-700 font-bold p-1 capitalize">{formData.gender === 'male' ? 'Erkak' : formData.gender === 'female' ? 'Ayol' : 'Kiritilmagan'}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2 space-y-1 group">
                                        <div className="flex items-center gap-2 text-slate-400 mb-2 px-1">
                                            <Info size={14} className="group-hover:text-blue-500 transition-colors" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Bio (Ma'lumot)</span>
                                        </div>
                                        {isEditing ? (
                                            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-slate-700 outline-none border-2 border-transparent focus:border-blue-500 transition-all min-h-[100px]" placeholder="O'zingiz haqingizda..." />
                                        ) : (
                                            <p className="text-slate-600 font-medium p-1 leading-relaxed">{formData.bio || "Bio kiritilmagan..."}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEANSLAR */}
                    <div className="bg-white rounded-[35px] p-8 shadow-sm border border-slate-200">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-blue-500" /> Faol seanslar
                        </h3>
                        <div className="space-y-2">
                            {sessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors"><Smartphone size={20} /></div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{s.user_agent.split(' ')[0]} {s.is_current && <span className="ml-2 text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full uppercase">Siz</span>}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{s.ip_address} • {new Date(s.last_active).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {!s.is_current && (
                                        <button onClick={() => setConfirmConfig({ isOpen: true, title: "Seansni o'chirish", desc: "Ushbu qurilmani tizimdan chiqarib yubormoqchimisiz?", icon: Trash2, isDanger: true, confirmText: "O'chirish", action: async () => { await terminateSessionAPI(s.id); setSessions(p => p.filter(x => x.id !== s.id)); setConfirmConfig({ isOpen: false }); } })} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#1c2b3e] text-white rounded-[35px] p-8 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><Mail size={16} /> Aloqa Ma'lumotlari</h3>
                        <div className="space-y-6">
                            {contacts.map(c => (
                                <div key={c.id} className="relative z-10">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{c.contact_type === 'email' ? 'Elektron pochta' : 'Telefon raqam'}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold truncate">{c.value}</p>
                                        {c.is_verified || c.contact_type === 'google' ? <CheckCircle2 size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-amber-400" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowPhoneModal(true)} className="w-full mt-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg shadow-blue-900/40">Yangi raqam ulash</button>
                    </div>

                    <div className="bg-white rounded-[35px] p-6 border border-slate-200 border-dashed">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0"><Info size={20} /></div>
                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Profil ma'lumotlarini to'ldirish sizga xizmatlardan to'liq foydalanish imkonini beradi.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALLAR */}
            <ActionConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ isOpen: false })}
                onConfirm={confirmConfig.action}
                title={confirmConfig.title}
                desc={confirmConfig.desc}
                icon={confirmConfig.icon}
                confirmText={confirmConfig.confirmText}
                isDanger={confirmConfig.isDanger}
            />

            <AnimatePresence>
                {showPhoneModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPhoneModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-slate-900">Raqam qo'shish</h3>
                                <button onClick={() => setShowPhoneModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24} className="text-slate-400" /></button>
                            </div>
                            <div className="space-y-6 relative z-10">
                                <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-black text-xl transition-all" />
                                <div className="p-4 bg-blue-50 rounded-2xl text-[12px] text-blue-600 font-bold">Tasdiqlash uchun Telegram botda "Kontaktni ulash" tugmasini bosishingiz kerak bo'ladi.</div>
                                <button onClick={() => window.open(`https://t.me/EnwisAuthBot?start=${newPhone.replace(/[^\d+]/g, '')}`, "_blank")} className="w-full py-5 bg-[#229ED9] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 active:scale-95 transition-all">
                                    <Send size={20} /> Telegram botga o'tish
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}