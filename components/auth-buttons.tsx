'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api/auth';
import { useAuth } from '@/lib/AuthContext';

export const GoogleSignInButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();

    const clientIdParam = searchParams.get("client_id");
    const redirectUri = searchParams.get("redirect_uri");
    const state = searchParams.get("state");

    const getQueryString = () => 
        clientIdParam ? `?client_id=${clientIdParam}&redirect_uri=${redirectUri}&state=${state}` : "";

    const handleGoogleLogin = () => {
        const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (!GOOGLE_ID) {
            alert("Tizim xatosi: Google Client ID topilmadi.");
            return;
        }

        if (!(window as any).google) {
            alert("Google kutubxonasi yuklanmadi. Sahifani yangilang.");
            return;
        }

        setIsLoading(true);

        try {
            (window as any).google.accounts.id.initialize({
                client_id: GOOGLE_ID,
                callback: async (response: any) => {
                    try {
                        await authService.googleLogin({ token: response.credential });
                        await refreshUser();
                        const nextPath = clientIdParam ? `/auth/authorize${getQueryString()}` : '/dashboard';
                        router.push(nextPath);
                    } catch (error: any) {
                        alert(error.response?.data?.detail || "Google orqali kirishda xatolik.");
                    } finally {
                        setIsLoading(false);
                    }
                },
            });
            (window as any).google.accounts.id.prompt();
        } catch (err) {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white font-bold text-slate-600 text-xs transition-all hover:bg-slate-50 active:scale-[0.98]"
        >
            {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
            ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
            )}
            {isLoading ? 'Yuklanmoqda...' : 'Google'}
        </button>
    );
};

/**
 * TELEGRAM SIGN IN WIDGET
 * Invalid domain holatida ham Telegram logosi bilan chiroyli turadi
 */
export const TelegramSignInWidget = () => {
    const telegramWrapperRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();
    
    const clientId = searchParams.get("client_id");
    const redirectUri = searchParams.get("redirect_uri");
    const state = searchParams.get("state");
    const getQueryString = () => clientId ? `?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}` : "";

    useEffect(() => {
        // Faqat bir marta yuklanishini ta'minlash
        if (isLoaded) return;

        // Global callback funksiyasini yaratish
        (window as any).onTelegramAuth = async (user: any) => {
            try {
                await authService.telegramLogin(user);
                await refreshUser();
                const nextPath = clientId ? `/auth/authorize${getQueryString()}` : '/dashboard';
                router.push(nextPath);
            } catch (error: any) {
                console.error("Telegram Login Error:", error);
                alert(error.response?.data?.detail || "Telegram orqali kirishda xatolik yuz berdi.");
            }
        };

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        // Bot nomini tekshiring: EnwisAuthBot
        script.setAttribute("data-telegram-login", "EnwisAuthBot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "12"); // Dizayningizga mos radius
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");

        if (telegramWrapperRef.current) {
            telegramWrapperRef.current.innerHTML = ''; // Dublikat bo'lmasligi uchun
            telegramWrapperRef.current.appendChild(script);
            setIsLoaded(true);
        }
    }, [isLoaded]);

    return (
        <div className="flex w-full flex-col items-center justify-center gap-2">
            {/* Vidjet konteyneri */}
            <div 
                ref={telegramWrapperRef} 
                className="min-h-[44px] flex items-center justify-center transition-all hover:opacity-90"
            />
            
            {/* Agar vidjet yuklanmay qolsa yoki domain xatosi bo'lsa zaxira matni */}
            {!isLoaded && (
                <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 animate-pulse">
                    <div className="h-4 w-4 rounded-full bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
            )}
        </div>
    );
};