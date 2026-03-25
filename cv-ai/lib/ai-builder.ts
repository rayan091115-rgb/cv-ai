import { GoogleGenerativeAI } from '@google/generative-ai'
import { PROMPTS } from './prompts-builder'
import type { CVProfile, AgentResponse, JobMatchResult, ATSReport } from '@/types/cv'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-3.1-flash-lite-preview'

async function streamText(prompt: string): Promise<ReadableStream<string>> {
  const model = genAI.getGenerativeModel({ model: MODEL })
  const result = await model.generateContentStream(prompt)
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(chunk.text())
      }
      controller.close()
    },
  })
}

async function generateJSON<T>(prompt: string): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: 'application/json' },
  })
  const result = await model.generateContent(prompt)
  return JSON.parse(result.response.text()) as T
}

export async function generateSummary(cv: CVProfile): Promise<ReadableStream<string>> {
  return streamText(PROMPTS.generateSummary(cv))
}

export async function improveBullet(
  text: string,
  level: 'conservative' | 'improved' | 'aggressive',
  role: string
): Promise<ReadableStream<string>> {
  return streamText(PROMPTS.improveBullet(text, level, role))
}

export async function generateBulletsForExp(
  title: string,
  company: string,
  sector: string
): Promise<{ bullets: string[] }> {
  return generateJSON<{ bullets: string[] }>(PROMPTS.generateBulletsForExp(title, company, sector))
}

export async function suggestSkills(cv: CVProfile): Promise<{ suggestions: string[] }> {
  return generateJSON<{ suggestions: string[] }>(PROMPTS.suggestSkills(cv))
}

export async function humanizeText(text: string): Promise<ReadableStream<string>> {
  return streamText(PROMPTS.humanizeText(text))
}

export async function shortenText(text: string): Promise<ReadableStream<string>> {
  return streamText(PROMPTS.shortenText(text))
}

export async function reformulateText(text: string): Promise<ReadableStream<string>> {
  return streamText(PROMPTS.reformulateText(text))
}

export async function translateText(text: string, targetLang: string): Promise<ReadableStream<string>> {
  return streamText(PROMPTS.translateText(text, targetLang))
}

export async function analyzeCV(cv: CVProfile): Promise<ReadableStream<string>> {
  return streamText(PROMPTS.fullATSReport(cv))
}

export async function adaptToJobOffer(cv: CVProfile, offer: string): Promise<JobMatchResult> {
  return generateJSON<JobMatchResult>(PROMPTS.adaptToJobOffer(cv, offer))
}

export async function fullATSReport(cv: CVProfile): Promise<ATSReport> {
  return generateJSON<ATSReport>(PROMPTS.fullATSReport(cv))
}

export async function agentExecute(cv: CVProfile, command: string): Promise<AgentResponse> {
  return generateJSON<AgentResponse>(PROMPTS.agentExecute(cv, command))
}

export async function suggestJobTitle(cv: CVProfile): Promise<{ suggestions: string[] }> {
  return generateJSON<{ suggestions: string[] }>(PROMPTS.suggestJobTitle(cv))
}

export async function parseCV(rawText: string): Promise<Partial<CVProfile>> {
  return generateJSON<Partial<CVProfile>>(PROMPTS.parseCV(rawText))
}

export { streamText, generateJSON }
