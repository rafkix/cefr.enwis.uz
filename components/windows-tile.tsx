"use client"

import { LucideIcon } from "lucide-react"

interface HeroExamTileProps {
  icon: LucideIcon
  label: string
  desc: string
  color: string
  onClick: () => void
}

export function HeroExamTile({
  icon: Icon,
  label,
  desc,
  color,
  onClick,
}: HeroExamTileProps) {
  return (
    <button
      onClick={onClick}
      className="
        group relative w-full h-40 sm:h-44
        rounded-2xl overflow-hidden
        transition-all duration-500
        hover:-translate-y-2 hover:shadow-2xl
        focus:outline-none
      "
      style={{ background: color }}
    >
      {/* depth layer */}
      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition" />

      {/* diagonal accent */}
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rotate-12 bg-white/10"
      />

      {/* content */}
      <div className="relative z-10 flex h-full items-center gap-4 px-6 text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <div className="text-lg font-semibold tracking-wide">
            {label}
          </div>
          <div className="text-sm opacity-80">
            {desc}
          </div>
        </div>
      </div>

      {/* bottom highlight */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40 opacity-0 group-hover:opacity-100 transition" />
    </button>
  )
}
