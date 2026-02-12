"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
    Phone, Trash2, Settings2, SmartphoneNfc,
    Globe, LogOut, X, Info, Heart, ShieldAlert, BadgeCheck,
    Loader2, Smartphone, UserCircle2, Calendar, User2,
    ChevronDown, Save, Camera
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import {
    getMySessions,
    getMyContacts,
    terminateSession,
    updateProfile,
    addContactStart,
    uploadAvatar
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

    // Form holati - Sana qismlarga bo'lindi
    const [formData, setFormData] = useState({
        full_name: "",
        bio: "",
        gender: 'male' as 'male' | 'female',
        phone: "",
        day: "",
        month: "",
        year: ""
    })

    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);

    // Yillar, oylar va kunlar ro'yxati
    const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

    const loadData = useCallback(async () => {
        try {
            const [sessRes, contRes] = await Promise.all([getMySessions(), getMyContacts()]);
            setSessions(sessRes.data);
            setContacts(contRes.data);
        } catch (err) { console.error("Yuklashda xatolik:", err) }
    }, []);

    useEffect(() => {
        // MUHIM: Faqat tahrirlash bo'lmayotgan bo'lsa ma'lumotni yuklaymiz
        if (user && !isEditing) {
            let d = "", m = "", y = "";
            if (user.profile?.birth_date) {
                const dateParts = user.profile.birth_date.split('T')[0].split('-');
                y = dateParts[0];
                m = dateParts[1];
                d = dateParts[2];
            }

            setFormData({
                full_name: user.profile?.full_name || "",
                bio: user.profile?.bio || "",
                gender: (user.profile?.gender as any) || "male",
                phone: phoneContact?.value || "",
                day: d,
                month: m,
                year: y
            });
            loadData();
        }
    }, [user, loadData, phoneContact, isEditing]);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            await uploadAvatar(file);
            await refreshUser();
            toast.success("Profil rasmi yangilandi");
        } catch (err) {
            toast.error("Rasmni yuklashda xatolik");
        } finally { setUploading(false); }
    };

    const handleSaveAll = async () => {
        setLoading(true);
        try {
            // Sanani YYYY-MM-DD formatiga yig'amiz
            const birth_date = (formData.year && formData.month && formData.day)
                ? `${formData.year}-${formData.month}-${formData.day}`
                : null;

            await updateProfile({
                full_name: formData.full_name,
                bio: formData.bio,
                birth_date: birth_date,
                gender: formData.gender
            });

            if (formData.phone && formData.phone !== phoneContact?.value) {
                await addContactStart({ type: 'phone', value: formData.phone });
                toast.info("Telefon tasdiqlash kutilmoqda");
            }

            await refreshUser();
            setIsEditing(false);
            toast.success("O'zgarishlar saqlandi");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Saqlashda xatolik");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen dark:bg-[#0a0a0b] py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* CHAP TOMON */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-full h-full rounded-[40px] overflow-hidden bg-slate-100 dark:bg-white/5 border-4 border-blue-500/10 relative transition-transform duration-500 group-hover:scale-105">
                                {user?.profile?.avatar_url ? (
                                    <img src={`${API_URL}${user.profile.avatar_url}`} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={80} /></div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <h1 className="text-2xl font-black dark:text-white mb-1 truncate">{user?.profile?.full_name || "Ism yo'q"}</h1>
                        <p className="text-blue-500 font-bold text-sm mb-6">@{user?.profile?.username}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => isEditing ? handleSaveAll() : setIsEditing(true)}
                                disabled={loading}
                                className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${isEditing ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-slate-50 dark:bg-white/5 dark:text-white border dark:border-white/5 hover:bg-white dark:hover:bg-white/10"}`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? <><Save size={16} /> Saqlash</> : <><Settings2 size={16} /> Tahrirlash</>)}
                            </button>
                            {isEditing && (
                                <button onClick={() => setIsEditing(false)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-50 hover:text-white transition-all"><X size={20} /></button>
                            )}
                            <button onClick={logout} className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-2xl hover:text-red-500 transition-all"><LogOut size={20} /></button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[32px] p-6 border dark:border-white/5">
                        <div className="flex items-center gap-3 text-blue-500 mb-4 opacity-80 border-b dark:border-white/5 pb-3">
                            <ShieldAlert size={18} /><p className="font-black text-[10px] uppercase tracking-widest">Xavfsizlik</p>
                        </div>
                        <SecurityRow label="Telefon tasdiqlangan" active={phoneContact?.is_verified} />
                    </div>
                </div>

                {/* O'NG TOMON */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white flex items-center gap-2 mb-8">
                            <Info size={22} className="text-blue-500" /> Profil Ma'lumotlari
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditWrapper label="To'liq ism" icon={<User2 />} isEditing={isEditing}>
                                <input
                                    className="w-full bg-transparent border-none outline-none font-bold text-sm dark:text-white"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Ismingiz"
                                />
                            </EditWrapper>

                            <EditWrapper
                                label={phoneContact?.is_verified ? "Tasdiqlangan raqam" : "Telefon raqam"}
                                icon={<Phone className={phoneContact?.is_verified ? "text-green-500" : "text-orange-500"} />}
                                isEditing={isEditing && !phoneContact?.is_verified}
                            >
                                <input
                                    className="w-full bg-transparent border-none outline-none font-bold text-sm dark:text-white"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing || phoneContact?.is_verified}
                                    placeholder="+998"
                                />
                            </EditWrapper>

                            <EditWrapper label="Jins" icon={<UserCircle2 className="text-indigo-500" />} isEditing={isEditing}>
                                <select
                                    className="w-full bg-transparent border-none outline-none font-bold text-sm dark:text-white appearance-none cursor-pointer disabled:cursor-default"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                                    disabled={!isEditing}
                                >
                                    <option value="male" className="dark:bg-black">Erkak</option>
                                    <option value="female" className="dark:bg-black">Ayol</option>
                                </select>
                            </EditWrapper>

                            <EditWrapper label="Tug'ilgan sana" icon={<Calendar className="text-purple-500" />} isEditing={isEditing}>
                                {isEditing ? (
                                    <div className="flex gap-1 items-center">
                                        <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="bg-transparent outline-none font-bold text-[13px] dark:text-white w-full cursor-pointer appearance-none">
                                            <option value="">Kun</option>
                                            {days.map(d => <option key={d} value={d} className="dark:bg-black">{d}</option>)}
                                        </select>
                                        <span className="text-slate-400">/</span>
                                        <select value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="bg-transparent outline-none font-bold text-[13px] dark:text-white w-full cursor-pointer appearance-none">
                                            <option value="">Oy</option>
                                            {months.map(m => <option key={m} value={m} className="dark:bg-black">{m}</option>)}
                                        </select>
                                        <span className="text-slate-400">/</span>
                                        <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-transparent outline-none font-bold text-[13px] dark:text-white w-full cursor-pointer appearance-none">
                                            <option value="">Yil</option>
                                            {years.map(y => <option key={y} value={y} className="dark:bg-black">{y}</option>)}
                                        </select>
                                    </div>
                                ) : (
                                    <p className="font-bold text-sm dark:text-white">
                                        {formData.day ? `${formData.day}.${formData.month}.${formData.year}` : "—"}
                                    </p>
                                )}
                            </EditWrapper>

                            <EditWrapper label="Siz haqingizda (BIO)" icon={<Heart className="text-pink-500" />} isEditing={isEditing} isFullWidth>
                                <textarea
                                    className="w-full bg-transparent border-none outline-none font-medium text-sm dark:text-slate-300 resize-none py-1"
                                    rows={isEditing ? 3 : 1}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Bio..."
                                />
                            </EditWrapper>
                        </div>
                    </div>

                    {/* SESSIONS */}
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2">
                            <SmartphoneNfc size={22} className="text-blue-500" /> Faol sessiyalar
                        </h3>
                        <div className="space-y-3">
                            {sessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-5 rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${s.is_current ? 'bg-blue-500 text-white' : 'bg-white dark:bg-white/10 text-slate-400'}`}>
                                            {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold dark:text-white text-[13px]">{s.ip_address}</p>
                                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{s.user_agent.split(')')[0]})</p>
                                        </div>
                                    </div>
                                    {!s.is_current && (
                                        <button onClick={async () => { await terminateSession(s.id); loadData(); }} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all">
                                            <Trash2 size={18} />
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

const SecurityRow = ({ label, active }: { label: string, active?: boolean }) => (
    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight">
        <span className="text-slate-500">{label}</span>
        {active ? <BadgeCheck size={18} className="text-green-500" /> : <X size={18} className="text-slate-300" />}
    </div>
);

const EditWrapper = ({ label, icon, children, isEditing, isFullWidth }: any) => (
    <div className={`p-5 rounded-[30px] border transition-all flex items-center gap-4 ${isEditing ? "bg-blue-500/[0.03] border-blue-500/20 shadow-inner" : "bg-white dark:bg-white/5 border-transparent"} ${isFullWidth ? 'md:col-span-2' : ''}`}>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${isEditing ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            {children}
        </div>
    </div>
);