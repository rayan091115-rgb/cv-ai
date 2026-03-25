import { NextRequest, NextResponse } from 'next/server'
import type { CVProfile } from '@/types/cv'

function cvToPlainText(cv: CVProfile): string {
  const lines: string[] = []
  lines.push(`${cv.personal.firstName} ${cv.personal.lastName}`.trim())
  if (cv.personal.targetRole) lines.push(cv.personal.targetRole)
  lines.push('')
  const contacts = [cv.personal.email, cv.personal.phone, cv.personal.city, cv.personal.linkedin].filter(Boolean)
  if (contacts.length) { lines.push(contacts.join(' | ')); lines.push('') }
  if (cv.summary) { lines.push('PROFIL'); lines.push(cv.summary); lines.push('') }
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
      lines.push('')
    })
  }
  if (cv.skills.length > 0) { lines.push('COMPÉTENCES'); lines.push(cv.skills.join(' • ')); lines.push('') }
  if (cv.languages.length > 0) {
    lines.push('LANGUES')
    cv.languages.forEach((l) => lines.push(`${l.language} – ${l.level}`))
    lines.push('')
  }
  if (cv.interests.length > 0) { lines.push("CENTRES D'INTÉRÊT"); lines.push(cv.interests.join(' • ')) }
  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cv, format } = body as { cv: CVProfile; format: 'txt' | 'print-trigger' }

    // TXT export (real)
    if (format === 'txt') {
      const text = cvToPlainText(cv)
      return new Response(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${cv.title || 'CV'}.txt"`,
        },
      })
    }

    // Pour PDF et DOCX, retourner un signal pour déclencher window.print() côté client
    return NextResponse.json({ action: 'print', message: 'Utilisez le bouton Imprimer' })
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'export." }, { status: 500 })
  }
}
