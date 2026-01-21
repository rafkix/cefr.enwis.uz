"use client"

import { usePathname } from "next/navigation"
import { Header } from "./Header"
import { Footer } from "./Footer"


export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Header va Footer ko'rinmasligi kerak bo'lgan sahifalar ro'yxati
    const noLayoutPages = ["/auth/phone", "/auth/register", "/dashboard"]

    // Agar hozirgi sahifa noLayoutPages ichida bo'lsa (yoki dashboard bilan boshlansa)
    const isNoLayout = noLayoutPages.some(page => pathname.startsWith(page))

    if (isNoLayout) {
        return <>{children}</>
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    )
}