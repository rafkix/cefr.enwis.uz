// ================= TYPES =================

export interface Option {
  value: string
  label: string
}

export type QuestionType =
  | "multiple-choice"
  | "gap-fill"
  | "matching"
  | "map-labeling"

// ================= HELPERS =================

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

export function isCorrectAnswer(
  userAnswer: string,
  correctAnswer: string | string[],
  type: QuestionType
): boolean {
  if (type === "gap-fill") {
    const user = normalizeText(userAnswer)

    if (Array.isArray(correctAnswer)) {
      return correctAnswer.some(
        ans => normalizeText(ans) === user
      )
    }

    return normalizeText(correctAnswer) === user
  }

  // multiple-choice / matching / map-labeling
  return userAnswer === correctAnswer
}

// ================= INTERFACES =================

export interface ListeningQuestion {
  questionNumber: number
  type: QuestionType
  question?: string
  options?: Option[]
  correctAnswer: string | string[]
}

export interface ListeningPart {
  partNumber: number
  title: string
  instruction: string
  taskType: string
  context?: string
  audioLabel: string

  options?: Option[]       // ✅ matching / map-labeling
  questions: ListeningQuestion[]

  mapImage?: string
}

export interface ListeningTest {
  id: string
  title: string
  isDemo: boolean
  isFree: boolean
  sections: string
  level: string
  duration: number
  totalQuestions: number
  parts: ListeningPart[]
}

// ================= DATA =================

