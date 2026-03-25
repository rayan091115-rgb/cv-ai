import type { CVProfile, ATSScore } from '@/types/cv'

const ACTION_VERBS = [
  'développé', 'géré', 'conçu', 'créé', 'dirigé', 'optimisé', 'augmenté', 'réduit',
  'amélioré', 'lancé', 'coordonné', 'analysé', 'déployé', 'intégré', 'automatisé',
  'piloté', 'accompagné', 'formé', 'négocié', 'réalisé', 'supervisé', 'mis en place',
  'implémenté', 'restructuré', 'modernisé', 'consolidé', 'élaboré', 'établi',
  'managed', 'developed', 'created', 'designed', 'led', 'optimized', 'increased',
  'reduced', 'improved', 'launched', 'coordinated', 'analyzed', 'deployed', 'integrated',
  'automated', 'supervised', 'negotiated', 'implemented', 'built', 'delivered',
]

export function calculateATSScore(cv: CVProfile, jobOffer?: string): ATSScore {
  const breakdown = { sections: 0, format: 0, actionVerbs: 0, quantification: 0, keywords: 0 }
  const suggestions: string[] = []

  // Sections présentes (0-20pts)
  if (cv.personal.firstName && cv.personal.email) breakdown.sections += 8
  if (cv.experiences.length > 0) breakdown.sections += 6
  if (cv.education.length > 0) breakdown.sections += 3
  if (cv.skills.length > 0) breakdown.sections += 3

  // Format (0-20pts)
  const singleColTemplates = ['classic', 'minimal', 'tech', 'executive', 'academic']
  if (singleColTemplates.includes(cv.templateId)) breakdown.format += 15
  else breakdown.format += 8
  if (cv.personal.linkedin) breakdown.format += 3
  if (cv.summary && cv.summary.split(' ').length > 30) breakdown.format += 2

  // Action verbs (0-20pts)
  const allBullets = cv.experiences.flatMap((e) => e.bullets).filter(Boolean)
  if (allBullets.length > 0) {
    const withVerb = allBullets.filter((b) =>
      ACTION_VERBS.some((v) => b.toLowerCase().startsWith(v))
    ).length
    breakdown.actionVerbs = Math.round((withVerb / allBullets.length) * 20)
  }

  // Chiffres (0-20pts)
  const bulletsWithNumbers = allBullets.filter((b) => /\d/.test(b)).length
  breakdown.quantification = Math.min(20, bulletsWithNumbers * 4)

  // Keywords (0-20pts si offre fournie)
  if (jobOffer && cv.skills.length > 0) {
    const offerLower = jobOffer.toLowerCase()
    const matched = cv.skills.filter((s) => offerLower.includes(s.toLowerCase())).length
    breakdown.keywords = Math.min(20, matched * 3)
  } else {
    breakdown.keywords = 10
  }

  const total = Math.min(100, Object.values(breakdown).reduce((a, b) => a + b, 0))

  // Suggestions
  if (breakdown.actionVerbs < 10)
    suggestions.push("Commencez vos bullets par des verbes d'action (développé, créé, piloté...)")
  if (breakdown.quantification < 8)
    suggestions.push("Ajoutez des chiffres dans vos descriptions (+30% de chances d'entretien)")
  if (!cv.personal.linkedin)
    suggestions.push("Ajoutez votre profil LinkedIn (+71% de chances d'entretien)")
  if (!cv.summary || cv.summary.split(' ').length < 30)
    suggestions.push("Étoffez votre accroche (minimum 30 mots recommandés)")
  if (cv.skills.length < 5)
    suggestions.push("Ajoutez au moins 5 compétences pertinentes")
  if (cv.experiences.length === 0)
    suggestions.push("Ajoutez au moins une expérience professionnelle")

  return { total, breakdown, suggestions }
}
