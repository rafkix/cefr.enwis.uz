"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TelegramRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith("#tgAuthResult=")) return

    const encoded = hash.replace("#tgAuthResult=", "")
    const tgData = JSON.parse(atob(encoded))

    fetch("https://gloomful-admirative-tanisha.ngrok-free.dev/v1/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tgData),
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("access_token", data.access_token)
        router.replace("/")
      })
      .catch(() => {
        router.replace("/auth/sign-in")
      })
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      Signing in with Telegram…
    </div>
  )
}
