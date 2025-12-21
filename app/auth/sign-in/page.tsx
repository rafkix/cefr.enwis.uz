"use client"

export default function SignInPage() {
  const TELEGRAM_URL =
    "https://oauth.telegram.org/auth" +
    "?bot_id=8542032478:AAFzdZ8JnvL4gGYugIEPs1GMEA0gdQU7reo" +
    "&origin=http://localhost:3000/auth/telegram/redirect" +
    "&request_access=write"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Sign in to ENWIS
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          No password • No email • Secure login
        </p>

        <a
          href={TELEGRAM_URL}
          className="flex items-center justify-center gap-3 rounded-lg bg-blue-500 px-6 py-3 text-white font-medium hover:bg-blue-600 transition"
        >
          Continue with Telegram
        </a>
      </div>
    </div>
  )
}
