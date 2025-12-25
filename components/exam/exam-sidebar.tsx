"use client"

export default function ExamSidebar({
  currentQuestion,
  totalQuestions,
  answered,
  flagged,
  onSelectQuestion,
}: {
  currentQuestion: number
  totalQuestions: number
  answered: Record<number, boolean>
  flagged: Record<number, boolean>
  onSelectQuestion: (q: number) => void
}) {
  // Group questions into sections (Part 1: 1-13, Part 2: 14-26, Part 3: 27-40)
  const sections = [
    { label: "Part 1", start: 1, end: 13 },
    { label: "Part 2", start: 14, end: 26 },
    { label: "Part 3", start: 27, end: 40 },
  ]

  return (
    <div className="w-32 flex-shrink-0 border-r border-gray-300 bg-gray-50 overflow-y-auto p-3">
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">{section.label}</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: section.end - section.start + 1 }, (_, i) => section.start + i).map((q) => {
                const isActive = q === currentQuestion
                const isAnswered = answered[q]
                const isFlagged = flagged[q]

                let bgColor = "bg-white border-gray-300 text-gray-700"
                if (isActive) {
                  bgColor = "bg-blue-600 border-blue-600 text-white"
                } else if (isFlagged) {
                  bgColor = "bg-orange-100 border-orange-400 text-orange-700"
                } else if (isAnswered) {
                  bgColor = "bg-green-100 border-green-400 text-green-700"
                }

                return (
                  <button
                    key={q}
                    onClick={() => onSelectQuestion(q)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-medium text-xs transition-all ${bgColor} hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    aria-label={`Question ${q}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {q}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
