// components/ui/sidebar.tsx

function isTypingTarget(t: EventTarget | null) {
  if (!(t instanceof HTMLElement)) return false
  if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.tagName === 'SELECT') return true
  if (t.isContentEditable) return true
  return Boolean(t.closest('textarea,input,select,[contenteditable="true"]'))
}

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // ✅ ESSAY/INPUT yozayotgan bo‘lsa sidebar umuman aralashmasin
    if (isTypingTarget(event.target)) return

    // ✅ faqat sidebar uchun kerakli tugmalarni ushla
    const k = event.key
    const isSidebarKey = k === 'ArrowUp' || k === 'ArrowDown' || k === 'Home' || k === 'End'

    if (!isSidebarKey) return

    event.preventDefault()

    // ... sidebar navigatsiya logikangiz
  }

  window.addEventListener('keydown', handleKeyDown, { capture: true })
  return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
}, [])