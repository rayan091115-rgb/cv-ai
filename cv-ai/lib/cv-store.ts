'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { CVProfile, TemplateId, Experience, Education, Language } from '@/types/cv'

const MAX_HISTORY = 50

const defaultPersonal = {
  firstName: '',
  lastName: '',
  targetRole: '',
  email: '',
  phone: '',
  city: '',
  zipcode: '',
  linkedin: '',
  github: '',
  website: '',
  photo: '',
}

const defaultCV: CVProfile = {
  id: uuid(),
  title: 'CV sans titre',
  mode: 'recruiter',
  templateId: 'classic',
  accentColor: '#2563EB',
  personal: defaultPersonal,
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

interface CVStore {
  cv: CVProfile
  activeSection: string
  activeTemplate: TemplateId
  accentColor: string
  zoom: number
  isAIPanelOpen: boolean
  isAgentOpen: boolean
  isGenerating: boolean
  generatingField: string | null
  history: CVProfile[]
  historyIndex: number

  setActiveSection: (section: string) => void
  setTemplate: (id: TemplateId) => void
  setAccentColor: (color: string) => void
  setZoom: (zoom: number) => void

  updatePersonal: (data: Partial<CVProfile['personal']>) => void
  updateSummary: (text: string) => void

  addExperience: () => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  updateExperienceBullet: (expId: string, bulletIdx: number, text: string) => void
  addBullet: (expId: string) => void
  removeBullet: (expId: string, bulletIdx: number) => void
  removeExperience: (id: string) => void
  reorderExperiences: (from: number, to: number) => void
  duplicateExperience: (id: string) => void

  addEducation: () => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void

  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void

  addLanguage: () => void
  updateLanguage: (id: string, data: Partial<Language>) => void
  removeLanguage: (id: string) => void

  updateInterests: (interests: string[]) => void

  toggleAIPanel: () => void
  toggleAgent: () => void
  setGenerating: (field: string | null) => void

  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  importCV: (profile: Partial<CVProfile>) => void
  resetCV: () => void
  updateTitle: (title: string) => void
}

function pushHistory(state: { history: CVProfile[]; historyIndex: number; cv: CVProfile }) {
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(JSON.parse(JSON.stringify(state.cv)))
  if (newHistory.length > MAX_HISTORY) newHistory.shift()
  return { history: newHistory, historyIndex: newHistory.length - 1 }
}

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      cv: defaultCV,
      activeSection: 'personal',
      activeTemplate: 'classic',
      accentColor: '#2563EB',
      zoom: 0.75,
      isAIPanelOpen: false,
      isAgentOpen: false,
      isGenerating: false,
      generatingField: null,
      history: [JSON.parse(JSON.stringify(defaultCV))],
      historyIndex: 0,

      setActiveSection: (section) => set({ activeSection: section }),

      setTemplate: (id) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            activeTemplate: id,
            cv: { ...s.cv, templateId: id, updatedAt: Date.now() },
          }
        }),

      setAccentColor: (color) =>
        set((s) => ({
          accentColor: color,
          cv: { ...s.cv, accentColor: color, updatedAt: Date.now() },
        })),

      setZoom: (zoom) => set({ zoom }),

      updatePersonal: (data) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              personal: { ...s.cv.personal, ...data },
              updatedAt: Date.now(),
            },
          }
        }),

      updateSummary: (text) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: { ...s.cv, summary: text, updatedAt: Date.now() },
          }
        }),

      addExperience: () =>
        set((s) => {
          const hist = pushHistory(s)
          const exp: Experience = {
            id: uuid(),
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            bullets: [''],
            isVisible: true,
          }
          return {
            ...hist,
            cv: {
              ...s.cv,
              experiences: [...s.cv.experiences, exp],
              updatedAt: Date.now(),
            },
          }
        }),

      updateExperience: (id, data) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              experiences: s.cv.experiences.map((e) =>
                e.id === id ? { ...e, ...data } : e
              ),
              updatedAt: Date.now(),
            },
          }
        }),

      updateExperienceBullet: (expId, bulletIdx, text) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              experiences: s.cv.experiences.map((e) => {
                if (e.id !== expId) return e
                const bullets = [...e.bullets]
                bullets[bulletIdx] = text
                return { ...e, bullets }
              }),
              updatedAt: Date.now(),
            },
          }
        }),

      addBullet: (expId) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              experiences: s.cv.experiences.map((e) =>
                e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e
              ),
              updatedAt: Date.now(),
            },
          }
        }),

      removeBullet: (expId, bulletIdx) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              experiences: s.cv.experiences.map((e) => {
                if (e.id !== expId) return e
                const bullets = e.bullets.filter((_, i) => i !== bulletIdx)
                return { ...e, bullets: bullets.length === 0 ? [''] : bullets }
              }),
              updatedAt: Date.now(),
            },
          }
        }),

      removeExperience: (id) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              experiences: s.cv.experiences.filter((e) => e.id !== id),
              updatedAt: Date.now(),
            },
          }
        }),

      reorderExperiences: (from, to) =>
        set((s) => {
          const hist = pushHistory(s)
          const exps = [...s.cv.experiences]
          const [moved] = exps.splice(from, 1)
          exps.splice(to, 0, moved)
          return {
            ...hist,
            cv: { ...s.cv, experiences: exps, updatedAt: Date.now() },
          }
        }),

      duplicateExperience: (id) =>
        set((s) => {
          const hist = pushHistory(s)
          const exp = s.cv.experiences.find((e) => e.id === id)
          if (!exp) return hist
          const dup = { ...exp, id: uuid(), title: `${exp.title} (copie)` }
          const idx = s.cv.experiences.findIndex((e) => e.id === id)
          const exps = [...s.cv.experiences]
          exps.splice(idx + 1, 0, dup)
          return {
            ...hist,
            cv: { ...s.cv, experiences: exps, updatedAt: Date.now() },
          }
        }),

      addEducation: () =>
        set((s) => {
          const hist = pushHistory(s)
          const edu: Education = {
            id: uuid(),
            degree: '',
            school: '',
            location: '',
            year: '',
            details: '',
            isVisible: true,
          }
          return {
            ...hist,
            cv: {
              ...s.cv,
              education: [...s.cv.education, edu],
              updatedAt: Date.now(),
            },
          }
        }),

      updateEducation: (id, data) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              education: s.cv.education.map((e) =>
                e.id === id ? { ...e, ...data } : e
              ),
              updatedAt: Date.now(),
            },
          }
        }),

      removeEducation: (id) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              education: s.cv.education.filter((e) => e.id !== id),
              updatedAt: Date.now(),
            },
          }
        }),

      addSkill: (skill) =>
        set((s) => {
          if (s.cv.skills.includes(skill)) return {}
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              skills: [...s.cv.skills, skill],
              updatedAt: Date.now(),
            },
          }
        }),

      removeSkill: (skill) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              skills: s.cv.skills.filter((sk) => sk !== skill),
              updatedAt: Date.now(),
            },
          }
        }),

      addLanguage: () =>
        set((s) => {
          const hist = pushHistory(s)
          const lang: Language = { id: uuid(), language: '', level: 'B1' }
          return {
            ...hist,
            cv: {
              ...s.cv,
              languages: [...s.cv.languages, lang],
              updatedAt: Date.now(),
            },
          }
        }),

      updateLanguage: (id, data) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              languages: s.cv.languages.map((l) =>
                l.id === id ? { ...l, ...data } : l
              ),
              updatedAt: Date.now(),
            },
          }
        }),

      removeLanguage: (id) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              languages: s.cv.languages.filter((l) => l.id !== id),
              updatedAt: Date.now(),
            },
          }
        }),

      updateInterests: (interests) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: { ...s.cv, interests, updatedAt: Date.now() },
          }
        }),

      toggleAIPanel: () => set((s) => ({ isAIPanelOpen: !s.isAIPanelOpen })),
      toggleAgent: () => set((s) => ({ isAgentOpen: !s.isAgentOpen })),
      setGenerating: (field) =>
        set({ isGenerating: field !== null, generatingField: field }),

      undo: () =>
        set((s) => {
          if (s.historyIndex <= 0) return {}
          const newIdx = s.historyIndex - 1
          return {
            historyIndex: newIdx,
            cv: JSON.parse(JSON.stringify(s.history[newIdx])),
          }
        }),

      redo: () =>
        set((s) => {
          if (s.historyIndex >= s.history.length - 1) return {}
          const newIdx = s.historyIndex + 1
          return {
            historyIndex: newIdx,
            cv: JSON.parse(JSON.stringify(s.history[newIdx])),
          }
        }),

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      importCV: (profile) =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: {
              ...s.cv,
              ...profile,
              updatedAt: Date.now(),
            },
          }
        }),

      resetCV: () =>
        set((s) => {
          const hist = pushHistory(s)
          return {
            ...hist,
            cv: { ...defaultCV, id: uuid(), createdAt: Date.now(), updatedAt: Date.now() },
          }
        }),

      updateTitle: (title) =>
        set((s) => ({
          cv: { ...s.cv, title, updatedAt: Date.now() },
        })),
    }),
    {
      name: 'cv-ai-store',
      partialize: (state) => ({
        cv: state.cv,
        activeTemplate: state.activeTemplate,
        accentColor: state.accentColor,
        zoom: state.zoom,
        history: state.history,
        historyIndex: state.historyIndex,
      }),
    }
  )
)
