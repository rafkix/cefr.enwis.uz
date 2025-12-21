export interface ListeningQuestion {
  questionNumber: number
  type: "multiple-choice" | "gap-fill" | "matching" | "map-labeling"
  question?: string
  options?: string[]
  correctAnswer: string | number
}

export interface ListeningPart {
  partNumber: number
  title: string
  instruction: string
  taskType: string
  context?: string
  audioLabel: string
  questions: ListeningQuestion[]
  mapImage?: string
  matchingOptions?: string[]
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

export const listeningTests: ListeningTest[] = [
  {
    id: "listening-demo-1",
    title: "Full Listening Test 1",
    isDemo: true,
    isFree: true,
    sections: "Sections: 1, 2, 3, 4",
    level: "MEDIUM Level",
    duration: 35,
    totalQuestions: 40,
    parts: [
      {
        partNumber: 1,
        title: "Part 1: Everyday Conversations",
        instruction:
          "You will hear some sentences. You will hear each sentence twice. Choose the correct reply to each sentence (A, B, or C).",
        taskType: "Multiple Choice",
        audioLabel: "Audio 1.1 - 1.8",
        questions: [
          {
            questionNumber: 1,
            type: "multiple-choice",
            question: "Can I borrow your pen?",
            options: ["Of course. That's fine.", "I don't have that.", "She often does."],
            correctAnswer: "A",
          },
          {
            questionNumber: 2,
            type: "multiple-choice",
            question: "Would you like to meet up tomorrow?",
            options: ["Next Wednesday.", "Yes, let's do that.", "I can't remember it."],
            correctAnswer: "B",
          },
          {
            questionNumber: 3,
            type: "multiple-choice",
            question: "Can I help you with anything?",
            options: [
              "Thank you. That's very kind of you.",
              "Yes, please. That would be lovely.",
              "Sorry, it's not only my problem.",
            ],
            correctAnswer: "B",
          },
          {
            questionNumber: 4,
            type: "multiple-choice",
            question: "How are you feeling today?",
            options: ["We can wait a bit longer.", "Not too bad. Thank you.", "Don't worry about it."],
            correctAnswer: "B",
          },
          {
            questionNumber: 5,
            type: "multiple-choice",
            question: "Did you enjoy the concert?",
            options: ["Yes, it was great.", "I'm sorry I can't.", "That is different."],
            correctAnswer: "A",
          },
          {
            questionNumber: 6,
            type: "multiple-choice",
            question: "Should we try that new restaurant?",
            options: ["Oh, yes, good idea.", "It's opposite the bus stop.", "I couldn't find it."],
            correctAnswer: "A",
          },
          {
            questionNumber: 7,
            type: "multiple-choice",
            question: "I heard you lost your wallet.",
            options: ["I'll be right there.", "Oh, what a shame.", "That's a great idea."],
            correctAnswer: "B",
          },
          {
            questionNumber: 8,
            type: "multiple-choice",
            question: "Would you like to join us for dinner?",
            options: ["Yes, I'd love to. Thanks.", "It isn't this evening.", "No way, nobody likes her."],
            correctAnswer: "A",
          },
        ],
      },
      {
        partNumber: 2,
        title: "Part 2: Form Completion",
        instruction:
          "You will hear someone giving a talk. For each question, fill in the missing information in the numbered space. Write ONE WORD and/or A NUMBER for each answer.",
        taskType: "Gap Fill",
        context: "COMMUNITY CENTER REGISTRATION",
        audioLabel: "Audio 2.1",
        questions: [
          {
            questionNumber: 9,
            type: "gap-fill",
            question: "Name: Sarah _______",
            correctAnswer: "Johnson",
          },
          {
            questionNumber: 10,
            type: "gap-fill",
            question: "Phone number: _______",
            correctAnswer: "07845123456",
          },
          {
            questionNumber: 11,
            type: "gap-fill",
            question: "Email: sarah.johnson@_______",
            correctAnswer: "email.com",
          },
          {
            questionNumber: 12,
            type: "gap-fill",
            question: "Interested in: _______ classes",
            correctAnswer: "yoga",
          },
          {
            questionNumber: 13,
            type: "gap-fill",
            question: "Preferred day: _______",
            correctAnswer: "Wednesday",
          },
          {
            questionNumber: 14,
            type: "gap-fill",
            question: "Membership fee: £_______ per month",
            correctAnswer: "25",
          },
        ],
      },
      {
        partNumber: 3,
        title: "Part 3: Matching Speakers to Places",
        instruction:
          "You will hear people speaking in different situations. Match each speaker (15-18) to the place where the speaker is (A-F). There are TWO EXTRA places which you do not need to use.",
        taskType: "Matching",
        audioLabel: "Audio 3.1 - 3.4",
        matchingOptions: [
          "A) at a wedding",
          "B) at a birthday party",
          "C) at a leaving party",
          "D) in a university lecture hall",
          "E) at a funeral",
          "F) in a classroom",
        ],
        questions: [
          {
            questionNumber: 15,
            type: "matching",
            question: "Speaker 1",
            correctAnswer: "B",
          },
          {
            questionNumber: 16,
            type: "matching",
            question: "Speaker 2",
            correctAnswer: "D",
          },
          {
            questionNumber: 17,
            type: "matching",
            question: "Speaker 3",
            correctAnswer: "A",
          },
          {
            questionNumber: 18,
            type: "matching",
            question: "Speaker 4",
            correctAnswer: "C",
          },
        ],
      },
      {
        partNumber: 4,
        title: "Part 4: Map Labeling",
        instruction:
          "You will hear someone giving a talk. Label the places (19-23) on the map (A-H). There are THREE extra options which you do not need to use.",
        taskType: "Map Labeling",
        audioLabel: "Audio 4.1",
        mapImage: "/community-center-map.jpg",
        questions: [
          {
            questionNumber: 19,
            type: "map-labeling",
            question: "Recreation centre",
            correctAnswer: "C",
          },
          {
            questionNumber: 20,
            type: "map-labeling",
            question: "Health centre",
            correctAnswer: "F",
          },
          {
            questionNumber: 21,
            type: "map-labeling",
            question: "Swimming pool and sauna",
            correctAnswer: "A",
          },
          {
            questionNumber: 22,
            type: "map-labeling",
            question: "Health-food store",
            correctAnswer: "D",
          },
          {
            questionNumber: 23,
            type: "map-labeling",
            question: "Jenny's Restaurant",
            correctAnswer: "G",
          },
        ],
      },
      {
        partNumber: 5,
        title: "Part 5: Multiple Choice (Extracts)",
        instruction:
          "You will hear three extracts. Choose the correct answer (A, B or C) for each question (24-29). There are TWO questions for each extract.",
        taskType: "Multiple Choice",
        audioLabel: "Audio 5.1 - 5.3",
        questions: [
          {
            questionNumber: 24,
            type: "multiple-choice",
            question: "Anne was very astonished because the union ...",
            options: ["A) did not fire Frank soon.", "B) made him so popular.", "C) gave him an award."],
            correctAnswer: "C",
          },
          {
            questionNumber: 25,
            type: "multiple-choice",
            question: "What is the main reason for losing a job for Frank?",
            options: [
              "A) Sexist remarks toward his colleagues.",
              "B) The advertisement for the receptionist.",
              "C) Taking time to meet the deadline.",
            ],
            correctAnswer: "A",
          },
          {
            questionNumber: 26,
            type: "multiple-choice",
            question: "Smoke-jumping is an ideal job for most of the women as ...",
            options: [
              "A) they have a fitting weight.",
              "B) they weigh more than 80 kilos.",
              "C) they have a right attitude.",
            ],
            correctAnswer: "A",
          },
          {
            questionNumber: 27,
            type: "multiple-choice",
            question: "A speaker says that you are not able to get the right spot if ...",
            options: ["A) you are heavier.", "B) you leave a parachute.", "C) you are lighter."],
            correctAnswer: "C",
          },
          {
            questionNumber: 28,
            type: "multiple-choice",
            question: "According to the female speaker, what problem did the male teacher mention earlier?",
            options: [
              "A) He is strictly following to the schedule.",
              "B) Some students are unable to do well.",
              "C) A student has emotional problems.",
            ],
            correctAnswer: "C",
          },
          {
            questionNumber: 29,
            type: "multiple-choice",
            question: "Brian tends to ... while acting.",
            options: ["A) daydream", "B) listen", "C) walk"],
            correctAnswer: "A",
          },
        ],
      },
      {
        partNumber: 6,
        title: "Part 6: Academic Lecture Summary",
        instruction:
          "You will hear part of a lecture. For each question, fill in the missing information in the numbered space. Write NO MORE THAN ONE WORD for each answer.",
        taskType: "Gap Fill",
        context: "ART GALLERY",
        audioLabel: "Audio 6.1",
        questions: [
          {
            questionNumber: 30,
            type: "gap-fill",
            question: "Cranfield Art Gallery is an example of contemporary _______",
            correctAnswer: "architecture",
          },
          {
            questionNumber: 31,
            type: "gap-fill",
            question: "There are five acres of _______ around the art gallery.",
            correctAnswer: "gardens",
          },
          {
            questionNumber: 32,
            type: "gap-fill",
            question: "The gallery's large windows let in a great deal of _______",
            correctAnswer: "light",
          },
          {
            questionNumber: 33,
            type: "gap-fill",
            question: "There are works by _______ and foreign artists on display.",
            correctAnswer: "local",
          },
          {
            questionNumber: 34,
            type: "gap-fill",
            question: 'Among the paintings is the _______ "Lady in the Rain" by Mac Addams.',
            correctAnswer: "portrait",
          },
          {
            questionNumber: 35,
            type: "gap-fill",
            question: "You can find not only portraits, but also seascapes and _______",
            correctAnswer: "landscapes",
          },
        ],
      },
    ],
  },
  {
    id: "listening-demo-2",
    title: "Full Listening Test 2",
    isDemo: true,
    isFree: true,
    sections: "Sections: 1, 2, 3, 4",
    level: "MEDIUM Level",
    duration: 35,
    totalQuestions: 40,
    parts: [
      {
        partNumber: 1,
        title: "Part 1: Everyday Conversations",
        instruction:
          "You will hear some sentences. You will hear each sentence twice. Choose the correct reply to each sentence (A, B, or C).",
        taskType: "Multiple Choice",
        audioLabel: "Audio 1.1 - 1.8",
        questions: [
          {
            questionNumber: 1,
            type: "multiple-choice",
            question: "What time does the library close?",
            options: ["At 8 PM.", "Yes, it's open.", "Near the park."],
            correctAnswer: "A",
          },
          {
            questionNumber: 2,
            type: "multiple-choice",
            question: "Have you finished your homework?",
            options: ["I will soon.", "Yes, I have.", "That's correct."],
            correctAnswer: "B",
          },
          {
            questionNumber: 3,
            type: "multiple-choice",
            question: "Could you pass me the salt?",
            options: ["Here you go.", "It's very salty.", "I like it too."],
            correctAnswer: "A",
          },
          {
            questionNumber: 4,
            type: "multiple-choice",
            question: "Do you know where Tom is?",
            options: ["He left earlier.", "Yes, I know him.", "That's fine."],
            correctAnswer: "A",
          },
          {
            questionNumber: 5,
            type: "multiple-choice",
            question: "Would you mind closing the window?",
            options: ["Not at all.", "It's quite cold.", "I agree."],
            correctAnswer: "A",
          },
          {
            questionNumber: 6,
            type: "multiple-choice",
            question: "How was your weekend?",
            options: ["It was great, thanks.", "Next weekend.", "I'm not sure."],
            correctAnswer: "A",
          },
          {
            questionNumber: 7,
            type: "multiple-choice",
            question: "I failed my driving test.",
            options: ["Better luck next time.", "Congratulations!", "That's wonderful."],
            correctAnswer: "A",
          },
          {
            questionNumber: 8,
            type: "multiple-choice",
            question: "Shall we order pizza tonight?",
            options: ["Sounds good to me.", "I had pizza yesterday.", "It's expensive."],
            correctAnswer: "A",
          },
        ],
      },
    ],
  },
]
