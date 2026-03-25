'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, Zap, Scissors, RefreshCw, Globe, UserCheck } from 'lucide-react'

interface SelectionInfo {
  text: string
  rect: DOMRect | null
  inputElement: HTMLInputElement | HTMLTextAreaElement | null
}

const ContextualToolbar = () => {
  const [selection, setSelection] = useState<SelectionInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const checkSelection = useCallback(() => {
    const activeEl = document.activeElement
    if (
      activeEl instanceof HTMLInputElement ||
      activeEl instanceof HTMLTextAreaElement
    ) {
      const start = activeEl.selectionStart ?? 0
      const end = activeEl.selectionEnd ?? 0
      if (end - start > 3) {
        const text = activeEl.value.substring(start, end)
        const rect = activeEl.getBoundingClientRect()
        setSelection({ text, rect, inputElement: activeEl })
        return
      }
    }
    setSelection(null)
  }, [])

  useEffect(() => {
    const interval = setInterval(checkSelection, 500)
    const handleMouseUp = () => setTimeout(checkSelection, 50)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      clearInterval(interval)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [checkSelection])

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        // Don't dismiss immediately — let checkSelection handle it
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleAction = async (action: string) => {
    if (!selection?.inputElement || !selection.text) return
    setIsProcessing(true)
    const el = selection.inputElement
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text: selection.text }),
      })
      if (!res.ok) throw new Error()
      const reader = res.body?.getReader()
      if (!reader) return
      const decoder = new TextDecoder()
      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value, { stream: true })
        const before = el.value.substring(0, start)
        const after = el.value.substring(end)
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype, 'value'
        )?.set || Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        )?.set
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(el, before + result + after)
          el.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
      setSelection(null)
    } catch {
      // silently fail
    } finally {
      setIsProcessing(false)
    }
  }

  if (!selection?.rect || isProcessing) return null

  const actions = [
    { id: 'improveBullet', label: 'Améliorer', icon: Sparkles, color: 'text-blue' },
    { id: 'aggressiveBullet', label: 'Renforcer', icon: Zap, color: 'text-orange-500' },
    { id: 'shortenText', label: 'Raccourcir', icon: Scissors, color: 'text-gray-600' },
    { id: 'reformulateText', label: 'Reformuler', icon: RefreshCw, color: 'text-purple-500' },
    { id: 'translateEN', label: 'Traduire EN', icon: Globe, color: 'text-green-600' },
    { id: 'humanizeText', label: 'Humaniser', icon: UserCheck, color: 'text-pink-500' },
  ]

  return (
    <div
      ref={toolbarRef}
      id="contextual-toolbar"
      className="fixed z-[200] flex items-center gap-0.5 px-2 py-1 bg-white border border-gray-200 rounded-[10px]"
      style={{
        top: selection.rect.top - 44,
        left: Math.max(8, selection.rect.left + selection.rect.width / 2 - 200),
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors ${action.color}`}
            title={action.label}
          >
            <Icon size={12} />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ContextualToolbar
