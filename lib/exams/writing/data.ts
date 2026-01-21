import { WritingTest } from './types'

export const writingSets: WritingTest[] = [
  {
    id: 'writing-community-cleanup-1',
    title: 'Writing Set – Community Clean-Up Event',
    isDemo: true,
    isFree: true,
    cefrLevel: 'B2',
    durationMinutes: 60,

    // 1. UMUMIY MATN (Task 1.1 va 1.2 uchun kontekst)
    sharedContext: `You took part in a community clean-up last weekend. After the event, the organizers sent you this email:

"Dear volunteer,
Thank you for helping with our clean-up event. Your opinion matters to us. What part of the event do you think worked best? And how can we get more people involved in future activities?

Community Action Team"`,

    // 2. SAVOLLAR (Endi 3 ta alohida qismga bo'lindi)
    tasks: [
      {
        id: 'task-1.1',
        part: '1.1',
        type: 'informal-letter',
        instruction: 'Write a letter to your friend:',
        prompt: `Write a letter to your friend:
- say what you liked most about the event
- explain how more people could be encouraged to take part`,
        minWords: 50,
        maxWords: 60,
      },
      {
        id: 'task-1.2',
        part: '1.2',
        type: 'formal-letter',
        instruction: 'Write a letter to the organizing team:',
        prompt: `Write a letter to the organizing team:
- give feedback on what worked well during the event
- mention any problems you noticed
- suggest ways to improve future activities and attract more volunteers`,
        minWords: 120,
        maxWords: 150,
      },
      {
        id: 'task-2',
        part: '2',
        type: 'essay',
        instruction: 'Write an opinion essay.',
        prompt: `You are participating in an online discussion for language learners.

The question is:
"Should more young people take part in community service?"

Give your opinion and support it with clear reasons and examples.`,
        minWords: 180,
        maxWords: 200,
      },
    ],
  },
]
