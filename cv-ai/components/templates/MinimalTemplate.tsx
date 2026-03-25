'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface MinimalTemplateProps {
  isPreview?: boolean
}

const MinimalTemplate = memo(({ isPreview = false }: MinimalTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''

  return (
    <div className={`p-12 ${scale}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[36px] font-light text-gray-900 leading-tight">
          {cv.personal.firstName || 'Prénom'} {cv.personal.lastName || 'Nom'}
        </h1>
        {cv.personal.targetRole && (
          <p className="text-sm text-gray-500 mt-1">{cv.personal.targetRole}</p>
        )}
        <div className="flex gap-4 mt-3 text-[11px] text-gray-400">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>{cv.personal.phone}</span>}
          {cv.personal.city && <span>{cv.personal.city}</span>}
          {cv.personal.linkedin && <span>{cv.personal.linkedin}</span>}
        </div>
      </div>

      {/* Grid layout: label left 140px, content right */}
      {cv.summary && (
        <div className="flex gap-8 mb-6">
          <div className="w-[140px] shrink-0 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400 pt-0.5">
            Profil
          </div>
          <div className="flex-1">
            <p className="text-[12px] leading-relaxed text-gray-600">{cv.summary}</p>
          </div>
        </div>
      )}

      {cv.experiences.length > 0 && (
        <div className="flex gap-8 mb-6">
          <div className="w-[140px] shrink-0 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400 pt-0.5">
            Expériences
          </div>
          <div className="flex-1 space-y-4">
            {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-medium text-gray-900">{exp.title}</span>
                  <span className="text-[10px] text-gray-400 ml-3">
                    {exp.startDate} – {exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cv.education.length > 0 && (
        <div className="flex gap-8 mb-6">
          <div className="w-[140px] shrink-0 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400 pt-0.5">
            Formation
          </div>
          <div className="flex-1 space-y-3">
            {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-medium text-gray-900">{edu.degree}</span>
                  <span className="text-[10px] text-gray-400 ml-3">{edu.year}</span>
                </div>
                <p className="text-[11px] text-gray-500">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cv.skills.length > 0 && (
        <div className="flex gap-8 mb-6">
          <div className="w-[140px] shrink-0 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400 pt-0.5">
            Compétences
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-gray-600">{cv.skills.join(' · ')}</p>
          </div>
        </div>
      )}

      {cv.languages.length > 0 && (
        <div className="flex gap-8 mb-6">
          <div className="w-[140px] shrink-0 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400 pt-0.5">
            Langues
          </div>
          <div className="flex-1 flex flex-wrap gap-x-6 gap-y-1">
            {cv.languages.map((lang) => (
              <span key={lang.id} className="text-[12px] text-gray-600">
                {lang.language} <span className="text-gray-400">({lang.level})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {cv.interests.length > 0 && (
        <div className="flex gap-8">
          <div className="w-[140px] shrink-0 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400 pt-0.5">
            Intérêts
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-gray-600">{cv.interests.join(' · ')}</p>
          </div>
        </div>
      )}
    </div>
  )
})

MinimalTemplate.displayName = 'MinimalTemplate'
export default MinimalTemplate
