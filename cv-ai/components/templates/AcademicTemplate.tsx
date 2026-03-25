'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface AcademicTemplateProps {
  isPreview?: boolean
}

const AcademicTemplate = memo(({ isPreview = false }: AcademicTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''

  return (
    <div className={`p-10 ${scale}`} style={{ fontFamily: '"EB Garamond", "Times New Roman", serif' }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-[26px] font-normal text-gray-900">
          {cv.personal.firstName || 'Prénom'} {cv.personal.lastName || 'Nom'}
        </h1>
        {cv.personal.targetRole && (
          <p className="text-[13px] italic text-gray-600 mt-0.5">{cv.personal.targetRole}</p>
        )}
        <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-gray-500">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>• {cv.personal.phone}</span>}
          {cv.personal.city && <span>• {cv.personal.city}</span>}
          {cv.personal.linkedin && <span>• {cv.personal.linkedin}</span>}
          {cv.personal.github && <span>• {cv.personal.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-1 border-b border-gray-300 pb-1">
            Résumé
          </h2>
          <p className="text-[12px] leading-relaxed text-gray-700 mt-2">{cv.summary}</p>
        </section>
      )}

      {/* Education first for academic */}
      {cv.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-1 border-b border-gray-300 pb-1">
            Formation
          </h2>
          <div className="mt-2 space-y-3">
            {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-semibold text-gray-900">{edu.degree}</span>
                  <span className="text-[11px] text-gray-500 ml-3">{edu.year}</span>
                </div>
                <p className="text-[11px] text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.details && <p className="text-[11px] text-gray-600 mt-0.5 italic">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {cv.experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-1 border-b border-gray-300 pb-1">
            Expérience de Recherche & Professionnelle
          </h2>
          <div className="mt-2 space-y-3">
            {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[12px] font-semibold text-gray-900">{exp.title}</span>
                    {exp.company && <span className="text-[12px] text-gray-600">, {exp.company}</span>}
                  </div>
                  <span className="text-[11px] text-gray-500 shrink-0 ml-3">
                    {exp.startDate} – {exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-[10px] text-gray-500">{exp.location}</p>}
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-1 border-b border-gray-300 pb-1">
            Compétences
          </h2>
          <p className="text-[12px] text-gray-700 mt-2">{cv.skills.join(' • ')}</p>
        </section>
      )}

      {/* Languages */}
      {cv.languages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-1 border-b border-gray-300 pb-1">
            Langues
          </h2>
          <div className="flex flex-wrap gap-x-6 mt-2">
            {cv.languages.map((lang) => (
              <span key={lang.id} className="text-[12px] text-gray-700">
                {lang.language} — {lang.level}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {cv.interests.length > 0 && (
        <section>
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-1 border-b border-gray-300 pb-1">
            Centres d&apos;intérêt
          </h2>
          <p className="text-[12px] text-gray-700 mt-2">{cv.interests.join(' • ')}</p>
        </section>
      )}
    </div>
  )
})

AcademicTemplate.displayName = 'AcademicTemplate'
export default AcademicTemplate
