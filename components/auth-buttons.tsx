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

export const TelegramSignInWidget = () => {
    const telegramWrapperRef = useRef<HTMLDivElement>(null);
    const [widgetLoaded, setWidgetLoaded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();

    const clientIdParam = searchParams.get("client_id");
    const redirectUri = searchParams.get("redirect_uri");
    const state = searchParams.get("state");

    useEffect(() => {
        if (widgetLoaded || !telegramWrapperRef.current) return;

        (window as any).onTelegramAuth = async (user: any) => {
            try {
                await authService.telegramLogin(user);
                await refreshUser();
                const nextPath = clientIdParam ? `/auth/authorize?client_id=${clientIdParam}&redirect_uri=${redirectUri}&state=${state}` : '/dashboard';
                router.push(nextPath);
            } catch (error: any) {
                alert("Telegram auth xatosi");
            }
        };

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "EnwisAuthBot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "20");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");

        telegramWrapperRef.current.appendChild(script);
        setWidgetLoaded(true);

        return () => { delete (window as any).onTelegramAuth; };
    }, [widgetLoaded, clientIdParam]);

    return (
        <div className="relative h-11 w-full flex items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all">
            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
                <svg className="w-4 h-4 text-[#229ED9]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                </svg>
                <span className="font-bold text-[#229ED9] text-xs uppercase">Telegram</span>
            </div>
            <div ref={telegramWrapperRef} className="relative z-10 opacity-0 cursor-pointer scale-[3]" />
        </div>
    );
};