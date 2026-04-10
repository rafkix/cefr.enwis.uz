// import Link from "next/link";
// import {
//     ArrowRight,
//     CheckCircle2,
//     Globe2,
//     GraduationCap,
//     Languages,
//     LineChart,
//     PenSquare,
//     Zap,
//     Users,
//     Trophy,
//     PlayCircle,
//     Monitor,
//     Smartphone,
//     Laptop,
// } from "lucide-react";
// import type { Dictionary } from "@/lib/i18n/dictionaries";
// import type { Locale } from "@/lib/i18n/locales";
// import { siteConfig } from "@/lib/config/site";

// type LandingPageProps = {
//     locale: Locale;
//     dict: Dictionary;
// };

// /**
//  * 🛠 GLOBAL RESPONSIVE CONTAINER
//  * Bu klass kontentni markazda ushlaydi va barcha qurilmalarda 
//  * o'ng va chapdan xavfsiz masofa (padding) qoldiradi.
//  */
// const CONTAINER_CLASS = "max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 2xl:px-0";

// export function LandingPage({ locale, dict }: LandingPageProps) {
//     return (
//         <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#109988]/20 overflow-x-hidden">
//             <HeroSection locale={locale} dict={dict} />
//             <StatsSection />
//             <TracksSection locale={locale} dict={dict} />
//             <ExperienceSection />
//             <ProcessSection />
//             <PlatformSection dict={dict} />
//             <BenefitsSection dict={dict} />
//             <FAQSection dict={dict} />
//             <FinalCTASection locale={locale} />
//         </main>
//     );
// }

// // --- 1. HERO SECTION (TV va Monitorlar uchun optimallashgan) ---
// function HeroSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
//     return (
//         <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
//             {/* Soft Background Decor */}
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(16,153,136,0.15),transparent_70%)] -z-10" />

//             <div className={CONTAINER_CLASS}>
//                 <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
//                     <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 backdrop-blur-sm px-5 py-2 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#0d7f72] mb-8 shadow-sm">
//                         <GraduationCap size={16} className="animate-bounce" />
//                         {dict.hero.badge}
//                     </div>

//                     <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[90px] xl:text-[110px] font-[1000] tracking-[-0.04em] leading-[0.9] text-slate-950">
//                         {dict.hero.title} <span className="text-[#109988]">.</span>
//                     </h1>

//                     <p className="mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl">
//                         {dict.hero.description}
//                     </p>

//                     <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//                         <a href={`${siteConfig.authUrl}?lang=${locale}`}
//                             className="h-16 px-12 inline-flex items-center justify-center rounded-full bg-[#109988] text-white font-black text-lg hover:bg-[#0d7f72] transition-all hover:scale-105 shadow-[0_20px_40px_-12px_rgba(16,153,136,0.4)] active:scale-95">
//                             {dict.hero.primaryCta}
//                             <ArrowRight className="ml-2 w-5 h-5" />
//                         </a>
//                         <Link href="#tracks"
//                             className="h-16 px-12 inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-900 font-black text-lg hover:border-[#109988] hover:text-[#109988] transition-all">
//                             {dict.hero.secondaryCta}
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 2. STATS SECTION (Contrast oshirildi) ---
// function StatsSection() {
//     return (
//         <section className="py-12 bg-white border-y border-slate-100 shadow-sm">
//             <div className={CONTAINER_CLASS}>
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
//                     {[
//                         { label: "Mock Tests", value: "500+", icon: <PenSquare /> },
//                         { label: "Students", value: "12k+", icon: <Users /> },
//                         { label: "IELTS 8.0+", value: "1.2k", icon: <Trophy /> },
//                         { label: "AI Response", value: "Instant", icon: <Zap /> },
//                     ].map((s, i) => (
//                         <div key={i} className="flex items-center gap-5 group">
//                             <div className="p-4 rounded-2xl bg-[#ecfffd] text-[#109988] group-hover:scale-110 transition-transform">
//                                 {s.icon}
//                             </div>
//                             <div>
//                                 <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{s.value}</div>
//                                 <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 3. TRACKS SECTION (Grid optimallashgan) ---
// function TracksSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
//     return (
//         <section id="tracks" className="py-24 bg-[#f8fafc]">
//             <div className={CONTAINER_CLASS}>
//                 <div className="flex flex-col lg:flex-row gap-16 items-start">
//                     <div className="lg:w-1/3 lg:sticky lg:top-24">
//                         <span className="text-[#109988] font-black text-xs uppercase tracking-[0.3em]">{dict.tracks.eyebrow}</span>
//                         <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mt-4 leading-tight italic">
//                             Choose your <br className="hidden lg:block" /> destiny.
//                         </h2>
//                         <p className="text-slate-600 mt-6 text-lg leading-relaxed">{dict.tracks.description}</p>
//                     </div>

