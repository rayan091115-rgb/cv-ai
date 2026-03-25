'use client'

import { useCVStore } from '@/lib/cv-store'
import { showToast } from '@/lib/toast'
import { Heart, X, Sparkles } from 'lucide-react'
import SectionBlock from '../SectionBlock'
import { useState } from 'react'

const InterestsSection = () => {
  const cv = useCVStore((s) => s.cv)
  const interests = cv.interests
  const updateInterests = useCVStore((s) => s.updateInterests)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleAdd = () => {
    const trimmed = input.trim()
    if (trimmed && !interests.includes(trimmed)) {
      updateInterests([...interests, trimmed])
      setInput('')
    }
  }

  const handleRemove = (interest: string) => {
    updateInterests(interests.filter((i) => i !== interest))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleSuggest = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggestInterests', cv }),
      })
      if (res.ok) {
        const data = await res.json()
        setSuggestions((data.suggestions || []).filter((s: string) => !interests.includes(s)))
      } else {
        showToast('Erreur lors de la suggestion', 'error')
      }
    } catch {
      showToast('Erreur réseau', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionBlock id="hobbies" title="Centres d'intérêt" icon={<Heart size={16} />}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {interest}
              <button onClick={() => handleRemove(interest)} className="hover:text-danger">
                <X size={12} />
              </button>
            </span>
          ))}
          {interests.length === 0 && (
            <span className="text-xs text-gray-400">Aucun centre d&apos;intérêt ajouté</span>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter un centre d'intérêt..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-3 py-2 text-sm font-medium text-white bg-blue rounded-[6px] hover:bg-blue-dark disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          onClick={handleSuggest}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium text-blue hover:underline disabled:opacity-50"
        >
          <Sparkles size={12} />
          {loading ? 'Recherche...' : 'Suggérer des centres d\'intérêt'}
        </button>

        {suggestions.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-[10px] space-y-2">
            <span className="text-xs font-medium text-gray-600">Suggestions :</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    updateInterests([...interests, s])
                    setSuggestions((prev) => prev.filter((x) => x !== s))
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
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

export default InterestsSection
