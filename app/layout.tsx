import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import LayoutWrapper from "@/components/LayoutWrapper"
import { Suspense } from "react"
import ProgressBar from "@/components/Providers/ProgressBar"
import { AuthProvider } from "@/lib/AuthContext"

/* Fonts */
const geist = Geist({
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    subsets: ["latin"],
})

/* Mobile / viewport */
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

/* SEO + Telegram / OpenGraph */
export const metadata: Metadata = {
    metadataBase: new URL("https://cefr.enwis.uz"),

    title: {
        default: "ENWIS – CEFR imtihoniga tayyorgarlik platformasi",
        template: "%s | ENWIS",
    },

    description:
        "CEFR imtihoniga real formatda tayyorlaning: listening, reading, writing va speaking uchun tizimli platforma",

    alternates: {
        canonical: "https://cefr.enwis.uz",
    },

    openGraph: {
        title: "ENWIS – CEFR imtihoniga tayyorgarlik platformasi",
        description:
            "CEFR imtihoni uchun real interfeys va tizimli mashqlar bilan tayyorgarlik platformasi",
        url: "https://cefr.enwis.uz",
        siteName: "ENWIS",
        locale: "uz_UZ",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "ENWIS CEFR platformasi",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "ENWIS – CEFR tayyorgarlik platformasi",
        description:
            "CEFR imtihoni uchun real interfeys va tizimli mashqlar",
        images: ["/og-image.jpg"],
    },

    icons: {
        icon: "/logo_icon.png",
        apple: "/logo_icon.png",
    },

    robots: {
        index: true,
        follow: true,
    },
}

/* Root layout */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uz">
            <body>
                <meta name="referrer" content="no-referrer-when-downgrade"></meta>
                <script src="https://accounts.google.com/gsi/client" async defer></script>
                <Suspense fallback={null}><ProgressBar /></Suspense>
                {/* AuthProvider hamma narsani o'rab turibdi */}
                <AuthProvider>
                    <LayoutWrapper>{children}</LayoutWrapper>
                </AuthProvider>
                
                <Analytics />
            </body>
        </html>
    )
}