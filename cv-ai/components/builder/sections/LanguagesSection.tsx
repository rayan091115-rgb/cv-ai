'use client'

import { useCVStore } from '@/lib/cv-store'
import { Globe, Plus, Trash2 } from 'lucide-react'
import SectionBlock from '../SectionBlock'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Natif']

const levelPercent: Record<string, number> = {
  A1: 15,
  A2: 30,
  B1: 45,
  B2: 60,
  C1: 78,
  C2: 92,
  Natif: 100,
}

const LanguagesSection = () => {
  const languages = useCVStore((s) => s.cv.languages)
  const addLanguage = useCVStore((s) => s.addLanguage)
  const updateLanguage = useCVStore((s) => s.updateLanguage)
  const removeLanguage = useCVStore((s) => s.removeLanguage)

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0'

  return (
    <SectionBlock id="languages" title="Langues" icon={<Globe size={16} />}>
      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.id} className="flex items-center gap-2">
            <input
              type="text"
              value={lang.language}
              onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
              placeholder="Langue"
              className={`${inputClass} flex-1`}
            />
            <select
              value={lang.level}
              onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 focus:border-blue focus:ring-0"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            {/* Progress bar */}
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${levelPercent[lang.level] || 50}%`,
                  backgroundColor: (levelPercent[lang.level] || 50) >= 78 ? '#10B981' : (levelPercent[lang.level] || 50) >= 45 ? '#F59E0B' : '#EF4444',
                }}
              />
            </div>
            <button
              onClick={() => removeLanguage(lang.id)}
              className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded"
              title="Supprimer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        <button
          onClick={addLanguage}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue border border-dashed border-blue/30 rounded-[10px] hover:bg-blue-light transition-colors"
        >
          <Plus size={16} />
          Ajouter une langue
        </button>
      </div>
    </SectionBlock>
  )
}

export default LanguagesSection