//                     <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6 w-full">
//                         {['ielts', 'cefr', 'dtm', 'writing'].map((track) => (
//                             <Link key={track} href={`/${locale}/${track}`}
//                                 className="group p-10 rounded-[40px] bg-white border border-slate-100 hover:border-[#109988]/30 transition-all hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
//                                 <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#109988] group-hover:text-white transition-all mb-8">
//                                     <Zap size={24} />
//                                 </div>
//                                 <div className="text-4xl font-black text-slate-900 mb-2">{track.toUpperCase()}</div>
//                                 <p className="text-slate-500 text-sm leading-relaxed mb-8">Professional mock environment with advanced AI scoring system.</p>
//                                 <div className="flex items-center text-[#109988] font-black text-sm">
//                                     Open Track <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 4. EXPERIENCE (Dark Premium Block) ---
// function ExperienceSection() {
//     return (
//         <section className="py-12 md:py-24">
//             <div className={CONTAINER_CLASS}>
//                 <div className="bg-slate-950 rounded-[48px] md:rounded-[64px] p-8 md:p-20 text-white relative overflow-hidden">
//                     <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#10998833,transparent_50%)]" />
//                     <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
//                         <div>
//                             <h2 className="text-4xl md:text-6xl font-black leading-[1.05] mb-10">Real exam atmosphere. <br /> Anywhere.</h2>
//                             <div className="grid gap-6">
//                                 {[
//                                     { t: "Live Proctoring", d: "Feel the real-time exam pressure." },
//                                     { t: "AI Speaking Hub", d: "Practice speaking with our advanced AI." },
//                                     { t: "Writing Analytics", d: "Get instant grammar and coherence scores." }
//                                 ].map((item, i) => (
//                                     <div key={i} className="flex gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
//                                         <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#109988] flex items-center justify-center">
//                                             <CheckCircle2 size={24} />
//                                         </div>
//                                         <div>
//                                             <h4 className="font-black text-xl">{item.t}</h4>
//                                             <p className="text-slate-400 text-sm mt-1">{item.d}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="relative group cursor-pointer">
//                             <div className="aspect-video bg-gradient-to-br from-[#109988] to-teal-900 rounded-[40px] flex items-center justify-center shadow-2xl overflow-hidden">
//                                 <PlayCircle size={80} className="text-white opacity-80 group-hover:scale-110 transition-transform" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 5. PROCESS SECTION (Qanday ishlaydi) ---
// function ProcessSection() {
//     return (
//         <section className="py-24 bg-white border-y border-slate-100">
//             <div className={CONTAINER_CLASS}>
//                 <div className="text-center mb-20">
//                     <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter italic">How it works</h2>
//                 </div>
//                 <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
//                     {[
//                         { title: "Register", desc: "Select your language and create a profile in 30 seconds." },
//                         { title: "Start Test", desc: "Access the most accurate mock exams on the market." },
//                         { title: "Improve", desc: "Receive AI-generated feedback and double your score." }
//                     ].map((step, i) => (
//                         <div key={i} className="relative group">
//                             <div className="text-[120px] font-black text-slate-50 absolute -top-20 left-0 -z-10 select-none group-hover:text-teal-50 transition-colors">
//                                 0{i + 1}
//                             </div>
//                             <div className="pt-10">
//                                 <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
//                                 <p className="text-slate-600 leading-relaxed text-lg">{step.desc}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 6. PLATFORM SECTION ---
// function PlatformSection({ dict }: { dict: Dictionary }) {
//     const items = [
//         { icon: <Languages size={24} />, title: dict.features.items[0].title, text: dict.features.items[0].description },
//         { icon: <LineChart size={24} />, title: dict.features.items[1].title, text: dict.features.items[1].description },
//         { icon: <PenSquare size={24} />, title: dict.features.items[2].title, text: dict.features.items[2].description },
//     ];

