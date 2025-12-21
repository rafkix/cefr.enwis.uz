import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const colorMap = {
  blue: {
    icon: "text-blue-600",
    bg: "bg-blue-50",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  purple: {
    icon: "text-purple-600",
    bg: "bg-purple-50",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  orange: {
    icon: "text-orange-600",
    bg: "bg-orange-50",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  red: {
    icon: "text-red-600",
    bg: "bg-red-50",
    button: "bg-red-600 hover:bg-red-700",
  },
}

type SkillCardProps = {
  title: string
  time: string
  parts: string[]
  icon: any
  buttonText: string
  onClick: () => void
  badge?: string
  color?: keyof typeof colorMap
}

export function SkillCard({
  title,
  time,
  parts,
  icon: Icon,
  buttonText,
  onClick,
  badge,
  color = "blue",
}: SkillCardProps) {
  const c = colorMap[color]

  return (
    <div className="relative rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      {badge && (
        <span className="absolute right-0 top-0 rounded-bl-xl rounded-tr-xl bg-green-500 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{time}</p>

      <div
        className={cn(
          "my-4 flex h-24 items-center justify-center rounded-xl",
          c.bg
        )}
      >
        <Icon className={cn("h-10 w-10", c.icon)} />
      </div>

      <ul className="mb-6 space-y-1 text-sm text-gray-600">
        {parts.map((part) => (
          <li key={part}>{part}</li>
        ))}
      </ul>

      <Button
        onClick={onClick}
        className={cn("w-full text-white", c.button)}
      >
        {buttonText}
      </Button>
    </div>
  )
}
