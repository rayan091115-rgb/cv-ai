'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface CreativeTemplateProps {
  isPreview?: boolean
}

const CreativeTemplate = memo(({ isPreview = false }: CreativeTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const accentColor = useCVStore((s) => s.accentColor)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''

  return (
    <div className={`relative min-h-full ${scale}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Color block left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[30%]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10 p-10">
        {/* Name overlapping */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-white leading-tight" style={{ maxWidth: '60%' }}>
            {cv.personal.firstName || 'Prénom'}
            <br />
            {cv.personal.lastName || 'Nom'}
          </h1>
          {cv.personal.targetRole && (
            <p className="text-sm text-white/70 mt-1" style={{ maxWidth: '28%' }}>
              {cv.personal.targetRole}
            </p>
          )}
        </div>

        {/* Contact in left column */}
        <div className="flex gap-8">
          <div className="w-[26%] space-y-6">
            <div className="text-white text-[11px] space-y-1.5">
              <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70 mb-2">Contact</h3>
              {cv.personal.email && <p>{cv.personal.email}</p>}
              {cv.personal.phone && <p>{cv.personal.phone}</p>}
              {cv.personal.city && <p>{cv.personal.city}</p>}
              {cv.personal.linkedin && <p>{cv.personal.linkedin}</p>}
            </div>

            {cv.skills.length > 0 && (
              <div className="text-white">
                <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70 mb-2">Compétences</h3>
                <div className="space-y-1">
                  {cv.skills.map((s, i) => (
                    <p key={i} className="text-[11px]">{s}</p>
                  ))}
                </div>
              </div>
            )}

            {cv.languages.length > 0 && (
              <div className="text-white">
                <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70 mb-2">Langues</h3>
                {cv.languages.map((l) => (
                  <p key={l.id} className="text-[11px]">{l.language} — {l.level}</p>
                ))}
              </div>
            )}

            {cv.interests.length > 0 && (
              <div className="text-white">
                <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70 mb-2">Intérêts</h3>
                {cv.interests.map((interest, i) => (
                  <p key={i} className="text-[11px]">{interest}</p>
                ))}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 pl-4">
            {cv.summary && (
              <section className="mb-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[2px] mb-2" style={{ color: accentColor }}>
                  Profil
                </h2>
                <p className="text-[12px] leading-relaxed text-gray-700">{cv.summary}</p>
              </section>
            )}

            {/* Timeline experiences */}
            {cv.experiences.length > 0 && (
              <section className="mb-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: accentColor }}>
                  Expériences
                </h2>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-1 bottom-1 w-px" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
                  {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
                    <div key={exp.id} className="mb-4 relative">
                      <div className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
                      <div className="ml-3">
                        <span className="text-[13px] font-semibold text-gray-900">{exp.title}</span>
                        <p className="text-[11px] text-gray-500">
                          {exp.company} · {exp.startDate} – {exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}
                        </p>
                        {exp.bullets.filter(Boolean).length > 0 && (
                          <ul className="mt-1 space-y-0.5">
                            {exp.bullets.filter(Boolean).map((b, i) => (
                              <li key={i} className="text-[11px] text-gray-600 pl-2 relative before:content-['·'] before:absolute before:left-0 before:text-gray-400">
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {cv.education.length > 0 && (
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: accentColor }}>
                  Formation
                </h2>
                {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <span className="text-[13px] font-medium text-gray-900">{edu.degree}</span>
                    <p className="text-[11px] text-gray-500">{edu.school} · {edu.year}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

CreativeTemplate.displayName = 'CreativeTemplate'
export default CreativeTemplate
