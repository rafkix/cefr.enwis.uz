"use client"

import type React from "react"
import { useState, useRef } from "react"

interface Highlight {
  id: string
  start: number
  end: number
  text: string
  color: string
}

interface HighlightTextProps {
  text: string
  highlights: Highlight[]
  onAddHighlight: (start: number, end: number, color: string) => void
  highlightColor: string
}

const highlightColors = [
  { name: "Yellow", class: "bg-yellow-200" },
  { name: "Green", class: "bg-green-200" },
  { name: "Blue", class: "bg-blue-200" },
  { name: "Pink", class: "bg-pink-200" },
  { name: "Orange", class: "bg-orange-200" },
]

export default function HighlightText({ text, highlights, onAddHighlight, highlightColor }: HighlightTextProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; selectionText: string } | null>(null)
  const [selectionData, setSelectionData] = useState<{ start: number; end: number } | null>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(document.getElementById("reading-passage") || document.body)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      const start = preCaretRange.toString().length - selection.toString().length
      const end = start + selection.toString().length

      setSelectionData({ start, end })
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        selectionText: selection.toString(),
      })
    }
  }

  const handleColorSelect = (colorClass: string) => {
    if (selectionData) {
      onAddHighlight(selectionData.start, selectionData.end, colorClass)
      window.getSelection()?.removeAllRanges()
    }
    setContextMenu(null)
    setSelectionData(null)
  }

  const handleClick = () => {
    setContextMenu(null)
  }

  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      // Split into paragraphs and render each one
      return text.split("\n\n").map((para, idx) => (
        <p key={idx} className="whitespace-pre-wrap">
          {para}
        </p>
      ))
    }

    // Build a map of character positions across the entire text
    const paragraphs = text.split("\n\n")
    const result = []
    let currentPos = 0

    paragraphs.forEach((para, paraIdx) => {
      const paraStart = currentPos
      const paraEnd = currentPos + para.length

      // Find highlights that overlap with this paragraph
      const paraHighlights = highlights.filter((h) => h.start < paraEnd && h.end > paraStart)

      if (paraHighlights.length === 0) {
        // No highlights in this paragraph
        result.push(
          <p key={paraIdx} className="whitespace-pre-wrap">
            {para}
          </p>,
        )
      } else {
        // Render paragraph with highlights
        const sortedHighlights = [...paraHighlights].sort((a, b) => a.start - b.start)
        const paraContent = []
        let lastIndex = paraStart

        sortedHighlights.forEach((highlight, idx) => {
          const highlightStart = Math.max(highlight.start, paraStart)
          const highlightEnd = Math.min(highlight.end, paraEnd)

          // Add text before highlight
          if (highlightStart > lastIndex) {
            paraContent.push(<span key={`text-${paraIdx}-${idx}`}>{text.substring(lastIndex, highlightStart)}</span>)
          }

          // Add highlighted text
          paraContent.push(
            <mark
              key={`highlight-${paraIdx}-${idx}`}
              className={`${highlight.color} cursor-pointer hover:opacity-75 transition-opacity`}
            >
              {text.substring(highlightStart, highlightEnd)}
            </mark>,
          )

          lastIndex = highlightEnd
        })

        // Add remaining text in paragraph
        if (lastIndex < paraEnd) {
          paraContent.push(<span key={`text-${paraIdx}-end`}>{text.substring(lastIndex, paraEnd)}</span>)
        }

        result.push(
          <p key={paraIdx} className="whitespace-pre-wrap">
            {paraContent}
          </p>,
        )
      }

      // Move position forward (add paragraph length + newline characters)
      currentPos = paraEnd + 2 // +2 for "\n\n"
    })

    return result
  }

  return (
    <div onClick={handleClick}>
      <div
        id="reading-passage"
        className="text-sm leading-relaxed text-gray-800 space-y-3 select-text"
        onContextMenu={handleContextMenu}
      >
        {renderHighlightedText()}
      </div>

      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white border border-gray-300 rounded shadow-lg z-50 py-1"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-600 border-b border-gray-200">Highlight color</div>
          {highlightColors.map((color) => (
            <button
              key={color.class}
              onClick={() => handleColorSelect(color.class)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 transition text-sm text-gray-700 flex items-center gap-2"
            >
              <div className={`w-4 h-4 rounded ${color.class}`} />
              {color.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
