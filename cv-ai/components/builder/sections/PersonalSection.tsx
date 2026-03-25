'use client'

import { useCVStore } from '@/lib/cv-store'
import { User, Sparkles } from 'lucide-react'
import SectionBlock from '../SectionBlock'
import { useState } from 'react'

const PersonalSection = () => {
  const cv = useCVStore((s) => s.cv)
  const personal = cv.personal
  const updatePersonal = useCVStore((s) => s.updatePersonal)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const handleSuggestRole = async () => {
    setLoadingSuggestions(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggestJobTitle', cv }),
      })
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.suggestions || [])
        setShowSuggestions(true)
      }
    } catch {
      // silently fail
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0'

  return (
    <SectionBlock id="personal" title="Informations personnelles" icon={<User size={16} />}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
            <input
              type="text"
              value={personal.firstName}
              onChange={(e) => updatePersonal({ firstName: e.target.value })}
              placeholder="Jean"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
            <input
              type="text"
              value={personal.lastName}
              onChange={(e) => updatePersonal({ lastName: e.target.value })}
              placeholder="Dupont"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Poste visé</label>
          <div className="relative">
            <input
              type="text"
              value={personal.targetRole}
              onChange={(e) => updatePersonal({ targetRole: e.target.value })}
              placeholder="Développeur Full Stack"
              className={`${inputClass} pr-10`}
            />
            <button
              onClick={handleSuggestRole}
              disabled={loadingSuggestions}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-blue-light text-blue disabled:opacity-50"
              title="Suggérer un poste"
            >
              <Sparkles size={14} className={loadingSuggestions ? 'animate-spin' : ''} />
            </button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    updatePersonal({ targetRole: s })
                    setShowSuggestions(false)
                  }}
                  className="px-2.5 py-1 text-xs bg-blue-light text-blue rounded-full hover:bg-blue-mid transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={personal.email}
              onChange={(e) => updatePersonal({ email: e.target.value })}
              placeholder="jean@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
            <input
              type="tel"
              value={personal.phone}
              onChange={(e) => updatePersonal({ phone: e.target.value })}
              placeholder="06 12 34 56 78"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
            <input
              type="text"
              value={personal.city}
              onChange={(e) => updatePersonal({ city: e.target.value })}
              placeholder="Paris"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Code postal</label>
            <input
              type="text"
              value={personal.zipcode || ''}
              onChange={(e) => updatePersonal({ zipcode: e.target.value })}
              placeholder="75001"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn</label>
            <input
              type="url"
              value={personal.linkedin || ''}
              onChange={(e) => updatePersonal({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">GitHub</label>
            <input
              type="url"
              value={personal.github || ''}
              onChange={(e) => updatePersonal({ github: e.target.value })}
              placeholder="github.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </SectionBlock>
  )
}

export default PersonalSection
