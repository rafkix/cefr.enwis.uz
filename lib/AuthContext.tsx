"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authService, User } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (data: any, redirect?: boolean) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    /**
     * 🔥 INIT AUTH (cookie-based)
     * Tokenni tekshirmaymiz → backendga so‘rov yuboramiz
     */
    useEffect(() => {
        const initAuth = async () => {
            try {
                const userData = await authService.getMe()
                setUser(userData)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [])

    /**
     * LOGIN (faqat phone uchun qoladi)
     */
    const login = async (data: any, redirect: boolean = true) => {
        try {
            setLoading(true)

            await authService.loginByPhone(data)

            const userData = await authService.getMe()
            setUser(userData)

            if (redirect) {
                router.push("/dashboard")
            }
        } finally {
            setLoading(false)
        }
    }

    /**
     * 🔥 LOGOUT (backend session delete)
     */
    const logout = async () => {
        try {
            await authService.logout() // 🔥 backend API bo‘lishi shart
        } catch (e) {
            console.error("Logout error:", e)
        } finally {
            setUser(null)
            window.location.href = "https://auth.enwis.uz" // 🔥 SSO chiqish
        }
    }

    /**
     * 🔥 REFRESH USER (token check yo‘q)
     */
    const refreshUser = async () => {
        try {
            const userData = await authService.getMe()
            setUser(userData)
        } catch {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}