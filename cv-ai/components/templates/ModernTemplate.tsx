'use client'

import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

interface ModernTemplateProps {
  isPreview?: boolean
}

const ModernTemplate = memo(({ isPreview = false }: ModernTemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const accentColor = useCVStore((s) => s.accentColor)
  const scale = isPreview ? 'scale-[0.2] origin-top-left' : ''

  return (
    <div className={`flex min-h-full ${scale}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar 32% */}
      <div className="w-[32%] p-6 text-white" style={{ backgroundColor: accentColor }}>
        {/* Photo placeholder */}
        <div className="w-24 h-24 mx-auto rounded-full bg-white/20 mb-4 flex items-center justify-center text-3xl font-bold text-white/60">
          {cv.personal.firstName?.[0] || ''}{cv.personal.lastName?.[0] || ''}
        </div>

        <h1 className="text-lg font-bold text-center leading-tight">
          {cv.personal.firstName || 'Prénom'} {cv.personal.lastName || 'Nom'}
        </h1>
        {cv.personal.targetRole && (
          <p className="text-xs text-center opacity-80 mt-1">{cv.personal.targetRole}</p>
        )}

        {/* Contact */}
        <div className="mt-6 space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70">Contact</h3>
          <div className="space-y-1.5 text-[11px] opacity-90">
            {cv.personal.email && <p>{cv.personal.email}</p>}
            {cv.personal.phone && <p>{cv.personal.phone}</p>}
            {cv.personal.city && <p>{cv.personal.city}</p>}
            {cv.personal.linkedin && <p>{cv.personal.linkedin}</p>}
            {cv.personal.github && <p>{cv.personal.github}</p>}
          </div>
        </div>

        {/* Skills with bars */}
        {cv.skills.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70">Compétences</h3>
            <div className="space-y-2">
              {cv.skills.map((skill, i) => (
                <div key={i}>
                  <span className="text-[11px]">{skill}</span>
                  <div className="w-full h-1 bg-white/20 rounded-full mt-0.5">
                    <div className="h-full bg-white/70 rounded-full" style={{ width: `${80 - i * 5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70">Langues</h3>
            <div className="space-y-1">
              {cv.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-[11px]">
                  <span>{lang.language}</span>
                  <span className="opacity-70">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {cv.interests.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[2px] opacity-70">Intérêts</h3>
            <div className="flex flex-wrap gap-1">
              {cv.interests.map((interest, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] bg-white/15 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content 68% */}
      <div className="w-[68%] p-8">
        {/* Summary */}
        {cv.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] mb-2" style={{ color: accentColor }}>
              Profil
            </h2>
            <p className="text-[12px] leading-relaxed text-gray-700">{cv.summary}</p>
          </section>
        )}

        {/* Experience */}
        {cv.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: accentColor }}>
              Expériences
            </h2>
            {cv.experiences.filter((e) => e.isVisible !== false).map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-semibold text-gray-900">{exp.title}</span>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-3">
                    {exp.startDate} – {exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}
                  </span>
                </div>
                {exp.company && <p className="text-[11px] text-gray-500">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>}
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-3 relative before:content-['•'] before:absolute before:left-0" style={{ color: undefined }}>
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
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: accentColor }}>
              Formation
            </h2>
            {cv.education.filter((e) => e.isVisible !== false).map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-semibold text-gray-900">{edu.degree}</span>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-3">{edu.year}</span>
                </div>
                <p className="text-[11px] text-gray-500">{edu.school}{edu.location ? ` • ${edu.location}` : ''}</p>
                {edu.details && <p className="text-[11px] text-gray-600 mt-0.5">{edu.details}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
})

ModernTemplate.displayName = 'ModernTemplate'
export default ModernTemplate
