"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
    Phone, Mail, Trash2, Settings2, SmartphoneNfc,
    Globe, LogOut, X, Info, Heart, ShieldAlert, BadgeCheck,
    Loader2, SendHorizontal, Smartphone, UserCircle2, Calendar, User2, Check, Camera
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { getMySessions, getMyContacts, terminateSession, updateProfile, uploadAvatar, addContactStart } from "@/lib/api/user" // addContact qo'shildi
import { UserSession, UserContact, UpdateProfilePayload } from "@/lib/types/user"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function ProfilePage() {
    const { user, refreshUser, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])
    const [checking, setChecking] = useState(false)

    // Yangi raqam uchun state
    const [newPhone, setNewPhone] = useState("")

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState<UpdateProfilePayload>({
        full_name: "", bio: "", birth_date: "", gender: 'male'
    })

    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);
    const emailContact = useMemo(() => contacts.find(c => c.contact_type === "email"), [contacts]);

    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { console.error("Data error:", err) }
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

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Faqat rasm yuklash mumkin");
        if (file.size > 10 * 1024 * 1024) return toast.error("Rasm hajmi 10MB dan oshmasligi kerak");

        setAvatarLoading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Xatolik yuz berdi");
        } finally { setAvatarLoading(false); }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            await refreshUser();
            setIsEditing(false);
            toast.success("Ma'lumotlar saqlandi");
        } catch (error) { toast.error("Xatolik yuz berdi"); }
        finally { setLoading(false); }
    };

    // --- TELEFON RAQAM QO'SHISH ---
    const handleAddPhone = async () => {
        if (!newPhone.startsWith('+') || newPhone.length < 9) {
            return toast.error("Raqamni +998... formatida kiriting");
        }
        setLoading(true);
        try {
            // API orqali kontakt qo'shish
            await addContactStart({ type: 'phone', value: newPhone });
            await loadData();
            setNewPhone("");
            toast.success("Raqam qo'shildi, endi uni tasdiqlang");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Raqamni saqlashda xatolik");
        } finally { setLoading(false); }
    };

    const handleCheckStatus = async () => {
        setChecking(true);
        try {
            await refreshUser();
            await loadData();
            toast.success("Holat yangilandi");
        } catch { toast.error("Yangilashda xatolik") }
        finally { setChecking(false) }
    };

    return (
        <div className="min-h-screen dark:bg-[#0a0a0b] py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT: Profile Card */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5 text-center">

                        <div className="relative w-32 h-32 mx-auto mb-6 group">
                            <div className="w-full h-full rounded-[40px] overflow-hidden bg-slate-100 dark:bg-white/5 border-4 border-blue-500/5 relative">
                                {user?.profile?.avatar_url ? (
                                    <img src={`${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={80} /></div>
                                )}
                                {avatarLoading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} disabled={avatarLoading} className="absolute -bottom-2 -right-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl transition-all z-10">
                                <Camera size={18} />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>

                        <h1 className="text-2xl font-black dark:text-white mb-1 truncate">
                            {user?.profile?.full_name || "Ism yo'q"}
                        </h1>
                        <p className="text-blue-500 font-bold text-sm mb-6">@{user?.profile?.username || "user"}</p>

                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSaveProfile} disabled={loading} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all">
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Saqlash</>}
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="p-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl"><X size={20} /></button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="flex-1 bg-slate-50 dark:bg-white/5 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 border dark:border-white/5 dark:text-white">
                                    <Settings2 size={16} /> Tahrirlash
                                </button>
                            )}
                            <button onClick={logout} className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl border border-red-100 dark:border-red-500/20"><LogOut size={20} /></button>
                        </div>
                    </div>

                    {/* TELEFON RAQAM QISMI */}
                    <div className="space-y-4">
                        {!phoneContact ? (
                            <div className="p-5 rounded-[30px] bg-blue-500/5 border border-blue-500/20">
                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3">Raqam biriktirish</p>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        placeholder="+998901234567"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-white dark:bg-[#1a1a1b] rounded-2xl border dark:border-white/5 font-bold text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all"
                                    />
                                    <button
                                        onClick={handleAddPhone}
                                        disabled={loading || !newPhone}
                                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-5 rounded-[30px] bg-slate-50/50 dark:bg-white/5 border dark:border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Phone className="text-green-500" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telefon raqam</p>
                                            {phoneContact?.is_verified && <BadgeCheck size={14} className="text-green-500" />}
                                        </div>
                                        <p className="font-bold text-[14px] dark:text-white truncate">{phoneContact.value}</p>
                                    </div>
                                </div>

                                {!phoneContact.is_verified && (
                                    <div className="p-5 bg-blue-500/5 rounded-[30px] border border-blue-500/10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                            <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400">Tasdiqlash kutilmoqda</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href="https://t.me/EnwisAuthBot?start=verify_phone" target="_blank" rel="noreferrer" className="flex-1 bg-[#0088cc] text-white py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                                <SendHorizontal size={14} /> Botga o'tish
                                            </a>
                                            <button onClick={handleCheckStatus} disabled={checking} className="px-4 bg-white dark:bg-white/10 rounded-xl text-[10px] font-black text-blue-500 uppercase border border-blue-200 dark:border-blue-500/20">
                                                {checking ? <Loader2 className="animate-spin" size={14} /> : "YANGILASH"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-5 rounded-[30px] bg-slate-50/50 dark:bg-white/5 border dark:border-white/5 flex items-center gap-4 opacity-70">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0"><Mail className="text-orange-500" size={20} /></div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Email (O'zgarmas)</p>
                            <p className="font-bold text-[14px] dark:text-white truncate">{emailContact?.value || "—"}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[32px] p-6 border dark:border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-blue-500 border-b dark:border-white/5 pb-3">
                            <ShieldAlert size={20} /><p className="font-black text-xs uppercase tracking-widest">Xavfsizlik</p>
                        </div>
                        <StatusRow label="Profil tasdiqlangan" icon={phoneContact?.is_verified ? <BadgeCheck className="text-green-500" size={18} /> : <X className="text-slate-300" size={18} />} />
                        <StatusRow label="Ikki bosqichli himoya" icon={<div className={`w-3 h-3 rounded-full ${phoneContact?.is_verified ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-slate-300"}`} />} />
                    </div>
                </div>

                {/* RIGHT: Main Info */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                                <Info size={22} className="text-blue-500" /> Shaxsiy ma'lumotlar
                            </h3>
                            {isEditing && <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase animate-pulse">Tahrirlash</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <EditableCard icon={<User2 className="text-blue-500" />} label="To'liq ism" isEditing={isEditing}>
                                <input
                                    className="w-full bg-transparent border-none outline-none font-bold text-[14px] dark:text-white"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Ism..."
                                />
                            </EditableCard>

                            <EditableCard icon={<UserCircle2 className="text-indigo-500" />} label="Jins" isEditing={isEditing}>
                                {isEditing ? (
                                    <select className="w-full bg-transparent border-none outline-none font-bold text-[14px] dark:text-white" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })}>
                                        <option value="male">Erkak</option>
                                        <option value="female">Ayol</option>
                                    </select>
                                ) : (
                                    <p className="font-bold text-[14px] dark:text-white">{formData.gender === 'male' ? 'Erkak' : 'Ayol'}</p>
                                )}
                            </EditableCard>

                            <EditableCard icon={<Calendar className="text-purple-500" />} label="Tug'ilgan sana" isEditing={isEditing}>
                                <input
                                    type={isEditing ? "date" : "text"}
                                    className="w-full bg-transparent border-none outline-none font-bold text-[14px] dark:text-white"
                                    value={isEditing ? formData.birth_date : (formData.birth_date ? new Date(formData.birth_date).toLocaleDateString('uz-UZ') : "—")}
                                    onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </EditableCard>

                            {/* Ro'yxatdan o'tgan sana */}
                            <div className="p-5 rounded-[30px] bg-slate-50/50 dark:bg-white/5 border dark:border-white/5 flex items-center gap-4 opacity-70">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Calendar className="text-blue-500" size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ro'yxatdan o'tilgan sana</p>
                                    <p className="font-bold text-[14px] dark:text-white truncate">
                                        {(() => {
                                            const dateRaw = user?.created_at || user?.profile?.created_at;
                                            if (!dateRaw) return "—";

                                            const d = new Date(dateRaw);
                                            if (isNaN(d.getTime())) return "Noma'lum sana";

                                            // Oylarni o'zbekcha nomlash
                                            const months = [
                                                "yanvar", "fevral", "mart", "aprel", "may", "iyun",
                                                "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"
                                            ];

                                            const day = d.getDate();
                                            const month = months[d.getMonth()];
                                            const year = d.getFullYear();

                                            return `${day}-${month}, ${year}-yil`;
                                        })()}
                                    </p>
                                </div>
                            </div>

                            <EditableCard icon={<Heart className="text-pink-500" />} label="BIO" isEditing={isEditing} isFullWidth>
                                <textarea
                                    className="w-full bg-transparent border-none outline-none font-medium text-[14px] dark:text-white resize-none"
                                    rows={isEditing ? 3 : 1}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="BIO..."
                                />
                            </EditableCard>
                        </div>
                    </div>

                    {/* SESSIONS */}
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2">
                            <SmartphoneNfc size={22} className="text-blue-500" /> Sessiyalar
                        </h3>
                        <div className="space-y-3">
                            {sessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 gap-3">
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                        {/* Icon qismi - mobil uchun biroz kichraytirildi */}
                                        <div className={`p-3 sm:p-4 rounded-2xl shrink-0 ${s.is_current ? 'bg-blue-500 text-white' : 'bg-white dark:bg-white/10 text-slate-400'}`}>
                                            {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={18} className="sm:w-[20px]" /> : <Globe size={18} className="sm:w-[20px]" />}
                                        </div>

                                        {/* Ma'lumotlar qismi */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="font-bold text-[13px] sm:text-[14px] dark:text-white truncate">
                                                    {s.ip_address}
                                                </p>
                                                {s.is_current && (
                                                    <span className="text-[7px] sm:text-[8px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded-md uppercase font-black shrink-0">
                                                        Hozir
                                                    </span>
                                                )}
                                            </div>
                                            {/* User Agent - Mobil qurilmada faqat asosiy qismini qoldiramiz */}
                                            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate opacity-70">
                                                {s.user_agent.split(')')[0]})
                                            </p>
                                        </div>
                                    </div>

                                    {/* O'chirish tugmasi */}
                                    {!s.is_current && (
                                        <button
                                            onClick={async () => { await terminateSession(s.id); loadData(); }}
                                            className="p-2.5 sm:p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl sm:rounded-2xl transition-all shrink-0 active:scale-90"
                                        >
                                            <Trash2 size={16} className="sm:w-[18px]" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatusRow = ({ label, icon }: any) => (
    <div className="flex items-center justify-between text-[13px] font-bold dark:text-slate-300">
        <span className="opacity-60">{label}</span>
        {icon}
    </div>
);

const EditableCard = ({ icon, label, children, isEditing, isFullWidth }: any) => (
    <div className={`p-5 rounded-[30px] border transition-all flex items-center gap-4 ${isEditing
        ? "bg-blue-500/5 border-blue-500/30 ring-2 ring-blue-500/10"
        : "bg-white dark:bg-white/5 border-transparent"
        } ${isFullWidth ? 'md:col-span-2' : ''}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isEditing ? 'bg-blue-500/10' : 'bg-slate-50 dark:bg-white/10'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            {children}
        </div>
    </div>
);