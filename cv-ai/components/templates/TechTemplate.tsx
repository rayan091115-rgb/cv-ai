'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface TechTemplateProps {
  isPreview?: boolean
}

const TechTemplate = memo(({ isPreview = false }: TechTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''

  return (
    <div className={`${scale}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dark header */}
      <div className="bg-gray-900 px-10 py-8 text-white">
        <h1 className="text-[28px] font-bold">
          {cv.personal.firstName || 'Prénom'} {cv.personal.lastName || 'Nom'}
        </h1>
        {cv.personal.targetRole && (
          <p className="text-[14px] mt-1" style={{ color: '#10B981' }}>{cv.personal.targetRole}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-gray-400">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>| {cv.personal.phone}</span>}
          {cv.personal.city && <span>| {cv.personal.city}</span>}
          {cv.personal.linkedin && <span>| {cv.personal.linkedin}</span>}
          {cv.personal.github && (
            <span className="text-green-400">| {cv.personal.github}</span>
          )}
        </div>
      </div>

      <div className="px-10 py-8">
        {/* Summary */}
        {cv.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-gray-900 mb-2">
              &gt; Profil
            </h2>
            <p className="text-[12px] leading-relaxed text-gray-600">{cv.summary}</p>
          </section>
        )}

        {/* Skills as chips */}
        {cv.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-gray-900 mb-2">
              &gt; Stack technique
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {cv.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] font-mono bg-gray-100 text-gray-800 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {cv.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-gray-900 mb-3">
              &gt; Expériences
            </h2>
            {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-semibold text-gray-900">{exp.title}</span>
                  <span className="text-[10px] text-gray-500 font-mono ml-3">
                    {exp.startDate} → {exp.endDate === 'present' ? 'now' : exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-4 relative">
                        <span className="absolute left-0 text-green-500">→</span>
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
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-gray-900 mb-3">
              &gt; Formation
            </h2>
            {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-medium text-gray-900">{edu.degree}</span>
                  <span className="text-[10px] text-gray-500 font-mono ml-3">{edu.year}</span>
                </div>
                <p className="text-[11px] text-gray-500">{edu.school}</p>
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-gray-900 mb-2">
              &gt; Langues
            </h2>
            <div className="flex gap-4">
              {cv.languages.map((lang) => (
                <span key={lang.id} className="text-[12px] text-gray-600">
                  {lang.language} <span className="font-mono text-green-600">({lang.level})</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {cv.interests.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-gray-900 mb-2">
              &gt; Extras
            </h2>
            <p className="text-[12px] text-gray-600">{cv.interests.join(' · ')}</p>
          </section>
        )}
      </div>
    </div>
  )
})

TechTemplate.displayName = 'TechTemplate'
export default TechTemplate
