'use client'

import { useCVStore } from '@/lib/cv-store'
import { Briefcase, Plus, Sparkles, Trash2, Copy, GripVertical, X } from 'lucide-react'
import SectionBlock from '../SectionBlock'
import { useState } from 'react'

const ExperienceSection = () => {
  const experiences = useCVStore((s) => s.cv.experiences)
  const addExperience = useCVStore((s) => s.addExperience)
  const updateExperience = useCVStore((s) => s.updateExperience)
  const updateExperienceBullet = useCVStore((s) => s.updateExperienceBullet)
  const addBullet = useCVStore((s) => s.addBullet)
  const removeBullet = useCVStore((s) => s.removeBullet)
  const removeExperience = useCVStore((s) => s.removeExperience)
  const duplicateExperience = useCVStore((s) => s.duplicateExperience)

  const [generatingBullets, setGeneratingBullets] = useState<string | null>(null)

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0'

  const handleGenerateBullets = async (expId: string, title: string, company: string) => {
    if (!title) return
    setGeneratingBullets(expId)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateBulletsForExp', title, company, sector: '' }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.bullets) {
          updateExperience(expId, { bullets: data.bullets })
        }
      }
    } catch {
      // silently fail
    } finally {
      setGeneratingBullets(null)
    }
  }

  const handleImproveBullet = async (expId: string, bulletIdx: number, text: string) => {
    if (!text.trim()) return
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improveBullet', text, level: 'improved' }),
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
        updateExperienceBullet(expId, bulletIdx, result)
      }
    } catch {
      // silently fail
    }
  }

  return (
    <SectionBlock id="employment" title="Expériences" icon={<Briefcase size={16} />}>
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-3 border border-gray-200 rounded-[14px] bg-gray-50 space-y-3"
          >
            <div className="flex items-start gap-2">
              <div className="pt-2 cursor-grab text-gray-300 hover:text-gray-500">
                <GripVertical size={14} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                    placeholder="Intitulé du poste"
                    className={inputClass}
                  />
                </div>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="Entreprise"
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    placeholder="Date début"
                    className={inputClass}
                  />
                  <input
                    type="month"
                    value={exp.endDate === 'present' ? '' : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value || 'present' })}
                    placeholder="Date fin"
                    className={inputClass}
                    disabled={exp.endDate === 'present'}
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={exp.endDate === 'present'}
                    onChange={(e) =>
                      updateExperience(exp.id, { endDate: e.target.checked ? 'present' : '' })
                    }
                    className="rounded border-gray-300 text-blue focus:ring-blue"
                  />
                  Poste actuel
                </label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  placeholder="Ville"
                  className={inputClass}
                />

                {/* Bullets */}
                <div className="space-y-1.5">
                  {exp.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-gray-300 mt-2.5 text-xs">–</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateExperienceBullet(exp.id, idx, e.target.value)}
                        placeholder="Description de la réalisation..."
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        onClick={() => handleImproveBullet(exp.id, idx, bullet)}
                        className="mt-1.5 p-1 text-blue hover:bg-blue-light rounded"
                        title="Améliorer avec l'IA"
                      >
                        <Sparkles size={12} />
                      </button>
                      <button
                        onClick={() => removeBullet(exp.id, idx)}
                        className="mt-1.5 p-1 text-gray-400 hover:text-danger rounded"
                        title="Supprimer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addBullet(exp.id)}
                    className="text-xs text-blue hover:underline"
                  >
                    + Ajouter une ligne
                  </button>
                  <button
                    onClick={() => handleGenerateBullets(exp.id, exp.title, exp.company)}
                    disabled={generatingBullets === exp.id || !exp.title}
                    className="flex items-center gap-1 text-xs text-blue hover:underline disabled:opacity-50"
                  >
                    <Sparkles size={10} />
                    {generatingBullets === exp.id ? 'Génération...' : 'Générer des bullets'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <button
                  onClick={() => duplicateExperience(exp.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title="Dupliquer"
                >
                  <Copy size={13} />
                </button>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded"
                  title="Supprimer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue border border-dashed border-blue/30 rounded-[10px] hover:bg-blue-light transition-colors"
        >
          <Plus size={16} />
          Ajouter une expérience
        </button>
      </div>
    </SectionBlock>
  )
}

export default ExperienceSection
