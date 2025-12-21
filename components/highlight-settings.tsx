"use client"

interface HighlightSettingsProps {
  highlightColor: string
  onColorChange: (color: string) => void
  highlightCount: number
}

const colorOptions = [
  { value: "bg-yellow-200", label: "Yellow", hex: "#fef08a" },
  { value: "bg-green-200", label: "Green", hex: "#bbf7d0" },
  { value: "bg-blue-200", label: "Blue", hex: "#bfdbfe" },
  { value: "bg-pink-200", label: "Pink", hex: "#fbcfe8" },
  { value: "bg-orange-200", label: "Orange", hex: "#fed7aa" },
]

export default function HighlightSettings({ highlightColor, onColorChange, highlightCount }: HighlightSettingsProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-r border-gray-300 bg-gray-50">
      <div className="text-xs font-medium text-gray-700">Highlight:</div>
      <div className="flex gap-2">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`w-6 h-6 rounded border-2 transition-all ${
              highlightColor === color.value ? "border-gray-800 shadow-md" : "border-gray-300 hover:border-gray-500"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.label}
          />
        ))}
      </div>
      <div className="text-xs text-gray-500 ml-auto">{highlightCount} marked</div>
    </div>
  )
}
