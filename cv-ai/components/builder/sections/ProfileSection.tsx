'use client'

import { useCVStore } from '@/lib/cv-store'
import { FileText, Sparkles, UserCheck } from 'lucide-react'
import SectionBlock from '../SectionBlock'
import { useState, useMemo } from 'react'

const ProfileSection = () => {
  const cv = useCVStore((s) => s.cv)
  const summary = cv.summary
  const updateSummary = useCVStore((s) => s.updateSummary)
  const [isGenerating, setIsGenerating] = useState(false)

  const wordCount = useMemo(() => {
    return summary.trim() ? summary.trim().split(/\s+/).length : 0
  }, [summary])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateSummary', cv }),
      })
      if (!res.ok) throw new Error()
      const reader = res.body?.getReader()
      if (!reader) return
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        updateSummary(text)
      }
    } catch {
      // silently fail
    } finally {
      setIsGenerating(false)
    }
  }

  const handleHumanize = async () => {
    if (!summary) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'humanizeText', text: summary }),
      })
      if (!res.ok) throw new Error()
      const reader = res.body?.getReader()
      if (!reader) return
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        updateSummary(text)
      }
    } catch {
      // silently fail
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <SectionBlock id="profile" title="Accroche / Résumé" icon={<FileText size={16} />}>
      <div className="space-y-2">
        <div className="flex items-center justify-end gap-2 mb-1">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue bg-blue-light rounded-full hover:bg-blue-mid disabled:opacity-50"
          >
            <Sparkles size={12} />
            Générer
          </button>
          <button
            onClick={handleHumanize}
            disabled={isGenerating || !summary}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            <UserCheck size={12} />
            Humaniser
          </button>
        </div>
        <textarea
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Votre accroche professionnelle..."
          rows={5}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 resize-none focus:border-blue focus:ring-0"
        />
        <div className="flex justify-end">
          <span className={`text-xs ${wordCount < 30 ? 'text-warn' : 'text-gray-400'}`}>
            {wordCount} mot{wordCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </SectionBlock>
  )
}

export default ProfileSection
