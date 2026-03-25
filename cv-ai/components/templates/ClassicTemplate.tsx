'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface ClassicTemplateProps {
  isPreview?: boolean
}

const ClassicTemplate = memo(({ isPreview = false }: ClassicTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''

  return (
    <div className={`p-10 font-serif text-gray-900 ${scale}`} style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-[28px] font-bold tracking-wide text-gray-900">
          {cv.personal.firstName || 'Prénom'} {cv.personal.lastName || 'Nom'}
        </h1>
        {cv.personal.targetRole && (
          <p className="text-sm text-gray-600 mt-1">{cv.personal.targetRole}</p>
        )}
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>• {cv.personal.phone}</span>}
          {cv.personal.city && <span>• {cv.personal.city}{cv.personal.zipcode ? `, ${cv.personal.zipcode}` : ''}</span>}
          {cv.personal.linkedin && <span>• {cv.personal.linkedin}</span>}
          {cv.personal.github && <span>• {cv.personal.github}</span>}
        </div>
        <div className="mt-3 border-t border-gray-300" />
      </div>

      {/* Summary */}
      {cv.summary && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-700 mb-2">Profil</h2>
          <div className="border-b border-gray-200 mb-2" />
          <p className="text-[13px] leading-relaxed text-gray-700">{cv.summary}</p>
        </section>
      )}

      {/* Experience */}
      {cv.experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-700 mb-2">Expériences Professionnelles</h2>
          <div className="border-b border-gray-200 mb-3" />
          {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[13px] font-bold text-gray-900">{exp.title || 'Poste'}</span>
                  {exp.company && <span className="text-[13px] text-gray-600"> – {exp.company}</span>}
                </div>
                <span className="text-[11px] text-gray-500 shrink-0 ml-4">
                  {exp.startDate} – {exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}
                </span>
              </div>
              {exp.location && <p className="text-[11px] text-gray-500">{exp.location}</p>}
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[12px] text-gray-700 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">
                      {bullet}
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
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-700 mb-2">Formation</h2>
          <div className="border-b border-gray-200 mb-3" />
          {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[13px] font-bold text-gray-900">{edu.degree || 'Diplôme'}</span>
                  {edu.school && <span className="text-[13px] text-gray-600"> – {edu.school}</span>}
                </div>
                <span className="text-[11px] text-gray-500 shrink-0 ml-4">{edu.year}</span>
              </div>
              {edu.location && <p className="text-[11px] text-gray-500">{edu.location}</p>}
              {edu.details && <p className="text-[12px] text-gray-600 mt-1">{edu.details}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-700 mb-2">Compétences</h2>
          <div className="border-b border-gray-200 mb-2" />
          <p className="text-[12px] text-gray-700">{cv.skills.join(' • ')}</p>
        </section>
      )}

      {/* Languages */}
      {cv.languages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-700 mb-2">Langues</h2>
          <div className="border-b border-gray-200 mb-2" />
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {cv.languages.map((lang) => (
              <span key={lang.id} className="text-[12px] text-gray-700">
                {lang.language} – <span className="text-gray-500">{lang.level}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {cv.interests.length > 0 && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-700 mb-2">Centres d&apos;intérêt</h2>
          <div className="border-b border-gray-200 mb-2" />
          <p className="text-[12px] text-gray-700">{cv.interests.join(' • ')}</p>
        </section>
      )}
    </div>
  )
})

ClassicTemplate.displayName = 'ClassicTemplate'
export default ClassicTemplate
