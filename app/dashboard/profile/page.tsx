'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Phone,
  Mail,
  Trash2,
  Settings2,
  SmartphoneNfc,
  Globe,
  LogOut,
  X,
  Info,
  ShieldAlert,
  BadgeCheck,
  Loader2,
  SendHorizontal,
  Smartphone,
  UserCircle2,
  Calendar,
  User2,
  Check,
  Camera,
} from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { userService } from '@/lib/api/user'
import { UserContact, UserSession } from '@/lib/types/user'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [contacts, setContacts] = useState<UserContact[]>([])
  const [checking, setChecking] = useState(false)

  const [newPhone, setNewPhone] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form data interfeysga (UserProfile) to'liq moslandi
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    birth_date: '',
    language: 'uz',
    timezone: 'Asia/Tashkent',
  })

  const phoneContact = useMemo(
    () => contacts.find((c) => c.contact_type === 'phone'),
    [contacts]
  )
  const emailContact = useMemo(
    () => contacts.find((c) => c.contact_type === 'email'),
    [contacts]
  )

  const copyRawJson = () => {
    if (!user) return
    navigator.clipboard.writeText(JSON.stringify(user, null, 2))
    toast.info('Raw JSON nusxalandi')
    console.log('User Data:', user)
  }

  // 1. MA'LUMOTLARNI YUKLASH
  const loadData = useCallback(async () => {
    try {
      const [sessRes, contRes] = await Promise.all([
        userService.getSessions(),
        userService.getContacts(),
      ])
      setSessions(sessRes.data)
      setContacts(contRes.data)
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err)
    }
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.profile?.full_name || '',
        bio: user.profile?.bio || '',
        birth_date: user.profile?.birth_date || '',
        language: user.profile?.language || 'uz',
        timezone: user.profile?.timezone || 'Asia/Tashkent',
      })
      loadData()
    }
  }, [user, loadData])

  // 2. AVATAR YUKLASH
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarLoading(true)
    try {
      await userService.uploadAvatar(file)
      await refreshUser()
      toast.success('Profil rasmi yangilandi')
    } catch (error: any) {
      toast.error('Rasm yuklashda xatolik')
    } finally {
      setAvatarLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // 3. PROFILNI SAQLASH
  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Backend Partial<UserProfile> kutadi
      await userService.updateProfile(formData)
      await refreshUser()
      setIsEditing(false)
      toast.success("Ma'lumotlar yangilandi")
    } catch (error) {
      toast.error('Saqlashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  // 4. KONTAKT QO'SHISH
  const handleAddPhone = async () => {
    if (!newPhone.startsWith('+') || newPhone.length < 9) {
      return toast.error('Format xato: +998XXXXXXXXX')
    }
    setLoading(true)
    try {
      await userService.addContact('phone', newPhone)
      await loadData()
      setNewPhone('')
      toast.success("Raqam qo'shildi")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Xatolik')
    } finally {
      setLoading(false)
    }
  }

  // 5. STATUSNI TEKSHIRISH (Botdan keyin yangilash uchun)
  const handleCheckStatus = async () => {
    setChecking(true)
    try {
      await refreshUser()
      await loadData()
      toast.success("Ma'lumotlar yangilandi")
    } finally {
      setChecking(false)
    }
  }

  // 6. SESSIYANI YAKUNLASH
  const handleRevokeSession = async (id: string) => {
    try {
      await userService.revokeSession(id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
      toast.success("Sessiya o'chirildi")
    } catch {
      toast.error('Xatolik yuz berdi')
    }
  }

  return (
    <div className="min-h-screen dark:bg-[#0a0a0b] py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Avatar & Quick Actions */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <button
            onClick={copyRawJson}
            title="Raw JSON"
            className="p-4 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-2xl border dark:border-white/5 hover:text-blue-500 transition-all active:scale-95"
          >
            <code className="text-[10px] font-black italic">{}</code>
            <span className="text-[10px] font-black uppercase tracking-tighter">
              JSON
            </span>
          </button>
          <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-[40px] overflow-hidden bg-slate-100 dark:bg-white/5 border-4 border-blue-500/5 relative">
                {user?.profile?.avatar_url ? (
                  <img
                    src={`${API_URL}${user.profile.avatar_url}`}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <UserCircle2 size={80} />
                  </div>
                )}
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="animate-spin text-white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="absolute -bottom-2 -right-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl transition-all z-10"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
                accept="image/*"
              />
            </div>

            <h1 className="text-2xl font-black dark:text-white mb-1 truncate">
              {user?.profile?.full_name || 'Ism kiritilmagan'}
            </h1>
            <p className="text-blue-500 font-bold text-sm mb-6">
              @{user?.profile?.username}
            </p>
            <code>
              <p className="text-blue-500 font-bold text-sm mb-6">{user?.id}</p>
            </code>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-green-600"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <Check size={16} /> Saqlash
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-slate-50 dark:bg-white/5 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 border dark:border-white/5 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <Settings2 size={16} /> Tahrirlash
                </button>
              )}
              <button
                onClick={logout}
                className="p-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl border border-red-100 dark:border-red-500/20 hover:bg-red-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* CONTACTS SECTION */}
          <div className="space-y-4">
            {!phoneContact ? (
              <div className="p-5 rounded-[30px] bg-blue-500/5 border border-blue-500/20">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3">
                  Raqam biriktirish
                </p>
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
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Check size={20} />
                    )}
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
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Telefon raqam
                      </p>
                      {phoneContact.is_verified && (
                        <BadgeCheck size={14} className="text-green-500" />
                      )}
                    </div>
                    <p className="font-bold text-[14px] dark:text-white truncate">
                      {phoneContact.value}
                    </p>
                  </div>
                </div>

                {!phoneContact.is_verified && (
                  <div className="p-5 bg-blue-500/5 rounded-[30px] border border-blue-500/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400">
                        Tasdiqlash kutilmoqda
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="https://t.me/EnwisAuthBot?start=verify_phone"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-[#0088cc] text-white py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2"
                      >
                        <SendHorizontal size={14} /> Botga o'tish
                      </a>
                      <button
                        onClick={handleCheckStatus}
                        disabled={checking}
                        className="px-4 bg-white dark:bg-white/10 rounded-xl text-[10px] font-black text-blue-500 uppercase border border-blue-200 dark:border-blue-500/20"
                      >
                        {checking ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          'YANGILASH'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-5 rounded-[30px] bg-slate-50/50 dark:bg-white/5 border dark:border-white/5 flex items-center gap-4 opacity-70">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <Mail className="text-orange-500" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                  Email (Asosiy)
                </p>
                <p className="font-bold text-[14px] dark:text-white truncate">
                  {emailContact?.value || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Sessions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
            <h3 className="text-lg font-black dark:text-white flex items-center gap-2 mb-8">
              <Info size={22} className="text-blue-500" /> Shaxsiy ma'lumotlar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <EditableCard
                icon={<User2 className="text-blue-500" />}
                label="To'liq ism"
                isEditing={isEditing}
              >
                <input
                  className="w-full bg-transparent border-none outline-none font-bold text-[14px] dark:text-white"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Ismingizni kiriting..."
                />
              </EditableCard>

              <EditableCard
                icon={<Globe className="text-indigo-500" />}
                label="Til"
                isEditing={isEditing}
              >
                {isEditing ? (
                  <select
                    className="w-full bg-transparent border-none outline-none font-bold text-[14px] dark:text-white"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                  >
                    <option value="uz">O'zbekcha</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                ) : (
                  <p className="font-bold text-[14px] dark:text-white uppercase">
                    {formData.language}
                  </p>
                )}
              </EditableCard>

              <EditableCard
                icon={<Calendar className="text-purple-500" />}
                label="Tug'ilgan sana"
                isEditing={isEditing}
              >
                <input
                  type={isEditing ? 'date' : 'text'}
                  className="w-full bg-transparent border-none outline-none font-bold text-[14px] dark:text-white"
                  value={formData.birth_date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </EditableCard>

              <EditableCard
                icon={<SmartphoneNfc className="text-blue-500" />}
                label="Vaqt mintaqasi"
                isEditing={false}
              >
                <p className="font-bold text-[14px] dark:text-white truncate">
                  {formData.timezone}
                </p>
              </EditableCard>

              <EditableCard
                icon={<Check className="text-green-500" />}
                label="BIO"
                isEditing={isEditing}
                isFullWidth
              >
                <textarea
                  className="w-full bg-transparent border-none outline-none font-medium text-[14px] dark:text-white resize-none"
                  rows={isEditing ? 3 : 1}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="O'zingiz haqingizda..."
                />
              </EditableCard>
            </div>
          </div>

          {/* SESSIONS SECTION */}
          <div className="bg-white dark:bg-[#151516] rounded-[40px] p-8 shadow-sm border dark:border-white/5">
            <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2">
              <SmartphoneNfc size={22} className="text-blue-500" /> Faol sessiyalar
            </h3>
            <div className="space-y-3">
              {sessions.map((s) => {
                // Backend is_current ni bermagan bo'lsa, mantiqiy aniqlash (optional)
                const isThisDevice = false // Agar IP/UA mos kelsa true qilishingiz mumkin

                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-4 rounded-[28px] bg-slate-50 dark:bg-white/5 border dark:border-white/5 gap-3"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div
                        className={`p-4 rounded-2xl shrink-0 bg-white dark:bg-white/10 text-slate-400`}
                      >
                        {s.user_agent.toLowerCase().includes('mobile') ? (
                          <Smartphone size={20} />
                        ) : (
                          <Globe size={20} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-[14px] dark:text-white truncate">
                            {s.ip_address}
                          </p>
                          {s.is_revoked && (
                            <span className="text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-md uppercase font-black">
                              Revoked
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium truncate opacity-70">
                          {s.user_agent}
                        </p>
                      </div>
                    </div>
                    {!s.is_revoked && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all shrink-0 active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Yordamchi komponentlar
const EditableCard = ({ icon, label, children, isEditing, isFullWidth }: any) => (
  <div
    className={`p-5 rounded-[30px] border transition-all flex items-center gap-4 ${
      isEditing
        ? 'bg-blue-500/5 border-blue-500/30 ring-2 ring-blue-500/10'
        : 'bg-white dark:bg-white/5 border-transparent'
    } ${isFullWidth ? 'md:col-span-2' : ''}`}
  >
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isEditing ? 'bg-blue-500/10' : 'bg-slate-50 dark:bg-white/10'}`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      {children}
    </div>
  </div>
)
