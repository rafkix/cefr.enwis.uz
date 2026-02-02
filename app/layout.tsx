import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import LayoutWrapper from "@/components/LayoutWrapper"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import LayoutWrapper from "@/components/LayoutWrapper"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: {
    default: "ENWIS – CEFR imtihoniga tayyorgarlik platformasi",
    template: "%s | ENWIS",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  description:
    "CEFR imtihoniga real formatda tayyorlaning: listening, reading, writing va speaking uchun tizimli platforma",

  metadataBase: new URL("https://cefr.enwis.uz"),

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
        url: "/og-image.jpg", // metadataBase bilan birga ishlaydi
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
