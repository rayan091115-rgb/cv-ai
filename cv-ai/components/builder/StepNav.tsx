'use client'

import { useCVStore } from '@/lib/cv-store'
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  Globe,
  Heart,
  Download,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Step {
  id: string
  icon: LucideIcon
  label: string
  required: boolean
}

const STEPS: Step[] = [
  { id: 'personal', icon: User, label: 'Informations', required: true },
  { id: 'profile', icon: FileText, label: 'Accroche', required: false },
  { id: 'employment', icon: Briefcase, label: 'Expériences', required: false },
  { id: 'educations', icon: GraduationCap, label: 'Formation', required: false },
  { id: 'skills', icon: Zap, label: 'Compétences', required: false },
  { id: 'languages', icon: Globe, label: 'Langues', required: false },
  { id: 'hobbies', icon: Heart, label: 'Intérêts', required: false },
  { id: 'export', icon: Download, label: 'Score & Export', required: false },
]

const StepNav = () => {
  const activeSection = useCVStore((s) => s.activeSection)
  const setActiveSection = useCVStore((s) => s.setActiveSection)
  const cv = useCVStore((s) => s.cv)

  const isSectionDone = (id: string): boolean => {
    switch (id) {
      case 'personal':
        return !!(cv.personal.firstName && cv.personal.lastName && cv.personal.email)
      case 'profile':
        return cv.summary.length > 20
      case 'employment':
        return cv.experiences.length > 0 && cv.experiences.some((e) => e.title)
      case 'educations':
        return cv.education.length > 0 && cv.education.some((e) => e.degree)
      case 'skills':
        return cv.skills.length >= 3
      case 'languages':
        return cv.languages.length > 0 && cv.languages.some((l) => l.language)
      case 'hobbies':
        return cv.interests.length > 0
      default:
        return false
    }
  }

  const handleClick = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="py-2">
      {STEPS.map((step) => {
        const isActive = activeSection === step.id
        const isDone = isSectionDone(step.id)
        const Icon = step.icon

        return (
          <button
            key={step.id}
            onClick={() => handleClick(step.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
              isActive
                ? 'bg-blue-light border-l-2 border-blue text-blue'
                : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                isDone
                  ? 'bg-success text-white'
                  : isActive
                    ? 'bg-blue text-white'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <Icon size={14} />
              )}
            </div>
            <span className={`text-sm font-medium ${isActive ? 'text-blue' : ''}`}>
              {step.label}
            </span>
            {step.required && (
              <span className="ml-auto text-[10px] text-gray-400 font-medium">requis</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default StepNav
