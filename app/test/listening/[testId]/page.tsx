"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Volume2, Play, Pause, Timer, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { listeningTests } from "@/lib/exams/listening/data"
import { calculateListeningScore } from "@/lib/exams/listening/scoring"

type TestStatus = "preparing" | "reading" | "playing" | "finished"

export default function ListeningTestPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.testId as string

  const [test] = useState(listeningTests.find((t) => t.id === testId))
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [status, setStatus] = useState<TestStatus>("preparing")
  const [countdown, setCountdown] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentPart = test?.parts[currentPartIndex]
  const [progress, setProgress] = useState(0)

  // ================= MANTIQIY FUNKSIYALAR =================

  const startNextPart = (index: number) => {
    setCurrentPartIndex(index)
    setStatus("reading")
    setCountdown(10) // Savollarni o‘qish uchun 10 soniya
    setIsPlaying(false)
    setProgress(0)
  }

  const startAudio = () => {
    setStatus("playing")
    setIsPlaying(true)

    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.load()

      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Autoplay blocked:", error)
          setIsPlaying(false)
        })
      }
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
    setProgress(100)

    if (test && currentPartIndex < test.parts.length - 1) {
      startNextPart(currentPartIndex + 1)
    } else {
      setStatus("finished")
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!test) return

    const results = calculateListeningScore(test, answers)

    const query = new URLSearchParams({
      correct: results.correct.toString(),
      total: results.total.toString(),
      detailed: JSON.stringify(results.detailed),
    }).toString()

    router.push(`/test/listening/${testId}/result?${query}`)
  }

  // ================= TAYMER MANTIQI (BUG FIX QILINGAN) =================
  // ❌ setInterval YO‘Q
  // ✅ setTimeout (1 martalik)

  useEffect(() => {
    if (countdown <= 0) {
      if (status === "preparing") {
        startNextPart(0)
      }

      if (status === "reading") {
        startAudio()
      }

      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, status])

  // ================= SAFE GUARD =================

  if (!test || !currentPart) {
    return <div className="p-10 text-center">Loading...</div>
  }

  return (

  <div className="flex h-screen flex-col bg-white">
    {/* HEADER */}
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:bg-purple-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Exit
        </Button>
        <Badge className="bg-purple-100 text-purple-700 border-none">
          CEFR Listening
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border bg-purple-50 border-purple-200 text-purple-700">
          {status === "preparing" && <Timer className="h-4 w-4 animate-spin" />}
          {status === "playing" && <Headphones className="h-4 w-4 animate-pulse" />}
          <span className="font-mono font-bold text-lg">
            {status === "playing"
              ? "Audio Playing"
              : `00:${countdown.toString().padStart(2, "0")}`}
          </span>
        </div>
      </div>

      <Button
        onClick={() => {
          // 🔧 FIX 1: test tugaganda audio o‘chadi
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
          handleSubmit()
        }}
        variant="outline"
        className="text-purple-600 hover:bg-purple-100"
      >
        Finish Test
      </Button>
    </header>

    {/* MAIN CONTENT */}
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel */}
      <div className="w-1/2 overflow-y-auto border-r bg-slate-50 p-8">
        {status === "preparing" ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-purple-100">
              <Timer className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-bounce" />
              <h1 className="text-2xl font-bold mb-2">Get Ready!</h1>
              <p className="text-gray-500 mb-6">
                The listening test will begin in {countdown} seconds.
              </p>
              <Button
                onClick={() => setCountdown(0)}
                className="bg-purple-600"
              >
                Start Now
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-600 h-7 px-4">
                Part {currentPart.partNumber}
              </Badge>
              {status === "reading" && (
                <span className="text-sm font-medium text-purple-600 animate-pulse">
                  Read questions carefully...
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {currentPart.title}
            </h2>

            <Card className="p-6 border-orange-100 shadow-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-purple-600">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Volume2 className="h-6 w-6" />
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    status === "playing"
                      ? "border-purple-500 text-purple-600 animate-pulse"
                      : "text-slate-400"
                  }
                >
                  {status === "playing"
                    ? "Audio is playing..."
                    : "Waiting to start"}
                </Badge>
              </div>

              <p className="text-slate-600 mb-6 text-sm italic leading-relaxed">
                {currentPart.instruction}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <audio
                  ref={audioRef}
                  key={currentPartIndex}
                  src={currentPart.audioUrl || currentPart.audioLabel}
                  onEnded={handleAudioEnd}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={(e) => {
                    const { currentTime, duration } = e.currentTarget

                    // 🔧 FIX 2: duration 0 bo‘lsa NaN bo‘lmasligi uchun
                    if (duration > 0) {
                      setProgress((currentTime / duration) * 100)
                    }
                  }}
                  className="hidden"
                />

                <div className="flex items-center gap-4 w-full">
                  {isPlaying && (
                    <div className="flex gap-1 h-6 items-end shrink-0">
                      <div className="w-1 bg-purple-500 animate-bounce [animation-duration:0.5s]" />
                      <div className="w-1 bg-purple-500 animate-bounce [animation-duration:0.8s]" />
                      <div className="w-1 bg-purple-500 animate-bounce [animation-duration:0.6s]" />
                      <div className="w-1 bg-purple-500 animate-bounce [animation-duration:0.4s]" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-purple-600 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">
                        {isPlaying ? "Live Audio" : "Waiting..."}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {currentPart.mapImage && (
              <Card className="overflow-hidden border-2 border-purple-50">
                <img
                  src={currentPart.mapImage}
                  alt="Visual Context"
                  className="w-full"
                />
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-1/2 overflow-y-auto p-8 bg-white">
        {status !== "preparing" ? (
          <div className="space-y-8 pb-20">
            <h3 className="text-xl font-bold border-b pb-4 text-slate-800">
              Answer Sheet
            </h3>

            {currentPart.questions.map((q) => (
              <div key={q.questionNumber} className="relative group flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                  {q.questionNumber}
                </span>

                <div className="flex-1 space-y-4">
                  <p className="font-medium text-slate-800">{q.question}</p>

                  {q.type === "multiple-choice" ? (
                    <RadioGroup
                      onValueChange={(val) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.questionNumber]: val,
                        }))
                      }
                      className="grid grid-cols-1 gap-2"
                    >
                      {q.options?.map((opt, i) => (
                    <Label
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl border hover:bg-purple-50 cursor-pointer"
                    >
                        <RadioGroupItem value={opt.value} />
                        <span>{opt.label}</span>
                    </Label>
                    ))}

                    </RadioGroup>
                  ) : (
                    <Input
                      placeholder="Type your answer here..."
                      className="focus:ring-purple-500"
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.questionNumber]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 italic">
            Questions will appear here...
          </div>
        )}
      </div>
    </div>
  </div>
)

}