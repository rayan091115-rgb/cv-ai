'use client'

import { useCVStore } from '@/lib/cv-store'
import { GraduationCap, Plus, Trash2, Sparkles } from 'lucide-react'
import SectionBlock from '../SectionBlock'
import { useState } from 'react'

const EducationSection = () => {
  const education = useCVStore((s) => s.cv.education)
  const addEducation = useCVStore((s) => s.addEducation)
  const updateEducation = useCVStore((s) => s.updateEducation)
  const removeEducation = useCVStore((s) => s.removeEducation)
  const [improvingId, setImprovingId] = useState<string | null>(null)

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0'

  const handleImproveDetails = async (id: string, details: string) => {
    if (!details?.trim()) return
    setImprovingId(id)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improveBullet', text: details, level: 'improved' }),
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
        updateEducation(id, { details: result })
      }
    } catch {
      // silently fail
    } finally {
      setImprovingId(null)
    }
  }

  return (
    <SectionBlock id="educations" title="Formation" icon={<GraduationCap size={16} />}>
      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="p-3 border border-gray-200 rounded-[14px] bg-gray-50 space-y-2"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder="Diplôme"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                  placeholder="Établissement"
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                    placeholder="Année (ex: 2020-2023)"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                    placeholder="Ville"
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <textarea
                    value={edu.details || ''}
                    onChange={(e) => updateEducation(edu.id, { details: e.target.value })}
                    placeholder="Description, mentions, projets..."
                    rows={2}
                    className={`${inputClass} resize-none pr-9`}
                  />
                  <button
                    onClick={() => handleImproveDetails(edu.id, edu.details || '')}
                    disabled={improvingId === edu.id}
                    className="absolute right-2 top-2 p-1 text-blue hover:bg-blue-light rounded disabled:opacity-50"
                    title="Améliorer avec l'IA"
                  >
                    <Sparkles size={12} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeEducation(edu.id)}
                className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded mt-1"
                title="Supprimer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue border border-dashed border-blue/30 rounded-[10px] hover:bg-blue-light transition-colors"
        >
          <Plus size={16} />
          Ajouter une formation
        </button>
      </div>
    </SectionBlock>
  )
}

export default EducationSection
