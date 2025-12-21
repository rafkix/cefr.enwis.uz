"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type SkillColor = "green" | "purple" | "orange" | "red"

interface SkillCardProps {
  title: string
  time: string
  parts: string[]
  icon: LucideIcon
  buttonText: string
  onClick: () => void
  badge?: string
  color?: SkillColor
}

const colorMap: Record<
  SkillColor,
  {
    button: string
    buttonHover: string
    iconBg: string
    iconColor: string
  }
> = {
  green: {
    button: "bg-green-600",
    buttonHover: "hover:bg-green-700",
    iconBg: "bg-green-50",
    iconColor: "text-green-400",
  },
  purple: {
    button: "bg-purple-600",
    buttonHover: "hover:bg-purple-700",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-400",
  },
  orange: {
    button: "bg-orange-500",
    buttonHover: "hover:bg-orange-600",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
  },
  red: {
    button: "bg-red-600",
    buttonHover: "hover:bg-red-700",
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
  },
}

export function SkillCard({
  title,
  time,
  parts,
  icon: Icon,
  buttonText,
  onClick,
  badge,
  color = "green",
}: SkillCardProps) {
  const c = colorMap[color]

  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute right-0 top-0">
          <div className="rounded-bl-xl rounded-tr-xl bg-green-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            {badge}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-1 flex-col">
        <h3 className="mb-2 text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mb-6 text-sm text-gray-500">{time}</p>

        <div className="mb-8 flex-1 space-y-2">
          {parts.map((part, index) => (
            <div key={index} className="text-base text-gray-700">
              {part}
            </div>
          ))}
        </div>

        {/* Button */}
        <Button
          className={cn(
            "w-full rounded-lg py-6 text-base font-medium text-white",
            c.button,
            c.buttonHover
          )}
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <Icon className="mr-2 h-5 w-5" />
          {buttonText}
        </Button>
      </div>

      {/* Right Icon */}
      <div className="absolute right-8 top-16">
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full",
            c.iconBg
          )}
        >
          <Icon className={cn("h-12 w-12", c.iconColor)} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
