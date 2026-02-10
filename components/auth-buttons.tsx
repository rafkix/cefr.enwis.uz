'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api/auth';
import { useAuth } from '@/lib/AuthContext';
import { jwtDecode } from 'jwt-decode'; // Google ma'lumotlarini o'qish uchun

export const SocialAuthButtons = () => {
    return (
        <div className="flex w-full flex-col gap-4">
            {/* Google tugmasi tepada */}
            <GoogleSignInButton />
            
            {/* Telegram tugmasi pastda */}
            <TelegramSignInWidget />
        </div>
    );
};

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
                        // Backend kutayotgan GoogleLoginPayload ga moslash
                        const decoded: any = jwtDecode(response.credential);
                        const payload = {
                            google_id: decoded.sub,
                            email: decoded.email,
                            name: decoded.name,
                            picture: decoded.picture
                        };

                        await authService.googleLogin(payload);
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
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
        >
            {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
            )}
            <span>{isLoading ? 'Yuklanmoqda...' : 'Google orqali kirish'}</span>
        </button>
    );
};

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
        const scriptId = "telegram-widget-script";
        
        // Agar skript allaqachon bo'lsa, uni o'chirib qayta yuklaymiz (re-render uchun)
        const existingScript = document.getElementById(scriptId);
        if (existingScript) existingScript.remove();

        (window as any).onTelegramAuth = async (user: any) => {
            try {
                await authService.telegramLogin(user);
                await refreshUser();
                const nextPath = clientId ? `/auth/authorize${getQueryString()}` : '/dashboard';
                router.push(nextPath);
            } catch (error: any) {
                alert(error.response?.data?.detail || "Telegram xatosi.");
            }
        };

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "EnwisAuthBot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "12");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");

        if (telegramWrapperRef.current) {
            telegramWrapperRef.current.innerHTML = '';
            telegramWrapperRef.current.appendChild(script);
            setIsLoaded(true);
        }
    }, [isLoaded, clientId]);

    return (
        <div className="flex w-full items-center justify-center">
            {/* Telegram vidjeti iframe bo'lgani uchun uni 100% kenglikda qilish qiyin, 
                lekin markazda chiroyli turishi ta'minlandi. 
            */}
            <div 
                ref={telegramWrapperRef} 
                className="min-h-[48px] w-full flex justify-center items-center"
            />
            
            {!isLoaded && (
                <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            )}
        </div>
    );
};