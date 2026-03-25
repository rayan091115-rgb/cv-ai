import { GoogleGenerativeAI } from '@google/generative-ai'
import { PROMPTS } from '@/lib/prompts-builder'
import { NextRequest, NextResponse } from 'next/server'
import type { CVProfile } from '@/types/cv'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3.1-flash-lite-preview'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobOffer, cv } = body as { jobOffer: string; cv?: CVProfile }

    if (!jobOffer) {
      return NextResponse.json({ error: 'Offre manquante' }, { status: 400 })
    }

    const prompt = PROMPTS.adaptToJobOffer(cv || {} as CVProfile, jobOffer)

    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { responseMimeType: 'application/json' },
    })

    const result = await model.generateContent(prompt)
    const data = JSON.parse(result.response.text())

    return NextResponse.json(data)
  } catch (error) {
    console.error('Job match error:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'analyse de l'offre." },
      { status: 500 }
    )
  }
}
