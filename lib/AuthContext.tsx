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

    // =========================
    // 🔥 INIT AUTH (SAFE)
    // =========================
    useEffect(() => {
        let mounted = true

        const initAuth = async () => {
            try {
                const userData = await authService.getMe()

                if (mounted && userData && typeof userData === "object") {
                    setUser(userData)
                } else {
                    setUser(null)
                }
            } catch (err) {
                console.error("❌ Auth init error:", err)
                setUser(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        initAuth()

        return () => {
            mounted = false
        }
    }, [])

    // =========================
    // 🔐 LOGIN
    // =========================
    const login = async (data: any, redirect: boolean = true) => {
        setLoading(true)

        try {
            await authService.loginByPhone(data)

            const userData = await authService.getMe()

            if (!userData) throw new Error("User not found after login")

            setUser(userData)

            if (redirect) {
                router.push("/dashboard")
            }
        } catch (err) {
            console.error("❌ Login error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // =========================
    // 🚪 LOGOUT
    // =========================
    const logout = async () => {
        try {
            await authService.logout()
        } catch (err) {
            console.error("❌ Logout error:", err)
        } finally {
            setUser(null)

            // 🔥 SSR-safe redirect
            if (typeof window !== "undefined") {
                window.location.href = "https://auth.enwis.uz"
            }
        }
    }

    // =========================
    // 🔄 REFRESH USER
    // =========================
    const refreshUser = async () => {
        try {
            const userData = await authService.getMe()

            if (!userData) {
                setUser(null)
                return
            }

            setUser(userData)
        } catch (err) {
            console.error("❌ Refresh error:", err)
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// =========================
// 🧠 HOOK
// =========================
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    return context
}