export const listeningTests: ListeningTest[] = [
  {
    id: "listening-demo-1",
    title: "Full Listening Test 1",
    isDemo: true,
    isFree: true,
    sections: "Sections: 1, 2, 3, 4, 5, 6",
    level: "MEDIUM Level",
    duration: 35,
    totalQuestions: 35,
    parts: [
      {
  partNumber: 1,
  title: "Part 1: Everyday Conversations",
  instruction:
    "You will hear some sentences. You will hear each sentence twice. Choose the correct reply to each sentence (A, B, or C).",
  taskType: "Multiple Choice",
  audioLabel: "https://image2url.com/audio/1766340672208-87c39a57-ed59-494d-8529-85bb597fea29.mp3",
  questions: [
    {
      questionNumber: 1,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "It's three o'clock." },
        { value: "B", label: "I think it's Dave's." },
        { value: "C", label: "I'm sorry I'm late." }
      ],
      correctAnswer: "B"
    },
    {
      questionNumber: 2,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "Yes, of course." },
        { value: "B", label: "Yes, it is" },
        { value: "C", label: "Yes, that's right." }
      ],
      correctAnswer: "A"
    },
    {
      questionNumber: 3,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "Not much" },
        { value: "B", label: "A few" },
        { value: "C", label: "A little" }
      ],
      correctAnswer: "B"
    },
    {
      questionNumber: 4,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "Not at all." },
        { value: "B", label: "Yes, please." },
        { value: "C", label: "Are you, really?" }
      ],
      correctAnswer: "C"
    },
    {
      questionNumber: 5,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "He's my brother." },
        { value: "B", label: "It's John's." },
        { value: "C", label: "I don't know it." }
      ],
      correctAnswer: "A"
    },
    {
      questionNumber: 6,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "He's at the station." },
        { value: "B", label: "He'll arrive tomorrow." },
        { value: "C", label: "He's going to leave tonight." }
      ],
      correctAnswer: "A"
    },
    {
      questionNumber: 7,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "So do I." },
        { value: "B", label: "Certainly" },
        { value: "C", label: "That's all right." }
      ],
      correctAnswer: "A"
    },
    {
      questionNumber: 8,
      type: "multiple-choice",
      question: "",
      options: [
        { value: "A", label: "About 500 kilometres." },
        { value: "B", label: "Almost 5 hours." },
        { value: "C", label: "Last week." }
      ],
      correctAnswer: "B"
    }
  ]
},

      {
        partNumber: 2,
        title: "Part 2: Form Completion",
        instruction:
          "You will hear someone giving a talk. For each question, fill in the missing information in the numbered space. Write ONE WORD and/or A NUMBER for each answer.",
        taskType: "Gap Fill",
        context: "Saturday music classes",
        audioLabel: "https://image2url.com/audio/1766342021335-e9c83fbd-164a-4419-81d4-2e1114410d3c.mp3",
        questions: [
          {
            questionNumber: 9,
            type: "gap-fill",
            question: "Classes available drums, ______________, guitar ",
            correctAnswer: "flute",
          },
          {
            questionNumber: 10,
            type: "gap-fill",
            question: "On arrival go to the ______________ your instrument",
            correctAnswer: "drama",
          },
          {
            questionNumber: 11,
            type: "gap-fill",
            question: "Costo £ ______________ room to pick up per class on",
            correctAnswer: "7.75",
          },
          {
            questionNumber: 12,
            type: "gap-fill",
            question: "______________ ",
            correctAnswer: "24 june",
          },
          {
            questionNumber: 13,
            type: "gap-fill",
            question: "End-of-term concert play alone or with the ______________ friends and family welcome",
            correctAnswer: "orchestra",
          },
          {
            questionNumber: 14,
            type: "gap-fill",
            question: "For more information contact music teacher on ______________",
            correctAnswer: "driscool",
          },
        ],
      },
      {
  partNumber: 3,
  title: "Part 3: Matching Speakers to Places",
  instruction:
    "You will hear people speaking in different situations. Match each speaker (15–19) to the correct option (A–H). There are extra options you do not need to use.",
  taskType: "Matching",
  audioLabel: "https://image2url.com/audio/1766342342442-134f1271-9af1-44a1-9869-7b564be3bcc8.mp3",

  options: [
    { value: "A", label: "He had a terrible life before becoming famous" },
    { value: "B", label: "He is a nicer person than he appears to be" },
    { value: "C", label: "He is exactly the same in private as he is in public" },
    { value: "D", label: "He would have preferred a different career" },
    { value: "E", label: "He has a sad personal life" },
    { value: "F", label: "He feels that he is a very important person" },
    { value: "G", label: "He believes family to be the most important thing" },
    { value: "H", label: "He was very unkind to other people after he became famous" }
  ],

  questions: [
    { questionNumber: 15, type: "matching", question: "Speaker 1", correctAnswer: "F" },
    { questionNumber: 16, type: "matching", question: "Speaker 2", correctAnswer: "B" },
    { questionNumber: 17, type: "matching", question: "Speaker 3", correctAnswer: "H" },
    { questionNumber: 18, type: "matching", question: "Speaker 4", correctAnswer: "C" },
    { questionNumber: 19, type: "matching", question: "Speaker 5", correctAnswer: "A" }
  ]
},

      {
  partNumber: 4,
  title: "Part 4: Map Labeling",
  instruction:
    "You will hear someone giving a talk. Label the places (20–24) on the map (A–H). There are THREE extra options which you do not need to use.",
  taskType: "Map Labeling",
  audioLabel: "https://image2url.com/audio/1766342457649-aa2ea2c2-8cd6-4a7e-a40b-77c9b474c2a3.mp3",

  mapImage: "https://image2url.com/images/1766342464640-e5ab3482-47c6-4313-8a90-1223dd4a460e.png",

  options: [
    { value: "A", label: "Market garden area" },
    { value: "B", label: "The fish farms" },
    { value: "C", label: "Rare breeds section" },
    { value: "D", label: "The forest area" },
    { value: "E", label: "Visitor car park" },
    { value: "F", label: "Experimental crops area" },
    { value: "G", label: "Main entrance" },
    { value: "H", label: "Café and rest area" }
  ],

  questions: [
    { questionNumber: 20, type: "map-labeling", question: "Rare breeds section", correctAnswer: "C" },
    { questionNumber: 21, type: "map-labeling", question: "The forest area", correctAnswer: "D" },
    { questionNumber: 22, type: "map-labeling", question: "Experimental crops area", correctAnswer: "F" },
    { questionNumber: 23, type: "map-labeling", question: "The fish farms", correctAnswer: "B" },
    { questionNumber: 24, type: "map-labeling", question: "Market garden area", correctAnswer: "A" }
  ]
},

      {
  partNumber: 5,
  title: "Part 5: Multiple Choice (Extracts)",
  instruction:
    "You will hear three extracts. Choose the correct answer (A, B or C) for each question (25–30). There are TWO questions for each extract.",
  taskType: "Multiple Choice",
  audioLabel: "https://image2url.com/audio/1766342771229-c8df7e3e-d669-4769-8071-89d2e81d96ae.mp3",

  questions: [
    {
      questionNumber: 25,
      type: "multiple-choice",
      question: "What does the visitor feel about installing satellite navigation in her car?",
      options: [
        { value: "A", label: "worried about its cost" },
        { value: "B", label: "unsure of its usefulness" },
        { value: "C", label: "doubtful about its reliability" }
      ],
      correctAnswer: "C"
    },
    {
      questionNumber: 26,
      type: "multiple-choice",
      question: "When he talks about in-car satellite navigation systems, the secretary is",
      options: [
        { value: "A", label: "helping his visitor to choose the best model" },
        { value: "B", label: "providing his visitor with information about them" },
        { value: "C", label: "warning his visitor about the drawbacks of using one" }
      ],
      correctAnswer: "B"
    },
    {
      questionNumber: 27,
      type: "multiple-choice",
      question: "What does Mike say about his use of comedy as a child?",
      options: [
        { value: "A", label: "He appeared to have an instinctive talent for it" },
        { value: "B", label: "His long-term friendships depended on it" },
        { value: "C", label: "It was one of a number of skills he developed" }
      ],
      correctAnswer: "A"
    },
    {
      questionNumber: 28,
      type: "multiple-choice",
      question: "Both speakers agree that, for a successful life, people need",
      options: [
        { value: "A", label: "a belief in themselves" },
        { value: "B", label: "a clearly defined goal" },
        { value: "C", label: "a commitment to hard work" }
      ],
      correctAnswer: "B"
    },
    {
      questionNumber: 29,
      type: "multiple-choice",
      question: "The man reads books which",
      options: [
        { value: "A", label: "remind him of people he's met" },
        { value: "B", label: "make a change from his work" },
        { value: "C", label: "are set somewhere he doesn't know" }
      ],
      correctAnswer: "C"
    },
    {
      questionNumber: 30,
      type: "multiple-choice",
      question: "His work involves",
      options: [
        { value: "A", label: "a lot of travel" },
        { value: "B", label: "looking out for new words" },
        { value: "C", label: "studying classical literature" }
      ],
      correctAnswer: "B"
    }
  ]
},

      {
  partNumber: 6,
  title: "Part 6: Academic Lecture Summary",
  instruction:
    "You will hear part of a lecture. For each question, fill in the missing information in the numbered space. Write NO MORE THAN ONE WORD for each answer.",
  taskType: "Gap Fill",
  context: "ART GALLERY",
  audioLabel: "https://image2url.com/audio/1766340507401-d5c03bbe-e568-42cf-bbc2-dfef65b93ad2.mp3",

  questions: [
    {
      questionNumber: 31,
      type: "gap-fill",
      question:
        "People in millions of British ______________ eat Anita Lee's meals. The Chinese meals which Anita bought didn't taste like the food cooked by her mother.",
      correctAnswer: "home"
    },
    {
      questionNumber: 32,
      type: "gap-fill",
      question:
        "In order to cook for herself, Anita had to find authentic Chinese ______________.",
      correctAnswer: "ingredients"
    },
    {
      questionNumber: 33,
      type: "gap-fill",
      question:
        "Increased demand made it necessary for Anita to hire people to help. Anita's company was given the top prize for ethnic food by a well-known food ______________.",
      correctAnswer: "magazines"
    },
    {
      questionNumber: 34,
      type: "gap-fill",
      question:
        "She needed money to expand the company, but she didn't want to get a ______________ from the bank.",
      correctAnswer: "loan"
    },
    {
      questionNumber: 35,
      type: "gap-fill",
      question:
        "Lania Foods wanted to make changes in the way that the ______________ was produced.",
      correctAnswer: "food"
    }
  ]
}

    ],
  },
]
