// types/word.ts
export interface Word {
    id: number
    word: string
    definition: string
    example: string
    pronunciation?: string
    part_of_speech?: string
    synonyms?: string[]
}

export interface UserWord {
    id: number               // user_word_id
    progress: number         // 0–100
    word: Word
}
