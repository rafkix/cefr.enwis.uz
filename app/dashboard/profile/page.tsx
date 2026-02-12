"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
    Phone, Trash2, Settings2, SmartphoneNfc,
    Globe, LogOut, X, Info, Heart, ShieldAlert, BadgeCheck,
    Loader2, Smartphone, UserCircle2, Calendar, User2,
    ChevronDown, Save, Camera, ChevronUp
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
import { UserSession, UserContact } from "@/lib/types/user"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

interface FormData {
    full_name: string;
    bio: string;
    gender: 'male' | 'female';
    phone: string;
    day: string;
    month: string;
    year: string;
}

export default function ProfilePage() {
    const { user, refreshUser, logout } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [sessions, setSessions] = useState<UserSession[]>([])
    const [contacts, setContacts] = useState<UserContact[]>([])

    const [formData, setFormData] = useState<FormData>({
        full_name: "", bio: "", gender: 'male', phone: "",
        day: "", month: "", year: ""
    })

    const phoneContact = useMemo(() => contacts.find(c => c.contact_type === 'phone'), [contacts]);

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
        if (user && !isEditing) {
            let d = "", m = "", y = "";
            if (user.profile?.birth_date) {
                const parts = user.profile.birth_date.split('T')[0].split('-');
                y = parts[0]; m = parts[1]; d = parts[2];
            }

            setFormData({
                full_name: user.profile?.full_name || "",
                bio: user.profile?.bio || "",
                gender: (user.profile?.gender as 'male' | 'female') || "male",
                phone: phoneContact?.value || "",
                day: d, month: m, year: y
            });
            loadData();
        }
    }, [user, loadData, phoneContact, isEditing]);

    // --- AVATAR YUKLASH FUNKSIYASI (TUZATILGAN) ---
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Hajmni tekshirish (Masalan max: 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Rasm hajmi juda katta (max 5MB)");
            return;
        }

        setUploading(true);
        try {
            await uploadAvatar(file);
            await refreshUser(); // AuthContext-ni yangilash
            toast.success("Profil rasmi yangilandi");
        } catch (err: any) {
            console.error("Avatar error:", err.response?.data);
            // Serverdan kelgan aniq xatoni ko'rsatish
            const errorMsg = err.response?.data?.detail || "Rasmni yuklashda serverda xatolik (500)";
            toast.error(errorMsg);
        } finally { 
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; // Inputni tozalash
        }
    };

    const handleSaveAll = async () => {
        setLoading(true);
        try {
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
        <div className="min-h-screen dark:bg-[#0a0a0b] py-12 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* --- CHAP PANEL --- */}
                <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-xl border dark:border-white/5 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer" 
                             onClick={() => !uploading && fileInputRef.current?.click()}>
                            <div className="w-full h-full rounded-[40px] overflow-hidden bg-slate-100 dark:bg-white/5 border-4 border-blue-500/10 relative transition-all duration-500 group-hover:border-blue-500/30">
                                {user?.profile?.avatar_url ? (
                                    <img 
                                        src={user.profile.avatar_url.startsWith('http') ? user.profile.avatar_url : `${API_URL}${user.profile.avatar_url}`} 
                                        className="w-full h-full object-cover" 
                                        alt="Avatar" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle2 size={80} /></div>
                                )}
                                
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                                
                                {!uploading && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                        </div>

                        <h1 className="text-2xl font-black dark:text-white mb-1 truncate">{user?.profile?.full_name || "Ism kiritilmagan"}</h1>
                        <p className="text-blue-500 font-bold text-sm mb-6">@{user?.profile?.username}</p>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => isEditing ? handleSaveAll() : setIsEditing(true)}
                                    disabled={loading}
                                    className={`flex-1 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${isEditing ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-slate-50 dark:bg-white/5 dark:text-white border dark:border-white/5 hover:bg-white dark:hover:bg-white/10"}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? <><Save size={16} /> Saqlash</> : <><Settings2 size={16} /> Tahrirlash</>)}
                                </button>
                                {isEditing && (
                                    <button onClick={() => setIsEditing(false)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                            <button onClick={logout} className="w-full p-4 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-2xl hover:text-red-500 transition-all flex items-center justify-center gap-2 font-bold text-[11px] uppercase tracking-widest">
                                <LogOut size={18} /> Chiqish
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[32px] p-6 border dark:border-white/5">
                        <div className="flex items-center gap-3 text-blue-500 mb-4 opacity-80 border-b dark:border-white/5 pb-3">
                            <ShieldAlert size={18} /><p className="font-black text-[10px] uppercase tracking-widest">Xavfsizlik Holati</p>
                        </div>
                        <SecurityRow label="Telefon tasdiqlangan" active={phoneContact?.is_verified} />
                    </div>
                </aside>

                {/* --- O'NG PANEL --- */}
                <main className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white flex items-center gap-2 mb-8 uppercase tracking-tighter">
                            <Info size={22} className="text-blue-500" /> Shaxsiy Ma'lumotlar
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditWrapper label="To'liq ism" icon={<User2 />} isEditing={isEditing}>
                                <input
                                    className="w-full bg-transparent border-none outline-none font-bold text-sm dark:text-white placeholder:text-slate-300"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Ismingizni kiriting"
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
                                    placeholder="+998 00 000 00 00"
                                />
                            </EditWrapper>

                            <EditWrapper label="Jins" icon={<UserCircle2 className="text-indigo-500" />} isEditing={isEditing}>
                                <select
                                    className="w-full bg-transparent border-none outline-none font-bold text-sm dark:text-white appearance-none cursor-pointer disabled:cursor-default"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                                    disabled={!isEditing}
                                >
                                    <option value="male" className="dark:bg-[#151516]">Erkak</option>
                                    <option value="female" className="dark:bg-[#151516]">Ayol</option>
                                </select>
                            </EditWrapper>

                            <EditWrapper label="Tug'ilgan sana" icon={<Calendar className="text-purple-500" />} isEditing={isEditing}>
                                {isEditing ? (
                                    <div className="flex gap-2 items-center justify-between w-full max-w-[240px]">
                                        <WheelInput label="Kun" value={formData.day} max={31} onChange={(val: string) => setFormData({ ...formData, day: val })} />
                                        <div className="text-slate-300">/</div>
                                        <WheelInput label="Oy" value={formData.month} max={12} onChange={(val: string) => setFormData({ ...formData, month: val })} />
                                        <div className="text-slate-300">/</div>
                                        <WheelInput label="Yil" value={formData.year} max={new Date().getFullYear()} min={1950} onChange={(val: string) => setFormData({ ...formData, year: val })} isYear />
                                    </div>
                                ) : (
                                    <p className="font-bold text-sm dark:text-white">
                                        {formData.day ? `${formData.day}.${formData.month}.${formData.year}` : "—"}
                                    </p>
                                )}
                            </EditWrapper>

                            <EditWrapper label="Bio" icon={<Heart className="text-pink-500" />} isEditing={isEditing} isFullWidth>
                                <textarea
                                    className="w-full bg-transparent border-none outline-none font-medium text-sm dark:text-slate-300 resize-none py-1"
                                    rows={isEditing ? 3 : 1}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Qisqacha ma'lumot..."
                                />
                            </EditWrapper>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
                        <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
                            <SmartphoneNfc size={22} className="text-blue-500" /> Faol qurilmalar
                        </h3>
                        <div className="grid gap-3">
                            {sessions.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-5 rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 hover:border-blue-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${s.is_current ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/10 text-slate-400'}`}>
                                            {s.user_agent.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold dark:text-white text-[13px]">{s.ip_address}</p>
                                                {s.is_current && <span className="text-[9px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-black uppercase">Joriy</span>}
                                            </div>
                                            <p className="text-[11px] text-slate-400 truncate max-w-[200px] md:max-w-[400px]">{s.user_agent}</p>
                                        </div>
                                    </div>
                                    {!s.is_current && (
                                        <button onClick={async () => { await terminateSession(s.id); loadData(); }} className="p-3 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

// --- YORDAMCHI KOMPONENTLAR ---

const WheelInput = ({ value, onChange, label, max, min = 1, isYear = false }: any) => {
    const update = (inc: boolean) => {
        const current = parseInt(value) || (inc ? min - 1 : max + 1);
        let next = inc ? current + 1 : current - 1;
        if (next > max) next = min;
        if (next < min) next = max;
        onChange(next.toString().padStart(isYear ? 4 : 2, '0'));
    };

    return (
        <div className="flex flex-col items-center bg-slate-100 dark:bg-white/10 rounded-2xl p-1 w-16">
            <button type="button" onClick={() => update(true)} className="p-1 hover:text-blue-500 text-slate-400 transition-colors"><ChevronUp size={14} /></button>
            <input
                type="text" value={value}
                onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v === "" || parseInt(v) <= max) onChange(v);
                }}
                className="w-full bg-transparent text-center font-black text-[14px] dark:text-white outline-none"
                placeholder={isYear ? "0000" : "00"}
                maxLength={isYear ? 4 : 2}
            />
            <span className="text-[7px] text-slate-400 uppercase font-black">{label}</span>
            <button type="button" onClick={() => update(false)} className="p-1 hover:text-blue-500 text-slate-400 transition-colors"><ChevronDown size={14} /></button>
        </div>
    );
};

const SecurityRow = ({ label, active }: { label: string, active?: boolean }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
        {active ? <BadgeCheck size={20} className="text-green-500" /> : <X size={20} className="text-slate-300" />}
    </div>
);

const EditWrapper = ({ label, icon, children, isEditing, isFullWidth }: any) => (
    <div className={`p-5 rounded-[30px] border transition-all flex items-center gap-4 ${isEditing ? "bg-blue-500/[0.03] border-blue-500/20 shadow-inner" : "bg-white dark:bg-white/5 border-transparent"} ${isFullWidth ? 'md:col-span-2' : ''}`}>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isEditing ? 'bg-blue-500 text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            {children}
        </div>
    </div>
);