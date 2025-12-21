"use client"

import { useRouter } from "next/navigation"
import { SkillCard } from "@/components/skill-card"
import {
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Skill = {
  title: string
  time: string
  parts: string[]
  icon: any
  buttonText: string
  route: string
  color: "green" | "purple" | "orange" | "red"
  badge?: string
}

export default function PracticeHomePage() {
  const router = useRouter()

  const skills: Skill[] = [
    {
      title: "Listening FAST",
      time: "Ajratilgan vaqt: 00:37:00",
      parts: ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6"],
      icon: Headphones,
      buttonText: "Listening",
      route: "/test/listening",
      badge: "Demo Version",
      color: "purple",
    },
    {
      title: "Reading Demo Test",
      time: "Ajratilgan vaqt: 01:00:00",
      parts: ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5"],
      icon: BookOpen,
      buttonText: "Reading",
      route: "/test/reading",
      color: "green",
    },
    {
      title: "Writing Demo Test",
      time: "Ajratilgan vaqt: 01:00:00",
      parts: ["Task 1.1", "Task 1.2", "Task 2"],
      icon: Pencil,
      buttonText: "Writing",
      route: "/test/writing",
      color: "orange",
    },
    {
      title: "Speaking FAST",
      time: "Ajratilgan vaqt: 00:15:00",
      parts: ["Part 1.1", "Part 1.2", "Part 2", "Part 3"],
      icon: Mic,
      buttonText: "Speaking",
      route: "/test/speaking",
      badge: "FAST",
      color: "red",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* LEFT */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            {/* CENTER */}
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">
                CEFR Practice Test
              </p>
              <p className="hidden sm:block text-xs text-gray-500">
                Computer-based exam format
              </p>
            </div>

            {/* RIGHT (spacer for symmetry) */}
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* ================= INTRO ================= */}
      <section className="mx-auto max-w-4xl px-4 pt-10 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Choose a skill to practice
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Practice individual CEFR skills in computer-based exam format
        </p>
      </section>

      {/* ================= CARDS ================= */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
          "
        >
          {skills.map((skill) => (
            <SkillCard
              key={skill.title}
              {...skill}
              onClick={() => router.push(skill.route)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
