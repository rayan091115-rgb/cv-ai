// app/api/ai/generate/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PROMPTS, SYSTEM } from '@/lib/prompts-builder'
import { NextRequest, NextResponse } from 'next/server'
import type { CVProfile } from '@/types/cv'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3.1-flash-lite-preview'

function safeCV(cv: unknown): CVProfile {
  const base: CVProfile = {
    id: '', title: '', mode: 'recruiter', templateId: 'classic', accentColor: '#2563EB',
    personal: { firstName: '', lastName: '', targetRole: '', email: '', phone: '', city: '' },
    summary: '', experiences: [], education: [], skills: [], languages: [], interests: [],
    createdAt: 0, updatedAt: 0,
  }
  if (!cv || typeof cv !== 'object') return base
  return { ...base, ...(cv as Partial<CVProfile>) }
}

async function streamResponse(prompt: string) {
  const model = genAI.getGenerativeModel({ model: MODEL })
  const result = await model.generateContentStream(prompt)
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()))
      }
      controller.close()
    },
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}

async function jsonResponse<T>(prompt: string): Promise<NextResponse<T>> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: 'application/json' },
  })
  const result = await model.generateContent(prompt)
  const data = JSON.parse(result.response.text()) as T
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      action, text, level, title, company, sector, cv: rawCV,
    } = body as {
      action: string; text?: string; level?: 'conservative' | 'improved' | 'aggressive'
      title?: string; company?: string; sector?: string; cv?: unknown
    }

    const cv = safeCV(rawCV)

    switch (action) {
      // ── JSON actions ──
      case 'generateBulletsForExp':
        return jsonResponse(PROMPTS.generateBulletsForExp(title || '', company || '', sector || ''))

      case 'suggestSkills':
        return jsonResponse(PROMPTS.suggestSkills(cv))

      case 'suggestJobTitle':
        return jsonResponse(PROMPTS.suggestJobTitle(cv))

      case 'suggestInterests':
        return jsonResponse(`${SYSTEM}
Suggère 8 centres d'intérêt pertinents pour un profil "${cv.personal.targetRole || 'professionnel'}".
Secteur : ${cv.experiences[0]?.company || 'général'}.
Centres actuels : ${cv.interests.join(', ') || 'aucun'}.
Réponds en JSON : { "suggestions": ["...", ...] }`)

      case 'fullATSReport':
        return jsonResponse(PROMPTS.fullATSReport(cv))

      // ── Streaming actions ──
      case 'generateSummary':
        return streamResponse(PROMPTS.generateSummary(cv))

      case 'improveBullet':
        return streamResponse(PROMPTS.improveBullet(text || '', level || 'improved', cv.personal.targetRole || ''))

      case 'aggressiveBullet':
        return streamResponse(PROMPTS.improveBullet(text || '', 'aggressive', cv.personal.targetRole || ''))

      case 'humanizeText':
        return streamResponse(PROMPTS.humanizeText(text || ''))

      case 'shortenText':
        return streamResponse(PROMPTS.shortenText(text || ''))

      case 'reformulateText':
        return streamResponse(PROMPTS.reformulateText(text || ''))

      case 'translateEN':
        return streamResponse(PROMPTS.translateText(text || '', 'en'))

      // ── Nouvelles actions ──
      case 'humanizeAll': {
        const parts: string[] = []
        if (cv.summary) parts.push(`ACCROCHE:\n${cv.summary}`)
        cv.experiences.forEach((e, i) => {
          if (e.bullets.filter(Boolean).length > 0)
            parts.push(`EXP ${i} (${e.title}):\n${e.bullets.filter(Boolean).join('\n')}`)
        })
        const combined = parts.join('\n\n')
        return streamResponse(`${SYSTEM}
Humanise TOUT ce texte de CV pour qu'il semble 100% écrit par un humain.
Supprime tout style IA. Garde le sens et la structure exacte.
Réponds avec le texte humanisé en gardant les mêmes séparateurs (ACCROCHE:, EXP N:).
---
${combined}`)
      }

      case 'generateAllBullets': {
        const expsWithoutBullets = cv.experiences
          .filter(e => e.bullets.filter(Boolean).length === 0 && e.title)
          .map(e => `${e.title} chez ${e.company}`)
        if (expsWithoutBullets.length === 0)
          return NextResponse.json({ message: 'Toutes les expériences ont déjà des descriptions.' })
        return jsonResponse(`${SYSTEM}
Génère 3 bullets percutants pour chacune de ces expériences :
${expsWithoutBullets.map((e, i) => `${i + 1}. ${e}`).join('\n')}
Réponds en JSON : { "results": [{ "exp_index": 0, "bullets": ["...", "...", "..."] }] }`)
      }

      case 'optimizeCV': {
        const optLevel = level || 'improved'
        const allBullets = cv.experiences.flatMap((e, ei) =>
          e.bullets.filter(Boolean).map((b, bi) => ({ ei, bi, text: b }))
        )
        return jsonResponse(`${SYSTEM}
Optimise tous ces bullets de CV pour le poste "${cv.personal.targetRole}".
Niveau : ${optLevel === 'conservative' ? 'CONSERVATEUR' : optLevel === 'improved' ? 'AMÉLIORÉ' : 'AGRESSIF'}
Bullets :
${allBullets.map((b, i) => `${i}. [exp:${b.ei} bullet:${b.bi}] "${b.text}"`).join('\n')}
Réponds en JSON : { "optimized": [{ "exp_index": 0, "bullet_index": 0, "text": "..." }] }`)
      }

      default:
        return NextResponse.json({ error: `Action inconnue: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Generate error:', error)
    return NextResponse.json(
      { error: 'Erreur IA. Vérifiez votre clé GOOGLE_AI_API_KEY dans .env.local' },
      { status: 500 }
    )
  }
}

