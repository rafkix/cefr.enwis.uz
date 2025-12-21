<<<<<<< HEAD
import { NextResponse } from "next/server"
import OpenAI from "openai"

/* ================= TYPES ================= */

type WritingTaskInput = {
  part: string
  instruction: string
  prompt: string
  minWords: number
  maxWords: number
  answer: string
}

type WritingTaskResult = {
  part: string
  wordCount: number
  band: number
  cefr: string

  criteria: {
    content: { score: number; comment: string }
    coherence: { score: number; comment: string }
    grammar: { score: number; comment: string }
    vocabulary: { score: number; comment: string }
  }

  strengths: string[]
  weaknesses: string[]
  corrections: {
    original: string
    corrected: string
    type: string
  }[]

  summary: string
  correctedText: string
  description: string // <-- band description qo‘shildi
}

/* ================= BAND DESCRIPTIONS ================= */

const BAND_DESCRIPTIONS: Record<string, Record<number, string>> = {
  part1: {
    5: "(B2 or above) Performance is likely to be above B1 level.",
    4: "(Higher B1) Response is on topic and shows the following features:\n• Register may not be consistently appropriate\n• Good control of simple grammatical structures, errors occur when attempting complex structures\n• Punctuation and spelling are mostly accurate; errors do not cause misunderstanding\n• Vocabulary is sufficient to respond to the task.\n• Uses simple cohesive devices to organize the response as a linear sequence of sentences.",
    3: "(Lower B1) Response is partially on topic and shows the following features:\n• Register may not be consistently appropriate\n• Good control of simple grammatical structures, errors occur when attempting complex structures\n• Punctuation and spelling are mostly accurate; errors do not cause misunderstanding\n• Vocabulary is sufficient to respond to the task.\n• Uses simple cohesive devices to organize the response as a linear sequence of sentences.",
    2: "(A2) Response may be partially on topic and shows the following features:\n• Uses simple grammatical structures to produce writing at the sentence level. Errors with simple structures are common and sometimes impede understanding.\n• Punctuation and spelling mistakes are noticeable.\n• Vocabulary is not sufficient to respond to the task. Inappropriate lexical choices are noticeable and sometimes impede understanding.\n• Response may not be organized as a cohesive text.",
    1: "(A1 or lower) Performance is below A2, or substantial use of L1, or no meaningful language, or the response is completely off-topic.",
    0: "No attempt (answer sheet is blank)",
  },
  part2: {
    6: "(C2) Performance is likely to be above C1 level.",
    5: "(C1) Response shows the following features:\n• Fully addresses the question with clear stance and relevant arguments\n• A range of complex grammar constructions is used accurately. Some minor errors occur, but do not impede understanding.\n• A range of vocabulary is used to discuss the topics required by the task. Some awkward usage or slightly inappropriate lexical choices.\n• Well-structured post or article with clear paragraphs; smooth flow of ideas and use of linking expressions.",
    4: "(Higher B2) Response shows the following features:\n• Addresses the question clearly with minor digressions; stance is evident.\n• Some complex grammar constructions are used accurately. Errors do not lead to misunderstanding.\n• Minor errors in punctuation and spelling occur but do not impede understanding.\n• Sufficient range of vocabulary to discuss the topics required by the task. Inappropriate lexical choices do not lead to misunderstanding.\n• Clear structure with some use of connectors and logical flow.",
    3: "(Lower B2) Response shows the following features:\n• Mostly relevant but may lack clarity in stance or have minor off-topic parts.\n• Some complex grammar constructions are used accurately. Errors do not lead to misunderstanding.\n• Minor errors in punctuation and spelling occur but do not impede understanding.\n• Sufficient range of vocabulary to discuss the topics required by the task. Inappropriate lexical choices do not lead to misunderstanding.\n• Some organization; transitions may be unclear or mechanical.",
    2: "(B1) Response shows the following features:\n• Mostly relevant but may lack clarity in stance or have minor off-topic parts.\n• Good control of simple grammatical structures, errors occur when attempting complex structures\n• Punctuation and spelling are mostly accurate; errors do not cause misunderstanding\n• Inappropriate lexical choices may sometimes lead to misunderstanding.\n• Uses simple cohesive devices to organize the response as a linear sequence of sentences.",
    1: "(A2) Response shows the following features:\n• Limited focus on task; ideas may be unclear or partly off-topic.\n• Uses simple grammatical structures to produce writing at the sentence level. Errors with simple structures are common and sometimes impede understanding.\n• Punctuation and spelling mistakes are noticeable.\n• Vocabulary is not sufficient to respond to the task. Inappropriate lexical choices are noticeable and sometimes impede understanding.\n• Response may not be organized as a cohesive text.",
    0: "No meaningful language, or substantial use of L1, or the response is completely off-topic, or no attempt (answer sheet is blank)",
  }
}

function getBandDescription(part: string, band: number) {
  if (BAND_DESCRIPTIONS[part] && BAND_DESCRIPTIONS[part][band] !== undefined) {
    return BAND_DESCRIPTIONS[part][band]
  }
  return "No description available"
}

/* ================= OPENAI ================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

/* ================= HELPERS ================= */

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function bandToCEFR(band: number): string {
  if (band >= 7.5) return "C1"
  if (band >= 6.0) return "B2"
  if (band >= 5.0) return "B1"
  if (band >= 4.0) return "A2"
  return "A1"
}

