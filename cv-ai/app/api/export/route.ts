import { NextRequest, NextResponse } from 'next/server'
import type { CVProfile } from '@/types/cv'

function cvToPlainText(cv: CVProfile): string {
  const lines: string[] = []

  lines.push(`${cv.personal.firstName} ${cv.personal.lastName}`)
  if (cv.personal.targetRole) lines.push(cv.personal.targetRole)
  lines.push('')

  const contacts: string[] = []
  if (cv.personal.email) contacts.push(cv.personal.email)
  if (cv.personal.phone) contacts.push(cv.personal.phone)
  if (cv.personal.city) contacts.push(cv.personal.city)
  if (cv.personal.linkedin) contacts.push(cv.personal.linkedin)
  if (cv.personal.github) contacts.push(cv.personal.github)
  if (contacts.length) { lines.push(contacts.join(' | ')); lines.push('') }

  if (cv.summary) {
    lines.push('PROFIL')
    lines.push(cv.summary)
    lines.push('')
  }

  if (cv.experiences.length > 0) {
    lines.push('EXPÉRIENCES PROFESSIONNELLES')
    cv.experiences.forEach((exp) => {
      lines.push(`${exp.title}${exp.company ? ` – ${exp.company}` : ''}`)
      lines.push(`${exp.startDate} – ${exp.endDate === 'present' ? "Aujourd'hui" : exp.endDate}`)
      exp.bullets.filter(Boolean).forEach((b) => lines.push(`  – ${b}`))
      lines.push('')
    })
  }

  if (cv.education.length > 0) {
    lines.push('FORMATION')
    cv.education.forEach((edu) => {
      lines.push(`${edu.degree}${edu.school ? ` – ${edu.school}` : ''} (${edu.year})`)
      if (edu.details) lines.push(`  ${edu.details}`)
      lines.push('')
    })
  }

  if (cv.skills.length > 0) {
    lines.push('COMPÉTENCES')
    lines.push(cv.skills.join(' • '))
    lines.push('')
  }

  if (cv.languages.length > 0) {
    lines.push('LANGUES')
    cv.languages.forEach((l) => lines.push(`${l.language} – ${l.level}`))
    lines.push('')
  }

  if (cv.interests.length > 0) {
    lines.push("CENTRES D'INTÉRÊT")
    lines.push(cv.interests.join(' • '))
  }

  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cv, format } = body as { cv: CVProfile; format: 'pdf' | 'docx' | 'txt' }

    if (format === 'txt') {
      const text = cvToPlainText(cv)
      return new Response(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${cv.title || 'CV'}.txt"`,
        },
      })
    }

    if (format === 'pdf') {
      // For PDF, we return the text content as a simple formatted response
      // In production, you would use @react-pdf/renderer on the server
      const text = cvToPlainText(cv)
      return new Response(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${cv.title || 'CV'}.txt"`,
        },
      })
    }

    if (format === 'docx') {
      // Simple text export for DOCX — in production use the `docx` library
      const text = cvToPlainText(cv)
      return new Response(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${cv.title || 'CV'}.txt"`,
        },
      })
    }

    return NextResponse.json({ error: 'Format non supporté' }, { status: 400 })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: "Erreur lors de l'export." }, { status: 500 })
  }
}
