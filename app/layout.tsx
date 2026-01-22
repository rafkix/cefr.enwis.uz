import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import LayoutWrapper from "@/components/LayoutWrapper" // Import qiling

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "E N W I S - CEFR imtihoniga tayyorgarlik platformasi",
    description: "Tizimli amaliyot bilan tinglash, o'qish, yozish va gapirishni yaxshilang",
    generator: "cefr.enwis.uz",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="uz">
            <head>
                <link rel="icon" href="/logo_icon.png" />
            </head>
            <body className="font-sans antialiased">
                {/* LayoutWrapper barcha mantiqni o'z ichiga oladi */}
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
                <Analytics />
            </body>
        </html>
    )
}