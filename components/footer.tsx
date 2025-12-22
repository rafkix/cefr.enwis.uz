"use client"

import Link from "next/link"
import { Instagram, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  // Faqatgina mavjud va eng muhim linklar
  const navigation = [
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "Team", href: "/team" },
  ]

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          {/* LEFT: BRAND & SLOGAN */}
          <div className="max-w-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-red-500/20 transition-transform hover:scale-110">
                E
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                ENWIS <span className="text-red-600">AI</span>
              </span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              Empowering English learners with AI-driven assessments. 
              Built for precision, designed for your success.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-red-600 hover:text-red-600 hover:-translate-y-1 transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: COMPACT LINKS & CONTACT */}
          <div className="flex flex-col sm:flex-row gap-16 md:gap-24">
            {/* Navigation */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Menu</h4>
              <ul className="space-y-4">
                {navigation.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-bold text-slate-900 hover:text-red-600 flex items-center group transition-colors">
                      {link.name}
                      <ArrowUpRight size={12} className="ml-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Support</h4>
              <div className="space-y-4">
                <a href="mailto:info@enwis.uz" className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-red-600 transition-colors">
                  <Mail size={16} /> info@enwis.uz
                </a>
                <p className="text-xs font-bold text-slate-500 max-w-[150px] leading-loose">
                  Tashkent, Uzbekistan <br />
                  IT Park, District 12
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            © {currentYear} ENWIS AI. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> AI Engine Live
            </span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              Top <span className="group-hover:-translate-y-1 transition-transform">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}