//     return (
//         <section id="features" className="py-24 lg:py-32 bg-[#f8fafc]">
//             <div className={CONTAINER_CLASS}>
//                 <div className="grid md:grid-cols-3 gap-8">
//                     {items.map((item, i) => (
//                         <div key={i} className="p-12 rounded-[48px] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-teal-900/5 transition-all">
//                             <div className="w-16 h-16 bg-[#ecfffd] text-[#109988] rounded-2xl flex items-center justify-center mb-10">
//                                 {item.icon}
//                             </div>
//                             <h3 className="text-2xl font-[1000] text-slate-950 mb-4 tracking-tight">{item.title}</h3>
//                             <p className="text-slate-600 leading-relaxed text-lg">{item.text}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 7. BENEFITS SECTION ---
// function BenefitsSection({ dict }: { dict: Dictionary }) {
//     return (
//         <section className="py-24 lg:py-32">
//             <div className={CONTAINER_CLASS}>
//                 <div className="grid lg:grid-cols-2 gap-20 items-center">
//                     <div>
//                         <span className="text-[#109988] font-black text-xs uppercase tracking-[0.3em]">{dict.benefits.eyebrow}</span>
//                         <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mt-6 leading-tight italic">{dict.benefits.title}</h2>
//                         <p className="mt-8 text-xl text-slate-600 leading-relaxed">{dict.benefits.description}</p>
//                     </div>
//                     <div className="grid gap-5">
//                         {dict.benefits.items.map((item, i) => (
//                             <div key={i} className="p-8 bg-white border border-slate-100 rounded-[32px] flex items-center gap-8 shadow-sm hover:scale-[1.02] transition-transform group">
//                                 <span className="text-3xl font-black text-teal-100 group-hover:text-[#109988] transition-colors">0{i + 1}</span>
//                                 <span className="text-xl font-bold text-slate-800">{item}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 8. FAQ SECTION ---
// function FAQSection({ dict }: { dict: Dictionary }) {
//     return (
//         <section id="faq" className="py-24 bg-white border-t border-slate-100">
//             <div className={CONTAINER_CLASS}>
//                 <div className="text-center mb-20">
//                     <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter italic">{dict.faq.title}</h2>
//                 </div>
//                 <div className="max-w-4xl mx-auto space-y-6">
//                     {dict.faq.items.map((item, i) => (
//                         <div key={i} className="p-10 bg-[#f8fafc] rounded-[40px] border border-slate-50 hover:border-teal-100 transition-colors">
//                             <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.question}</h3>
//                             <p className="text-slate-600 leading-relaxed text-lg">{item.answer}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// // --- 9. FINAL CTA (Super Large) ---
// function FinalCTASection({ locale }: { locale: string }) {
//     return (
//         <section className="py-24 lg:pb-40">
//             <div className={CONTAINER_CLASS}>
//                 <div className="bg-[#109988] rounded-[60px] md:rounded-[80px] p-12 md:p-32 text-center text-white relative shadow-2xl shadow-teal-900/30 overflow-hidden">
//                     {/* Decorative TV Icon for Big Screens */}
//                     <Monitor size={400} className="absolute -bottom-20 -right-20 opacity-5 -rotate-12 pointer-events-none" />

//                     <div className="relative z-10">
//                         <h2 className="text-4xl md:text-7xl lg:text-8xl font-[1000] tracking-tighter leading-none mb-10">
//                             The future of exams <br className="hidden md:block" /> starts now.
//                         </h2>
//                         <p className="mt-8 text-teal-50 text-xl md:text-2xl max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
//                             Don't study harder, study smarter. Join thousands of successful students today.
//                         </p>
//                         <div className="mt-16">
//                             <a href={`${siteConfig.authUrl}?lang=${locale}`}
//                                 className="h-20 px-16 inline-flex items-center justify-center rounded-full bg-white text-[#109988] font-black text-xl hover:scale-105 hover:shadow-2xl transition-all active:scale-95">
//                                 Create Free Account
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

"use client"

import { useEffect } from "react"

export default function DashboardRoot() {
    useEffect(() => {
        window.location.href = "https://auth.enwis.uz/auth"
    }, [])

    return null
}