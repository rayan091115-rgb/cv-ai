import { GoogleGenerativeAI } from '@google/generative-ai'
import { PROMPTS } from '@/lib/prompts-builder'
import { NextRequest, NextResponse } from 'next/server'
import type { CVProfile } from '@/types/cv'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3.1-flash-lite-preview'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, text, level, title, company, sector, cv } = body as {
      action: string
      text?: string
      level?: 'conservative' | 'improved' | 'aggressive'
      title?: string
      company?: string
      sector?: string
      cv?: CVProfile
    }

    // JSON response actions
    const jsonActions = ['generateBulletsForExp', 'suggestSkills', 'suggestJobTitle', 'suggestInterests', 'fullATSReport']

    if (jsonActions.includes(action)) {
      const model = genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: { responseMimeType: 'application/json' },
      })

      let prompt = ''
      switch (action) {
        case 'generateBulletsForExp':
          prompt = PROMPTS.generateBulletsForExp(title || '', company || '', sector || '')
          break
        case 'suggestSkills':
          prompt = PROMPTS.suggestSkills(cv || {} as CVProfile)
          break
        case 'suggestJobTitle':
          prompt = PROMPTS.suggestJobTitle(cv || {} as CVProfile)
          break
        case 'suggestInterests':
          prompt = `${PROMPTS.suggestSkills(cv || {} as CVProfile).replace('compétences pertinentes manquantes', "centres d'intérêt pertinents").replace('suggestions', 'suggestions')}`
          break
        case 'fullATSReport':
          prompt = PROMPTS.fullATSReport(cv || {} as CVProfile)
          break
        default:
          return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
      }

      const result = await model.generateContent(prompt)
      const data = JSON.parse(result.response.text())
      return NextResponse.json(data)
    }

    // Streaming response actions
    let prompt = ''
    switch (action) {
      case 'generateSummary':
        prompt = PROMPTS.generateSummary(cv || {} as CVProfile)
        break
      case 'improveBullet':
      case 'aggressiveBullet':
        prompt = PROMPTS.improveBullet(
          text || '',
          action === 'aggressiveBullet' ? 'aggressive' : (level || 'improved'),
          cv?.personal?.targetRole || ''
        )
        break
      case 'humanizeText':
      case 'humanizeAll':
        prompt = PROMPTS.humanizeText(text || '')
        break
      case 'shortenText':
        prompt = PROMPTS.shortenText(text || '')
        break
      case 'reformulateText':
        prompt = PROMPTS.reformulateText(text || '')
        break
      case 'translateEN':
        prompt = PROMPTS.translateText(text || '', 'en')
        break
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

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
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('AI Generate error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération. Vérifiez votre clé API.' },
      { status: 500 }
    )
  }
}
