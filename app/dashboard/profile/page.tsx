"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Camera, Save, X, Edit3, Loader2,
    Phone, ShieldCheck, CheckCircle2, AlertCircle,
    Smartphone, UserCircle2, Info, Send, Mail, Trash2,
    LogOut, ChevronRight, ShieldAlert
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    updateProfileAPI,
    uploadAvatarAPI,
    getMySessionsAPI,
    getMyContactsAPI,
    terminateSessionAPI,
} from "@/lib/api/user"

// Tasdiqlash Modali (Confirm Modal)
const ActionConfirmModal = ({ isOpen, onClose, onConfirm, title, desc, icon: Icon, confirmText, isDanger }: any) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-[380px] rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-8 text-center"
                >
                    <div className={`w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-600'}`}>
                        <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{desc}</p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${isDanger ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-slate-900 text-white shadow-lg shadow-slate-200'}`}
                        >
                            {confirmText || "Tasdiqlash"}
                        </button>
                        <button onClick={onClose} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
                            Bekor qilish
                        </button>
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

    // Modal states
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

    // Tasdiqlash orqali seansni yakunlash
    const promptTerminateSession = (sessionId: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Seansni yakunlash",
            desc: "Ushbu qurilmani tizimdan chiqarib yubormoqchimisiz? Buning natijasida ushbu qurilmada qaytadan kirish talab qilinadi.",
            icon: ShieldAlert,
            confirmText: "Ha, yakunlash",
            isDanger: true,
            action: async () => {
                try {
                    await terminateSessionAPI(sessionId);
                    setSessions(prev => prev.filter(s => s.id !== sessionId));
                } catch (e) { alert("Xatolik!") }
                setConfirmConfig({ isOpen: false });
            }
        });
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const uploadFormData = new FormData(); uploadFormData.append('file', file);
        setUploading(true);
        try { await uploadAvatarAPI(uploadFormData); await refreshUser(); }
        catch (error: any) { alert("Xatolik yuz berdi") }
        finally { setUploading(false) }
    }

    return (
        <div className="max-w-[1000px] mx-auto pb-24 px-4 pt-4 lg:pt-10">
            {/* BACKGROUND DECOR */}
            <div className="fixed inset-0 -z-10 bg-[#F4F7F9]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: MAIN PROFILE CARD */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
                        {/* COVER & AVATAR */}
                        <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-600 relative" />
                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 mb-6 flex justify-between items-end">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full ring-8 ring-white overflow-hidden bg-slate-100 border border-slate-100 shadow-xl">
                                        {uploading ? (
                                            <div className="w-full h-full flex items-center justify-center bg-white/80 backdrop-blur-sm">
                                                <Loader2 className="animate-spin text-teal-500" />
                                            </div>
                                        ) : user?.profile?.avatar_url ? (
                                            <img src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={64} /></div>
                                        )}
                                    </div>
                                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border border-slate-100 text-teal-600 hover:scale-110 transition-transform active:scale-95">
                                        <Camera size={18} />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                                </div>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="mb-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm transition-all active:scale-95">
                                        Tahrirlash
                                    </button>
                                ) : (
                                    <div className="mb-2 flex gap-2">
                                        <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-500 font-bold text-sm">Bekor qilish</button>
                                        <button onClick={async () => { await updateProfileAPI(formData); await refreshUser(); setIsEditing(false); }} className="px-6 py-2.5 bg-teal-600 text-white rounded-full font-bold text-sm shadow-lg shadow-teal-100 transition-all active:scale-95">Saqlash</button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-2xl font-black text-slate-900">{user?.profile?.full_name || "Foydalanuvchi"}</h1>
                                <p className="text-teal-600 font-bold text-sm">@{user?.profile?.username || 'username'}</p>
                            </div>

                            <div className="mt-8 grid gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-telegram-blue">Bio</label>
                                    {isEditing ? (
                                        <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none transition-all font-medium text-slate-700" rows={2} />
                                    ) : (
                                        <p className="px-1 text-slate-600 font-medium leading-relaxed">{formData.bio || "Bio kiritilmagan..."}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SESSIONS SECTION */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                <ShieldCheck className="text-blue-500" /> Qurilmalar
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {sessions.map((s) => (
                                <div key={s.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{s.user_agent.split(' ')[0]} {s.is_current && <span className="ml-2 text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Siz</span>}</p>
                                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tight">{s.ip_address} • {new Date(s.last_active).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {!s.is_current && (
                                        <button onClick={() => promptTerminateSession(s.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: CONTACTS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#1c2b3e] text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 blur-[80px] -mr-16 -mt-16" />
                        <h3 className="text-sm font-black text-teal-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Mail size={16} /> Aloqa
                        </h3>
                        <div className="space-y-4">
                            {contacts.map(c => (
                                <div key={c.id} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">
                                        {c.contact_type === 'email' ? 'Email' : 'Telefon'}
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-bold truncate">{c.value}</p>
                                        {c.is_verified || c.contact_type === 'google' ? (
                                            <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                                        ) : (
                                            <AlertCircle size={14} className="text-amber-400 shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowPhoneModal(true)} className="w-full mt-6 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-[20px] font-black text-xs transition-all active:scale-95 shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2">
                            <Phone size={14} /> Raqamni yangilash
                        </button>
                    </div>

                    <div className="p-6 bg-white rounded-[32px] border border-slate-200/60 shadow-sm">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                                <Info size={20} />
                            </div>
                            <p className="text-[12px] text-slate-500 font-semibold leading-relaxed">
                                Xavfsizlik uchun faol seanslaringizni vaqti-vaqti bilan tekshirib turing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
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

            {/* PHONE UPDATE MODAL (Mavjud dizayndagi) */}
            <AnimatePresence>
                {showPhoneModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPhoneModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900">Raqam qo'shish</h3>
                                <button onClick={() => setShowPhoneModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24} className="text-slate-400" /></button>
                            </div>
                            <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-black text-xl mb-6 transition-all" />
                            <button onClick={() => window.open(`https://t.me/EnwisAuthBot?start=${newPhone.replace(/[^\d+]/g, '')}`, "_blank")} className="w-full py-5 bg-[#229ED9] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30">
                                <Send size={20} /> Telegram botni ochish
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}