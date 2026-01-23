"use client"

interface Highlight {
    id: string
    text: string
    color: string
    startIndex: number
}

export default function HighlightText({ text, highlights, onRemoveHighlight, offset }: any) {
    if (!highlights || highlights.length === 0) return <>{text}</>

    const sorted = [...highlights]
        .filter(hl => hl.startIndex >= offset && hl.startIndex < offset + text.length)
        .sort((a, b) => a.startIndex - b.startIndex)

    const result: React.ReactNode[] = []
    let lastPos = 0

    sorted.forEach((hl) => {
        const relativeStart = Math.max(0, hl.startIndex - offset); // Xavfsiz start

        if (relativeStart > lastPos) {
            result.push(text.substring(lastPos, relativeStart))
        }

        const highlightText = text.substring(relativeStart, relativeStart + hl.text.length);

        result.push(
            <mark
                key={hl.id}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHighlight(hl.id);
                }}
                className="cursor-pointer hover:brightness-95 transition-all"
                style={{ backgroundColor: hl.color, color: 'inherit' }}
            >
                {highlightText}
            </mark>
        )
        lastPos = relativeStart + hl.text.length
    })

    if (lastPos < text.length) {
        result.push(text.substring(lastPos))
    }

    return <>{result}</>
}