/* ================= ROUTE ================= */

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const tasks: WritingTaskInput[] = body.tasks

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { overallBand: 0, overallCEFR: "N/A", tasks: [] },
=======
import OpenAI from "openai"

export const runtime = "nodejs"

type TaskInput = {
  part: "1.1" | "1.2" | "2"
  question: string
  answer: string
}

/* =========================
   CEFR MAPPING
========================= */
function mapBandToCEFR(part: string, band: number) {
  if (part === "1.1") {
    if (band >= 5) return "B2"
    if (band >= 4) return "B1+"
    if (band >= 3) return "B1"
    if (band >= 2) return "A2"
    return "A1"
  }

  if (part === "1.2" || part === "2") {
    if (band >= 6) return "C1"
    if (band >= 5) return "B2+"
    if (band >= 4) return "B2"
    if (band >= 3) return "B1"
    return "A2"
  }

  return "Unknown"
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY missing" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { tasks } = (await req.json()) as { tasks: TaskInput[] }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return Response.json(
        { error: "Tasks array required" },
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
        { status: 400 }
      )
    }

<<<<<<< HEAD
    const taskResults: WritingTaskResult[] = []

    for (const task of tasks) {
      const wordCount = countWords(task.answer || "")

      const prompt = `
You are a professional CEFR writing examiner.

TASK:
${task.instruction}
${task.prompt}

USER ANSWER:
${task.answer}

Evaluate strictly using CEFR writing criteria.

Return ONLY valid JSON in this format:

{
  "band": number,
  "criteria": {
    "content": { "score": number, "comment": string },
    "coherence": { "score": number, "comment": string },
    "grammar": { "score": number, "comment": string },
    "vocabulary": { "score": number, "comment": string }
  },
  "strengths": string[],
  "weaknesses": string[],
  "corrections": [
    {
      "original": string,
      "corrected": string,
      "type": "grammar | vocabulary | spelling"
    }
  ],
  "summary": string,
  "correctedText": string
=======
    const results = []
    

    for (const task of tasks) {
      if (!task.answer?.trim()) {
        return Response.json(
          { error: `Answer missing for part ${task.part}` },
          { status: 400 }
        )
      }

      const wordCount = task.answer.trim().split(/\s+/).length
      const maxBand = task.part === "1.1" ? 5 : 6

      const prompt = `
You are an official CEFR / IELTS Writing Examiner.

TASK PART: ${task.part}
QUESTION:
${task.question}

CANDIDATE RESPONSE:
${task.answer}

WORD COUNT: ${wordCount}

SCORING RULES:
- Band must be between 0 and ${maxBand}
- Use .5 increments if appropriate
- Be strict and professional

RETURN STRICT JSON ONLY:
{
  "band": number,
  "criteria": {
    "task": { "score": number, "comment": "..." },
    "coherence": { "score": number, "comment": "..." },
    "lexical": { "score": number, "comment": "..." },
    "grammar": { "score": number, "comment": "..." }
  },
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "summary": "2–3 sentence examiner report"
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
}
`

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
<<<<<<< HEAD
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      })

      let parsed: any = {}
      try {
        parsed = JSON.parse(completion.choices[0].message.content || "{}")
      } catch {
        parsed = {}
      }

      const band = typeof parsed.band === "number" ? parsed.band : 5.0

      taskResults.push({
        part: task.part,
        wordCount,
        band,
        cefr: bandToCEFR(band),
        criteria: parsed.criteria ?? {
          content: { score: 5, comment: "" },
          coherence: { score: 5, comment: "" },
          grammar: { score: 5, comment: "" },
          vocabulary: { score: 5, comment: "" },
        },
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
        summary: parsed.summary || "",
        correctedText: parsed.correctedText || "",
        description: getBandDescription(
          task.part === "2" ? "part2" : "part1",
          Math.round(band)
        ),
      })
    }

    const overallBand = Number(
      (taskResults.reduce((s, t) => s + t.band, 0) / taskResults.length).toFixed(1)
    )

    return NextResponse.json({
      overallBand,
      overallCEFR: bandToCEFR(overallBand),
      tasks: taskResults,
    })
  } catch (error) {
    console.error("EVALUATE WRITING ERROR:", error)

    return NextResponse.json(
      {
        overallBand: 0,
        overallCEFR: "N/A",
        tasks: [],
        error: "AI evaluation failed",
      },
=======
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      })

      const text = completion.choices[0].message.content || ""

      let parsed: any
      try {
        parsed = JSON.parse(text)
      } catch {
        console.error("AI RAW:", text)
        return Response.json(
          { error: "Invalid AI response" },
          { status: 500 }
        )
      }

      const cefrLevel = mapBandToCEFR(task.part, parsed.band)

      results.push({
        part: task.part,
        band: parsed.band,
        cefrLevel,
        criteria: parsed.criteria,
        strengths: parsed.strengths,
        improvements: parsed.improvements,
        summary: parsed.summary,
      })
    }

    const cefrOrder = ["A1", "A2", "B1", "B2", "B2+", "C1"]
    const overallCEFR =
      results
        .map(r => r.cefrLevel)
        .sort(
          (a, b) => cefrOrder.indexOf(a) - cefrOrder.indexOf(b)
        )
        .at(-1) || "Unknown"

    return Response.json({
      overallCEFR,
      results,
    })
  } catch (err) {
    console.error("EVALUATION ERROR:", err)
    return Response.json(
      { error: "Internal server error" },
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
      { status: 500 }
    )
  }
}
