'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface ExecutiveTemplateProps {
  isPreview?: boolean
}

const ExecutiveTemplate = memo(({ isPreview = false }: ExecutiveTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const accentColor = useCVStore((s) => s.accentColor)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''
  const color = accentColor || '#1B3A6B'

  return (
    <div className={`p-10 ${scale}`} style={{ fontFamily: 'Georgia, "Palatino Linotype", serif' }}>
      {/* Header with double rule */}
      <div className="text-center mb-1">
        <div className="border-t-2 mb-3" style={{ borderColor: color }} />
        <h1 className="text-[24px] font-normal tracking-[4px] uppercase" style={{ color }}>
          {cv.personal.firstName || 'Prénom'} {cv.personal.lastName || 'Nom'}
        </h1>
        {cv.personal.targetRole && (
          <p className="text-[12px] text-gray-600 mt-1 tracking-wide">{cv.personal.targetRole}</p>
        )}
        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-gray-500">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>| {cv.personal.phone}</span>}
          {cv.personal.city && <span>| {cv.personal.city}</span>}
          {cv.personal.linkedin && <span>| {cv.personal.linkedin}</span>}
        </div>
        <div className="border-t-2 mt-3" style={{ borderColor: color }} />
      </div>

      {/* Summary */}
      {cv.summary && (
        <section className="mb-4 mt-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[3px] mb-1.5" style={{ color }}>
            Résumé Exécutif
          </h2>
          <p className="text-[11px] leading-relaxed text-gray-700">{cv.summary}</p>
        </section>
      )}

      {/* Experience */}
      {cv.experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[3px] mb-2" style={{ color }}>
            Expérience Professionnelle
          </h2>
          <div className="border-t mb-2" style={{ borderColor: color, opacity: 0.3 }} />
          {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[12px] font-bold text-gray-900">{exp.title}</span>
                  {exp.company && <span className="text-[12px] text-gray-600">, {exp.company}</span>}
                </div>
                <span className="text-[10px] text-gray-500 shrink-0 ml-3">
                  {exp.startDate} – {exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}
                </span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {cv.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[3px] mb-2" style={{ color }}>
            Formation
          </h2>
          <div className="border-t mb-2" style={{ borderColor: color, opacity: 0.3 }} />
          {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
            <div key={edu.id} className="mb-2 flex justify-between items-baseline">
              <div>
                <span className="text-[12px] font-bold text-gray-900">{edu.degree}</span>
                {edu.school && <span className="text-[12px] text-gray-600">, {edu.school}</span>}
              </div>
              <span className="text-[10px] text-gray-500 ml-3">{edu.year}</span>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[3px] mb-1.5" style={{ color }}>
            Compétences Clés
          </h2>
          <div className="border-t mb-2" style={{ borderColor: color, opacity: 0.3 }} />
          <p className="text-[11px] text-gray-700">{cv.skills.join(' • ')}</p>
        </section>
      )}

      {/* Languages & Interests on same line */}
      <div className="flex gap-12">
        {cv.languages.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[3px] mb-1" style={{ color }}>
              Langues
            </h2>
            <div className="flex gap-4">
              {cv.languages.map((l) => (
                <span key={l.id} className="text-[11px] text-gray-700">{l.language} ({l.level})</span>
              ))}
            </div>
          </section>
        )}
        {cv.interests.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[3px] mb-1" style={{ color }}>
              Intérêts
            </h2>
            <p className="text-[11px] text-gray-700">{cv.interests.join(' • ')}</p>
          </section>
        )}
      </div>
    </div>
  )
})

ExecutiveTemplate.displayName = 'ExecutiveTemplate'
export default ExecutiveTemplate
