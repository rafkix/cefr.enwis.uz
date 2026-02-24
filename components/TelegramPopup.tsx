"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  open: boolean
  onClose: () => void
  telegramUrl: string
}

export default function TelegramPopup({ open, onClose, telegramUrl }: Props) {
  const close = useCallback(() => onClose(), [onClose])

  // ESC bilan yopish
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  // Scroll lock
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* overlay */}
          <button
            type="button"
            aria-label="Close overlay"
            onClick={close}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* modal */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-3 top-3 p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="p-7">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F3FA] flex items-center justify-center mb-4">
                {/* Telegram icon */}
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                    fill="#0088cc"
                    opacity="0.12"
                  />
                  <path
                    d="M16.64 8.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.06 0-.1a.25.25 0 0 0-.05-.08c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27 0 .06.02.24.01.38Z"
                    fill="#0088cc"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Telegram kanalimizga obuna bo‘ling!
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Yangiliklar, foydali maslahatlar va eksklyuziv kontentni birinchi bo‘lib oling.
              </p>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#0088cc] hover:bg-[#007ab8] text-white font-bold text-sm py-3.5 transition shadow-lg shadow-[#0088cc]/20"
              >
                Kanalga a’zo bo‘lish
              </a>

              <button
                type="button"
                onClick={close}
                className="mt-3 w-full text-xs font-bold text-slate-500 hover:text-slate-700 transition"
              >
                Hozir emas
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}