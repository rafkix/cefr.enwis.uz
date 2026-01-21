// store/vocabulary-store.ts
import { create } from "zustand"

import {
    getUserWordsAPI,
} from "@/lib/api/words"
import { UserWord } from "../types/word"

interface VocabularyState {
    words: UserWord[]
    currentIndex: number
    loading: boolean

    fetchWords: () => Promise<void>
    reviewWord: (quality: number) => Promise<void>
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
    words: [],
    currentIndex: 0,
    loading: true,

    fetchWords: async () => {
        try {
        const res = await getUserWordsAPI()
        set({
            words: res.data,
            currentIndex: 0,
            loading: false,
        })
        } catch (err) {
        console.error("Load words error", err)
        set({ loading: false })
        }
    },

    reviewWord: async (quality) => {
        const { words, currentIndex } = get()
        const current = words[currentIndex]
        if (!current) return

        await reviewUserWordAPI(current.id, { quality })

        set({
        currentIndex: currentIndex + 1,
        })
    },
}))

function reviewUserWordAPI(id: any, arg1: { quality: number }) {
    throw new Error("Function not implemented.")
}

