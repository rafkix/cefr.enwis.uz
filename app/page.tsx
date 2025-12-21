"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  ShieldCheck,
  Cpu,
  BarChart3,
} from "lucide-react"
import { HeroExamTile } from "@/components/windows-tile"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-full w-[1200px] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-70" />
          <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute left-[-120px] bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                CEFR Exam Platform
              </span>

              <h1 className="mt-8 text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight text-gray-900">
                Measure English
                <br />
                <span className="text-red-600">
                  with precision & confidence
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg text-gray-600">
                ENWIS is a computer-based, multi-level English assessment system
                designed to accurately determine CEFR proficiency using modern
                AI-driven evaluation.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  onClick={() => router.push("/test")}
                  className="h-11 bg-red-600 px-7 text-white hover:bg-red-700"
                >
                  Get CEFR result
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/about")}
                  className="h-11 border-red-600 px-7 text-red-600 hover:bg-red-50"
                >
                  Learn more
                </Button>
              </div>
            </div>

            {/* RIGHT – WINDOWS STYLE TILES */}
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 shadow-[0_60px_120px_rgba(0,0,0,0.12)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <HeroExamTile
                    icon={Headphones}
                    label="Listening"
                    desc="Audio comprehension"
                    color="linear-gradient(135deg,#6366f1,#4338ca)"
                    onClick={() => router.push("/test/listening")}
                  />
                  <HeroExamTile
                    icon={BookOpen}
                    label="Reading"
                    desc="Academic texts"
                    color="linear-gradient(135deg,#22c55e,#15803d)"
                    onClick={() => router.push("/test/reading")}
                  />
                  <HeroExamTile
                    icon={Pencil}
                    label="Writing"
                    desc="CEFR writing tasks"
                    color="linear-gradient(135deg,#fb923c,#ea580c)"
                    onClick={() => router.push("/test/writing")}
                  />
                  <HeroExamTile
                    icon={Mic}
                    label="Speaking"
                    desc="AI speaking exam"
                    color="linear-gradient(135deg,#ef4444,#b91c1c)"
                    onClick={() => router.push("/test/speaking")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="border-t bg-gray-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
            Trusted assessment principles
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, label: "Secure Exams" },
              { icon: Cpu, label: "AI Evaluation" },
              { icon: BarChart3, label: "Objective Scoring" },
              { icon: BookOpen, label: "CEFR Aligned" },
            ].map((i) => (
              <div key={i.label} className="rounded-xl bg-white p-6 shadow-sm">
                <i.icon className="mx-auto mb-3 h-6 w-6 text-red-600" />
                <p className="text-sm font-semibold text-gray-700">
                  {i.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold">
            How ENWIS works
          </h2>

          <div className="grid gap-10 md:grid-cols-3 text-center">
            {[
              "Choose a skill test",
              "Complete adaptive exam",
              "Receive CEFR profile",
            ].map((t, i) => (
              <div key={t}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white font-bold">
                  {i + 1}
                </div>
                <p className="font-semibold">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to know your real CEFR level?
          </h2>
          <p className="mt-4 text-gray-300">
            Start your assessment today and get an objective,
            skill-by-skill CEFR profile.
          </p>

          <Button
            onClick={() => router.push("/test")}
            className="mt-10 h-12 bg-red-600 px-10 text-white hover:bg-red-700"
          >
            Start assessment
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
