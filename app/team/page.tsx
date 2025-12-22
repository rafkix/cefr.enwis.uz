"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Linkedin, Twitter, Sparkles, Quote } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TeamPage() {
  const team = [
    {
      name: "Diyorbek Abdumutalib",
      role: "Founder & CEO",
      bio: "Education and technology enthusiast. Leads the vision, strategy, and long-term development of ENWIS AI to revolutionize CEFR testing in Uzbekistan.",
      img: "/team/diyorbek.jpg", // Ensure this path is correct in your public folder
      linkedin: "#",
      twitter: "#",
    },
    // You can add more members here later
  ]

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-red-100">
      <Navbar />

      <main className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#fee2e2_20%,transparent_60%)] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700">The Minds Behind Enwis</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]"
            >
              Building the future of <br />
              <span className="text-red-600 italic">language assessment.</span>
            </motion.h1>
            <p className="text-xl text-slate-500 font-medium">
              We are a dedicated team committed to creating a modern, reliable, and fair 
              CEFR-based exam ecosystem for the next generation of learners in Uzbekistan.
            </p>
          </div>

          {/* Featured Member / Founder Spotlight */}
          <div className="grid gap-16">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-white border border-slate-100 rounded-[64px] p-8 md:p-16 shadow-2xl shadow-slate-200/50 overflow-hidden group"
              >
                {/* Decorative Quote Icon */}
                <Quote className="absolute top-12 right-12 w-32 h-32 text-slate-50 opacity-10" />

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
                  {/* Profile Image Container */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80 shrink-0">
                    <div className="absolute inset-0 bg-red-600 rounded-[48px] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                    <div className="relative w-full h-full overflow-hidden rounded-[48px] border-4 border-white shadow-xl bg-slate-100">
                      {member.img ? (
                        <Image
                          src={member.img}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-7xl font-black text-red-200">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Content */}
                  <div className="flex-grow text-center lg:text-left">
                    <div className="mb-6">
                      <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        {member.name}
                      </h3>
                      <p className="text-red-600 font-black uppercase text-sm tracking-[0.2em]">
                        {member.role}
                      </p>
                    </div>

                    <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-8 italic">
                      "{member.bio}"
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <a href={member.linkedin} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                        <Linkedin size={20} />
                      </a>
                      <a href={member.twitter} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                        <Twitter size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action Footer */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="mt-24 p-12 rounded-[48px] bg-slate-900 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#dc2626,transparent)] opacity-20" />
            <h2 className="text-3xl md:text-4xl font-black text-white relative z-10 mb-4 tracking-tight">
              Want to join our mission?
            </h2>
            <p className="text-slate-400 font-medium mb-8 relative z-10">
              We're always looking for passionate educators and developers.
            </p>
            <button className="relative z-10 px-8 py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20">
              View Careers
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}