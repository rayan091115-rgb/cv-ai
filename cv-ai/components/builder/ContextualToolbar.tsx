'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCVStore } from '@/lib/cv-store'
import { showToast } from '@/lib/toast'
import { Sparkles, Zap, Scissors, RefreshCw, Globe, UserCheck, Loader2 } from 'lucide-react'

interface SelectionInfo {
  text: string
  rect: DOMRect
  fieldId: string
  expId?: string
  bulletIdx?: number
  fieldType: 'input' | 'textarea'
}

const ContextualToolbar = () => {
  const [selection, setSelection] = useState<SelectionInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingAction, setProcessingAction] = useState('')
  const toolbarRef = useRef<HTMLDivElement>(null)

  const cv = useCVStore((s) => s.cv)
  const updateSummary = useCVStore((s) => s.updateSummary)
  const updatePersonal = useCVStore((s) => s.updatePersonal)
  const updateExperienceBullet = useCVStore((s) => s.updateExperienceBullet)
  const updateExperience = useCVStore((s) => s.updateExperience)

  const checkSelection = useCallback(() => {
    const activeEl = document.activeElement
    if (!(activeEl instanceof HTMLInputElement) && !(activeEl instanceof HTMLTextAreaElement)) {
      setSelection(null)
      return
    }
    const start = activeEl.selectionStart ?? 0
    const end = activeEl.selectionEnd ?? 0
    if (end - start < 4) { setSelection(null); return }

    const text = activeEl.value.substring(start, end)
    const rect = activeEl.getBoundingClientRect()
    const fieldId = activeEl.getAttribute('data-cv-field') || activeEl.id || ''
    const expId = activeEl.getAttribute('data-exp-id') || undefined
    const bulletIdxAttr = activeEl.getAttribute('data-bullet-idx')
    const bulletIdx = bulletIdxAttr !== null ? parseInt(bulletIdxAttr) : undefined

    setSelection({
      text, rect, fieldId, expId,
      bulletIdx,
      fieldType: activeEl instanceof HTMLTextAreaElement ? 'textarea' : 'input',
    })
  }, [])

  useEffect(() => {
    const onMouseUp = () => setTimeout(checkSelection, 50)
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey) setTimeout(checkSelection, 50)
    }
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [checkSelection])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const active = document.activeElement
        if (active !== e.target) setSelection(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const applyResultToStore = useCallback((fieldId: string, result: string, info: SelectionInfo) => {
    const activeEl = document.querySelector(`[data-cv-field="${fieldId}"]`) as HTMLInputElement | HTMLTextAreaElement | null
    if (!activeEl) return
    const originalValue = activeEl.value
    const newValue = originalValue.replace(info.text, result)

    if (fieldId === 'summary') {
      updateSummary(newValue)
    } else if (fieldId.startsWith('personal.')) {
      const key = fieldId.split('.')[1] as keyof typeof cv.personal
      updatePersonal({ [key]: newValue })
    } else if (info.expId && info.bulletIdx !== undefined) {
      updateExperienceBullet(info.expId, info.bulletIdx, result)
    } else if (info.expId && fieldId === 'exp-title') {
      updateExperience(info.expId, { title: newValue })
    } else if (info.expId && fieldId === 'exp-company') {
      updateExperience(info.expId, { company: newValue })
    }
  }, [cv, updateSummary, updatePersonal, updateExperienceBullet, updateExperience])

  const handleAction = async (action: string) => {
    if (!selection) return
    setIsProcessing(true)
    setProcessingAction(action)

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: selection.text,
          cv,
          level: 'improved',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')
      const decoder = new TextDecoder()
      let result = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value, { stream: true })
      }

      if (result.trim()) {
        applyResultToStore(selection.fieldId, result.trim(), selection)
        showToast('Texte mis à jour ✓', 'success')
      }
      setSelection(null)
    } catch (err) {
      console.error('ContextualToolbar error:', err)
      showToast('Erreur IA. Vérifiez votre clé API.', 'error')
    } finally {
      setIsProcessing(false)
      setProcessingAction('')
    }
  }

  if (!selection) return null

  const actions = [
    { id: 'improveBullet',    label: 'Améliorer',     icon: Sparkles, color: '#2563EB' },
    { id: 'aggressiveBullet', label: 'Renforcer',      icon: Zap,      color: '#EA580C' },
    { id: 'shortenText',      label: 'Raccourcir',     icon: Scissors, color: '#6B7280' },
    { id: 'reformulateText',  label: 'Reformuler',     icon: RefreshCw,color: '#7C3AED' },
    { id: 'translateEN',      label: 'EN',             icon: Globe,    color: '#16A34A' },
    { id: 'humanizeText',     label: 'Humaniser',      icon: UserCheck,color: '#DB2777' },
  ]

  const top = Math.max(8, selection.rect.top - 48)
  const left = Math.max(8, Math.min(
    window.innerWidth - 420,
    selection.rect.left + selection.rect.width / 2 - 210
  ))

  return (
    <div
      ref={toolbarRef}
      id="contextual-toolbar"
      className="fixed z-[200] flex items-center gap-0.5 px-2 py-1.5 bg-white border border-gray-200 rounded-[10px]"
      style={{ top, left, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
    >
      {isProcessing ? (
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500">
          <Loader2 size={12} className="animate-spin text-blue-500" />
          <span>Génération en cours...</span>
        </div>
      ) : (
        actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors"
              style={{ color: action.color }}
              title={action.label}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          )
        })
      )}
    </div>
  )
}

export default ContextualToolbar
