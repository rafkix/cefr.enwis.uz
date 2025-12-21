"use client"

import { useState } from "react"
import { ReadingResult } from "@/lib/calculate-reading-score"

export default function GridResultView({
  result,
}: {
  result: ReadingResult
}) {
  const [active, setActive] = useState<number | null>(null)

  const selected = result.detailed.find(
    (q) => q.questionId === active
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ================= GRID ================= */}
      <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border">
        <div
          className="
            grid
            grid-cols-3
            gap-3
            sm:grid-cols-5
            md:grid-cols-7
            lg:grid-cols-10
          "
        >
          {result.detailed.map((q, i) => {
            const isActive = active === q.questionId

            return (
              <button
                key={q.questionId}
                onClick={() =>
                  setActive(isActive ? null : q.questionId)
                }
                className={`
                  aspect-square
                  rounded-xl
                  text-sm
                  font-semibold
                  flex
                  items-center
                  justify-center
                  transition-all
                  ${
                    q.isCorrect
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }
                  ${
                    isActive
                      ? "ring-4 ring-black scale-110 z-10"
                      : "opacity-90 hover:opacity-100"
                  }
                `}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* ================= DETAIL ================= */}
      {selected && (
        <div
          className="
            rounded-2xl
            bg-white
            p-4
            sm:p-6
            shadow-md
            border
            animate-in
            fade-in
            slide-in-from-bottom-3
          "
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800">
              Question {selected.questionId}
            </h3>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                selected.isCorrect
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {selected.isCorrect ? "Correct" : "Wrong"}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">
                Your answer:
              </span>
              <span className="ml-2 font-medium text-gray-900">
                {selected.userAnswer || "—"}
              </span>
            </p>

            {!selected.isCorrect && (
              <p>
                <span className="text-gray-500">
                  Correct answer:
                </span>
                <span className="ml-2 font-semibold text-emerald-600">
                  {selected.correctAnswer}
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
