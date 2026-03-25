'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface ParcoursupTemplateProps {
  isPreview?: boolean
}

const ParcoursupTemplate = memo(({ isPreview = false }: ParcoursupTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''

  return (
    <div className={`p-8 ${scale}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header sobre */}
      <div className="mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-[22px] font-semibold text-gray-900">
          {cv.personal.firstName || 'Prénom'} {cv.personal.lastName || 'Nom'}
        </h1>
        <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-500">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>• {cv.personal.phone}</span>}
          {cv.personal.city && <span>• {cv.personal.city}</span>}
        </div>
      </div>

      {/* Formation */}
      {cv.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
            Formation
          </h2>
          <div className="ml-7 space-y-2">
            {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[12px] font-semibold text-gray-900">{edu.degree}</span>
                  <span className="text-[10px] text-gray-500 ml-3">{edu.year}</span>
                </div>
                <p className="text-[11px] text-gray-600">{edu.school}{edu.location ? ` · ${edu.location}` : ''}</p>
                {edu.details && <p className="text-[11px] text-gray-500 mt-0.5">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Compétences */}
      {cv.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">2</span>
            Compétences
          </h2>
          <div className="ml-7 flex flex-wrap gap-1.5">
            {cv.skills.map((skill, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-700 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Expériences */}
      {cv.experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">3</span>
            Expériences
          </h2>
          <div className="ml-7 space-y-3">
            {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[12px] font-semibold text-gray-900">{exp.title}</span>
                  <span className="text-[10px] text-gray-500 ml-3">
                    {exp.startDate} – {exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">{exp.company}</p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">
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

      {/* Langues */}
      {cv.languages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">4</span>
            Langues
          </h2>
          <div className="ml-7 flex flex-wrap gap-4">
            {cv.languages.map((lang) => (
              <span key={lang.id} className="text-[12px] text-gray-700">
                {lang.language} – <span className="text-gray-500">{lang.level}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Centres d'intérêt */}
      {cv.interests.length > 0 && (
        <section>
          <h2 className="text-[12px] font-bold uppercase tracking-[2px] text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">5</span>
            Centres d&apos;intérêt
          </h2>
          <div className="ml-7">
            <p className="text-[12px] text-gray-700">{cv.interests.join(' · ')}</p>
          </div>
        </section>
      )}

      {cv.summary && (
        <section className="mt-5 pt-4 border-t border-gray-200">
          <p className="text-[11px] italic text-gray-500">{cv.summary}</p>
        </section>
      )}
    </div>
  )
})

ParcoursupTemplate.displayName = 'ParcoursupTemplate'
export default ParcoursupTemplate
