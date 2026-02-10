"use client"

import React, { useRef, useCallback } from 'react'

interface Highlight {
    id: string
    text: string
    color: string
    startIndex: number
}

interface HighlightTextProps {
    text: string
    highlights: Highlight[]
    onAddHighlight: (hl: Highlight) => void
    onRemoveHighlight: (id: string) => void
    offset: number
    activeColor: string
}

export default function HighlightText({
    text,
    highlights,
    onAddHighlight,
    onRemoveHighlight,
    offset,
    activeColor
}: HighlightTextProps) {
    const containerRef = useRef<HTMLSpanElement>(null)

    const handleMouseUp = useCallback(() => {
        // Agar o'chirg'ich yoki rang tanlanmagan bo'lsa, hech narsa qilmaymiz
        if (!activeColor || activeColor === "transparent") return

        const selection = window.getSelection()
        if (!selection || selection.isCollapsed || selection.toString().trim() === "") return

        const range = selection.getRangeAt(0)

        // Faqat shu komponent ichidagi matn tanlanganini tekshiramiz
        if (containerRef.current?.contains(range.commonAncestorContainer)) {
            const preSelectionRange = range.cloneRange()
            preSelectionRange.selectNodeContents(containerRef.current)
            preSelectionRange.setEnd(range.startContainer, range.startOffset)

            const relativeStart = preSelectionRange.toString().length
            const globalStart = offset + relativeStart

            onAddHighlight({
                id: `hl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                text: selection.toString(),
                color: activeColor,
                startIndex: globalStart
            })

            // Word/Chrome kabi tanlovni avtomatik yopish
            selection.removeAllRanges()
        }
    }, [activeColor, offset, onAddHighlight])

    // 1. Highlightlarni saralash va filtrlash
    const sortedHighlights = [...highlights]
        .filter(hl => hl.startIndex >= offset && hl.startIndex < offset + text.length)
        .sort((a, b) => a.startIndex - b.startIndex)

    const result: React.ReactNode[] = []
    let lastPos = 0

    // 2. Matnni qismlarga bo'lib render qilish
    sortedHighlights.forEach((hl) => {
        const relativeStart = Math.max(0, hl.startIndex - offset)

        // Overlap (ustma-ust tushish) himoyasi
        if (relativeStart < lastPos) return

        if (relativeStart > lastPos) {
            result.push(text.substring(lastPos, relativeStart))
        }

        const highlightText = text.substring(relativeStart, relativeStart + hl.text.length)

        result.push(
            <mark
                key={hl.id}
                onClick={(e) => {
                    e.stopPropagation()
                    // Faqat o'chirg'ich yoqilgan bo'lsa yoki bosilganda o'chirish
                    onRemoveHighlight(hl.id)
                }}
                className="cursor-pointer hover:brightness-90 transition-all rounded-sm px-0.5 select-text"
                style={{ backgroundColor: hl.color, color: 'inherit' }}
                title="O'chirish uchun bosing"
            >
                {highlightText}
            </mark>
        )
        lastPos = relativeStart + hl.text.length
    })

    if (lastPos < text.length) {
        result.push(text.substring(lastPos))
    }

    return (
        <span
            ref={containerRef}
            onMouseUp={handleMouseUp}
            className="passage-segment inline"
        >
            {result.length > 0 ? result : text}
        </span>
    )
}