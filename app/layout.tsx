import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import LayoutWrapper from "@/components/LayoutWrapper"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E N W I S - CEFR imtihoniga tayyorgarlik platformasi",
  description: "Tizimli amaliyot bilan tinglash, o‘qish, yozish va gapirishni yaxshilang",

  openGraph: {
    title: "E N W I S - CEFR imtihoniga tayyorgarlik platformasi",
    description: "CEFR imtihoni uchun tizimli amaliyot platformasi",
    url: "https://cefr.enwis.uz",
    siteName: "ENWIS",
    images: [
      {
        url: "https://cefr.enwis.uz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ENWIS CEFR platformasi",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "E N W I S - CEFR imtihoniga tayyorgarlik platformasi",
    description: "CEFR tayyorgarlik platformasi",
    images: ["https://cefr.enwis.uz/og-image.jpg"],
  },

  icons: {
    icon: "/logo_icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className="font-sans antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}
