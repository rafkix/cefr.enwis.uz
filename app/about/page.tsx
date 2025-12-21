"use client"

import { Target, Users, BookOpen, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "CEFR Standardization",
      description:
        "Assessment system fully aligned with international CEFR descriptors from A1 to C1.",
    },
    {
      icon: Users,
      title: "Equal Access",
      description:
        "Designed for learners across all regions of Uzbekistan with fair and transparent evaluation.",
    },
    {
      icon: BookOpen,
      title: "Academic Accuracy",
      description:
        "Exam tasks based on real exam formats and modern language assessment methodologies.",
    },
    {
      icon: TrendingUp,
      title: "Performance Growth",
      description:
        "Detailed feedback and scoring to help candidates identify strengths and weaknesses.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* MISSION */}
      <section className="py-20">
        <div className="container mx-auto grid items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Our Mission
            </h2>

            <p className="mb-4 text-gray-700 leading-relaxed">
              The Uzbekistan CEFR Multi-Level Exam was developed to provide a
              transparent, fair, and standardized English proficiency
              assessment system for students, educators, and institutions
              across the country.
            </p>

            <p className="mb-4 text-gray-700 leading-relaxed">
              Our mission is to bridge the gap between traditional language
              learning and real exam requirements by offering a modern,
              computer-based testing environment aligned with CEFR standards.
            </p>

            <p className="text-gray-700 leading-relaxed">
              The platform evaluates all four core language skills —
              Listening, Reading, Writing, and Speaking — ensuring objective
              scoring and reliable results.
            </p>
          </div>

          {/* VISUAL BLOCK */}
          <div className="flex justify-center">
            <div className="relative h-96 w-96 rounded-3xl bg-red-50">
              <div className="absolute inset-6 rounded-2xl bg-white shadow-xl" />
              <div className="absolute inset-12 rounded-xl bg-red-100/60 backdrop-blur" />
            </div>
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Why CEFR Multi-Level?
          </h2>

          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            The multi-level exam system allows candidates to be assessed
            accurately based on their true language ability, eliminating
            guesswork and providing clear level classification with
            professional feedback.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-14 text-center text-3xl font-bold text-gray-900">
            Our Core Values
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <value.icon className="h-8 w-8 text-red-600" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {value.title}
                </h3>

                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
