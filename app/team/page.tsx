"use client"

import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TeamPage() {
  const team = [
    {
      name: "Diyorbek Abdumutalib",
      role: "Founder & CEO",
      bio: "Education and technology enthusiast. Leads the vision, strategy, and long-term development of Enwis.",
      img: "/team/diyorbek.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="py-24">
        <div className="container mx-auto px-6">
          {/* HEADER */}
          <h1 className="mb-6 text-center text-5xl font-bold text-gray-900">
            Meet Our Team
          </h1>

          <p className="mx-auto mb-20 max-w-3xl text-center text-xl text-gray-600">
            A dedicated team building a modern, reliable, and fair CEFR-based
            exam platform for Uzbekistan.
          </p>

          {/* TEAM GRID */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* IMAGE */}
                <div className="relative mx-auto mb-6 h-36 w-36 overflow-hidden rounded-full bg-red-50">
                  {member.img ? (
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-red-500">
                      {member.name.charAt(0)}
                    </div>
                  )}

                  {/* subtle ring */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-red-100" />
                </div>

                {/* TEXT */}
                <h3 className="mb-1 text-xl font-bold text-gray-900">
                  {member.name}
                </h3>

                <p className="mb-4 font-semibold text-red-600">
                  {member.role}
                </p>

                <p className="text-gray-600 leading-relaxed">
                  {member.bio}
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
