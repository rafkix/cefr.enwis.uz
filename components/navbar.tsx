"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50">
      {/* subtle bottom glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-red-500/40 to-transparent" />

      <nav className="relative border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 select-none">
                <img src="/enwis.png" alt="WALLE" className="w-35 h-35 object-contain" />
            </Link>

            {/* NAV LINKS */}
            <div className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active = pathname === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative rounded-md px-3 py-2 text-sm font-medium
                      transition-all
                      ${
                        active
                          ? "text-red-600 bg-red-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    {link.label}

                    {/* active underline */}
                    {active && (
                      <span className="absolute inset-x-2 -bottom-px h-px bg-red-500" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* CTA */}
            <Button
              onClick={() => router.push("/test")}
              className="
                h-9 rounded-md
                bg-red-600 px-5 text-sm font-medium text-white
                shadow-md shadow-red-500/20
                hover:bg-red-700
              "
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
