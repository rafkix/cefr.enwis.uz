"use client"

interface Highlight {
  id: string
  text: string
  color: string
  startIndex: number
}

export default function HighlightText({ 
  text, 
  highlights, 
  onRemoveHighlight,
  offset 
}: { 
  text: string, 
  highlights: Highlight[], 
  onRemoveHighlight: (id: string) => void,
  offset: number
}) {
  if (!highlights || highlights.length === 0) return <>{text}</>

  // Faqat shu segmentga tegishli highlightlarni saralash
  const sorted = [...highlights]
    .filter(hl => hl.startIndex >= offset && hl.startIndex < offset + text.length)
    .sort((a, b) => a.startIndex - b.startIndex)

  const result: React.ReactNode[] = []
  let lastPos = 0

  sorted.forEach((hl) => {
    const relativeStart = hl.startIndex - offset

    // Oddiy matn
    if (relativeStart > lastPos) {
      result.push(text.substring(lastPos, relativeStart))
    }

    // Highlight qismi
    result.push(
      <mark
        key={hl.id}
        onClick={(e) => {
          e.stopPropagation()
          onRemoveHighlight(hl.id)
        }}
        className="cursor-pointer hover:opacity-80 transition-all select-text"
        style={{ backgroundColor: hl.color, color: 'inherit', padding: '0' }}
      >
        {text.substring(relativeStart, relativeStart + hl.text.length)}
      </mark>
    )
    lastPos = relativeStart + hl.text.length
  })

  // Qolgan matn
  if (lastPos < text.length) {
    result.push(text.substring(lastPos))
  }

  return <>{result}</>
}