export type TemplateId = 'classic' | 'modern' | 'minimal' | 'tech' | 'creative' | 'executive' | 'academic' | 'parcoursup'
export type OptLevel = 'conservative' | 'improved' | 'aggressive'
export type CVMode = 'recruiter' | 'parcoursup' | 'ats-bot'

export interface PersonalInfo {
  firstName: string
  lastName: string
  targetRole: string
  email: string
  phone: string
  city: string
  zipcode?: string
  linkedin?: string
  github?: string
  website?: string
  photo?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate: string | 'present'
  bullets: string[]
  isVisible: boolean
}

export interface Education {
  id: string
  degree: string
  school: string
  location?: string
  year: string
  details?: string
  isVisible: boolean
}

export interface Language {
  id: string
  language: string
  level: string
}

export interface CVProfile {
  id: string
  title: string
  mode: CVMode
  templateId: TemplateId
  accentColor: string
  personal: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
  languages: Language[]
  interests: string[]
  createdAt: number
  updatedAt: number
}

export interface ATSScore {
  total: number
  breakdown: {
    sections: number
    format: number
    actionVerbs: number
    quantification: number
    keywords: number
  }
  suggestions: string[]
}

export interface AgentAction {
  type: 'UPDATE_FIELD' | 'UPDATE_EXPERIENCE_BULLET' | 'REPLACE_SKILLS' | 'UPDATE_SUMMARY' | 'ADD_EXPERIENCE' | 'ADD_EDUCATION' | 'UPDATE_INTERESTS'
  path?: string
  exp_index?: number
  bullet_index?: number
  value: string | string[] | Record<string, unknown>
}

export interface AgentResponse {
  understanding: string
  actions: AgentAction[]
  explanation: string
}

export interface JobMatchResult {
  keywords_missing: string[]
  keywords_present: string[]
  match_score_before: number
  match_score_after: number
  adapted_summary: string
  adapted_bullets: {
    original: string
    improved: string
    exp_index: number
    bullet_index: number
  }[]
}

export interface ATSReport {
  score: number
  strengths: string[]
  weaknesses: string[]
  quick_wins: string[]
  section_scores: {
    personal: number
    summary: number
    experiences: number
    skills: number
    format: number
  }
}
