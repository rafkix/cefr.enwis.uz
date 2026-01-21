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
                <link rel="icon" href="https://image2url.com/images/1764944410839-0e0e3e25-d678-4801-9f49-011a4d8f6de0.png" />
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