'use client'

import { useCVStore } from '@/lib/cv-store'
import { Zap, Plus, X, Sparkles } from 'lucide-react'
import SectionBlock from '../SectionBlock'
import { useState } from 'react'

const SkillsSection = () => {
  const cv = useCVStore((s) => s.cv)
  const skills = cv.skills
  const addSkill = useCVStore((s) => s.addSkill)
  const removeSkill = useCVStore((s) => s.removeSkill)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const handleAdd = () => {
    const trimmed = input.trim()
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleSuggest = async () => {
    setLoadingSuggestions(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggestSkills', cv }),
      })
      if (res.ok) {
        const data = await res.json()
        setSuggestions((data.suggestions || []).filter((s: string) => !skills.includes(s)))
      }
    } catch {
      // silently fail
    } finally {
      setLoadingSuggestions(false)
    }
  }

  return (
    <SectionBlock id="skills" title="Compétences" icon={<Zap size={16} />}>
      <div className="space-y-3">
        {/* Current skills as tags */}
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-light text-blue rounded-full"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:text-danger"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <span className="text-xs text-gray-400">Aucune compétence ajoutée</span>
          )}
        </div>

        {/* Add input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une compétence..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-3 py-2 text-sm font-medium text-white bg-blue rounded-[6px] hover:bg-blue-dark disabled:opacity-40"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* AI suggest button */}
        <button
          onClick={handleSuggest}
          disabled={loadingSuggestions}
          className="flex items-center gap-1.5 text-xs font-medium text-blue hover:underline disabled:opacity-50"
        >
          <Sparkles size={12} />
          {loadingSuggestions ? 'Recherche en cours...' : 'Suggérer des compétences'}
        </button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-3 bg-blue-light/50 rounded-[10px] space-y-2">
            <span className="text-xs font-medium text-gray-600">Suggestions :</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    addSkill(s)
                    setSuggestions((prev) => prev.filter((x) => x !== s))
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-white text-blue border border-blue/20 rounded-full hover:bg-blue-light transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionBlock>
  )
}

export default SkillsSection
