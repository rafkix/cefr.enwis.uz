"use client"

import { useEffect, useState, useRef } from "react"
import { 
    Hash, 
    Phone, 
    User as UserIcon, 
    Mail, 
    Camera, 
    Edit2, 
    Save, 
    X,
    LogOut,
    Shield
} from "lucide-react"
import { toast } from "sonner" // Xabarlar uchun (ixtiyoriy)
import { useRouter } from "next/navigation"

// API funksiyalarini import qilamiz
import { getMyProfileAPI, updateProfileAPI, uploadAvatarAPI } from "@/lib/api/user"

// User interfeysi (Sizdagi types/user.ts ga moslab)
interface UserData {
    id: string
    full_name: string
    username: string
    phone: string
    email?: string
    telegram_id?: string
    role: string
    level: string
    avatar?: string
}

export default function ProfilePage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [user, setUser] = useState<UserData | null>(null)
    
    // Tahrirlash formasi uchun state
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: ""
    })

    // 1. Profilni yuklash (Mount bo'lganda)
    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const { data } = await getMyProfileAPI()
            setUser(data as any) // Type ni to'g'rilash uchun
            
            // Formani boshlang'ich qiymat bilan to'ldirish
            setFormData({
                full_name: data.full_name,
                username: data.username,
                email: data.email || ""
            })
        } catch (error) {
            console.error("Profilni yuklashda xatolik:", error)
            toast.error("Ma'lumotlarni yuklab bo'lmadi")
        } finally {
            setLoading(false)
        }
    }

    // 2. Profil rasmini yuklash
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const loadingToast = toast.loading("Rasm yuklanmoqda...")
            await uploadAvatarAPI(file)
            
            // Profilni qayta yuklaymiz (yangi rasmni ko'rish uchun)
            await fetchProfile()
            
            toast.dismiss(loadingToast)
            toast.success("Profil rasmi yangilandi!")
        } catch (error) {
            toast.error("Rasmni yuklab bo'lmadi")
        }
    }

    // 3. Ma'lumotlarni saqlash (Update)
    const handleSaveProfile = async () => {
        try {
            // Update API chaqiramiz
            await updateProfileAPI(formData)
            
            toast.success("Profil muvaffaqiyatli saqlandi")
            setIsEditing(false)
            fetchProfile() // Yangilangan ma'lumotlarni olish
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Saqlashda xatolik")
        }
    }

    // 4. Tizimdan chiqish
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user_data")
        router.push("/auth/login")
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px]">Yuklanmoqda...</div>
    }

    if (!user) return <div>Foydalanuvchi topilmadi</div>

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black text-slate-800">Mening Profilim</h1>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-bold text-sm"
                >
                    <LogOut size={18} /> Chiqish
                </button>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                {/* Orqa fon dekoratsiyasi */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-purple-50 rounded-bl-[100%] -mr-16 -mt-16 opacity-70"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                    
                    {/* --- AVATAR QISMI --- */}
                    <div className="relative group">
                        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-5xl border-[6px] border-white shadow-lg overflow-hidden object-cover">
                            {user.avatar ? (
                                // Agar backend rasm URL bersa (BaseURL ni qo'shish kerak bo'lishi mumkin)
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>😎</span>
                            )}
                        </div>
                        
                        {/* Rasm yuklash tugmasi */}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            <Camera size={18} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>
                    
                    {/* --- MA'LUMOTLAR QISMI --- */}
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                {isEditing ? (
                                    <input 
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                        className="text-3xl font-black text-slate-800 bg-slate-50 border-b-2 border-blue-500 outline-none w-full"
                                        placeholder="To'liq ism"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-black text-slate-800">{user.full_name}</h2>
                                )}
                                <p className="text-slate-500 font-medium">@{user.username}</p>
                            </div>

                            {/* Edit / Save tugmalari */}
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200">
                                        <X size={20} />
                                    </button>
                                    <button onClick={handleSaveProfile} className="p-2 bg-green-500 rounded-lg text-white hover:bg-green-600 shadow-lg shadow-green-500/20">
                                        <Save size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100">
                                    <Edit2 size={20} />
                                </button>
                            )}
                        </div>
                        
                        {/* Grid ma'lumotlar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* TELEFON (O'zgarmas) */}
                            <InfoCard 
                                icon={<Phone className="text-green-500" size={20} />}
                                label="Telefon raqam"
                                value={user.phone}
                            />

                            {/* TELEGRAM ID (Backenddan kelsa) */}
                            <InfoCard 
                                icon={<Hash className="text-blue-500" size={20} />}
                                label="Telegram ID"
                                value={user.telegram_id || "Bog'lanmagan"}
                            />

                            {/* EMAIL */}
                            <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <Mail className="text-orange-500" size={20} />
                                <div className="w-full">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                                    {isEditing ? (
                                        <input 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="bg-white px-2 py-1 rounded border w-full text-sm font-bold text-slate-700"
                                        />
                                    ) : (
                                        <p className="font-bold text-slate-700">{user.email || "---"}</p>
                                    )}
                                </div>
                            </div>

                            {/* ROL / DARAJA */}
                            <InfoCard 
                                icon={<Shield className="text-purple-500" size={20} />}
                                label="Daraja"
                                value={`${user.role?.toUpperCase()} • ${user.level?.toUpperCase()}`}
                            />
                            
                            {/* ID (Database ID) */}
                            <InfoCard 
                                icon={<UserIcon className="text-slate-500" size={20} />}
                                label="Tizim ID"
                                value={user.id}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Kichik komponent: Ma'lumot kartochkasi
function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            {icon}
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
                <p className="font-bold text-slate-700 break-all">{value}</p>
            </div>
        </div>
    )
}