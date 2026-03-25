'use client'

import { useState } from 'react'
import { useCVStore } from '@/lib/cv-store'
import { showToast } from '@/lib/toast'
import { motion } from 'framer-motion'
import { X, FileText, Briefcase, Search, Bot, BarChart3, Sparkles, Target, Sliders } from 'lucide-react'

type Tab = 'actions' | 'jobmatch' | 'optimize'

interface JobMatchResult {
  match_score_before: number
  match_score_after: number
  keywords_missing: string[]
  adapted_summary?: string
  adapted_bullets?: Array<{ exp_index: number; bullet_index: number; improved: string }>
}

const AIPanel = () => {
  const toggleAIPanel = useCVStore((s) => s.toggleAIPanel)
  const cv = useCVStore((s) => s.cv)
  const updateSummary = useCVStore((s) => s.updateSummary)
  const updateExperienceBullet = useCVStore((s) => s.updateExperienceBullet)
  const [activeTab, setActiveTab] = useState<Tab>('actions')
  const [jobOffer, setJobOffer] = useState('')
  const [optimLevel, setOptimLevel] = useState<'conservative' | 'improved' | 'aggressive'>('improved')
  const [streamResult, setStreamResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null)

  const handleAction = async (action: string, extraBody?: Record<string, unknown>) => {
    setIsLoading(true)
    setStreamResult('')
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, cv, ...extraBody }),
      })
      if (!res.ok) throw new Error()
      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data = await res.json()
        setStreamResult(JSON.stringify(data, null, 2))
        return data
      }
      const reader = res.body?.getReader()
      if (!reader) return
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setStreamResult(text)
      }
      return text
    } catch {
      setStreamResult('Erreur lors de la génération. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSummary = async () => {
    const result = await handleAction('generateSummary')
    if (typeof result === 'string' && result.trim()) {
      updateSummary(result.trim())
      showToast('Accroche générée et appliquée ✓', 'success')
    }
  }

  const handleOptimizeCV = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimizeCV', cv, level: optimLevel }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.optimized && Array.isArray(data.optimized)) {
        data.optimized.forEach(({ exp_index, bullet_index, text }: { exp_index: number; bullet_index: number; text: string }) => {
          const exp = cv.experiences[exp_index]
          if (exp) updateExperienceBullet(exp.id, bullet_index, text)
        })
        showToast(`${data.optimized.length} bullets optimisés ✓`, 'success')
      }
    } catch {
      showToast('Erreur lors de l\'optimisation', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobMatch = async () => {
    if (!jobOffer.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobOffer, cv }),
      })
      if (res.ok) {
        const data = await res.json()
        setMatchResult(data)
      } else {
        showToast('Erreur lors de l\'analyse', 'error')
      }
    } catch {
      showToast('Erreur réseau', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const applyJobMatchResults = () => {
    if (!matchResult) return
    if (matchResult.adapted_summary) {
      updateSummary(matchResult.adapted_summary)
    }
    matchResult.adapted_bullets?.forEach(({ exp_index, bullet_index, improved }) => {
      const exp = cv.experiences[exp_index]
      if (exp) updateExperienceBullet(exp.id, bullet_index, improved)
    })
    showToast('CV adapté à l\'offre ✓', 'success')
    setMatchResult(null)
  }

  const tabs = [
    { id: 'actions' as const, label: 'Actions rapides' },
    { id: 'jobmatch' as const, label: 'Job Match' },
    { id: 'optimize' as const, label: 'Optimiser' },
  ]

  const actions = [
    { icon: FileText, label: 'Générer l\'accroche', onClick: handleGenerateSummary },
    { icon: Briefcase, label: 'Compléter les bullets', onClick: () => handleAction('generateAllBullets') },
    { icon: Search, label: 'Analyser le CV complet', onClick: () => handleAction('fullATSReport') },
    { icon: Bot, label: 'Humaniser le texte IA', onClick: () => handleAction('humanizeAll') },
    { icon: BarChart3, label: 'Rapport ATS complet', onClick: () => handleAction('fullATSReport') },
  ]

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed right-0 top-[52px] bottom-0 w-80 bg-white border-l border-gray-200 z-30 flex flex-col"
      style={{ boxShadow: 'var(--shadow-lg)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue" />
          <span className="text-sm font-semibold text-gray-900">Assistant IA</span>
        </div>
        <button onClick={toggleAIPanel} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setStreamResult(''); setMatchResult(null) }}
            className={`flex-1 py-2.5 text-xs font-medium text-center transition-colors ${
              activeTab === tab.id
                ? 'text-blue border-b-2 border-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'actions' && (
          <div className="space-y-2">
            {actions.map((action, i) => {
              const Icon = action.icon
              return (
                <button
                  key={i}
                  onClick={action.onClick}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-[10px] hover:bg-gray-100 transition-colors disabled:opacity-50 text-left"
                >
                  <Icon size={16} className="text-blue shrink-0" />
                  {action.label}
                </button>
              )
            })}
          </div>
        )}

        {activeTab === 'jobmatch' && (
          <div className="space-y-3">
            <textarea
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
              placeholder="Collez une offre d'emploi ici..."
              rows={6}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 resize-none focus:border-blue focus:ring-0"
            />
            <button
              onClick={handleJobMatch}
              disabled={isLoading || !jobOffer.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-blue rounded-[6px] hover:bg-blue-dark disabled:opacity-50"
            >
              <Target size={14} />
              {isLoading ? 'Analyse en cours...' : 'Adapter mon CV à cette offre'}
            </button>

            {matchResult && (
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {matchResult.match_score_before || 0}%
                    </div>
                    <div className="text-[10px] text-gray-500">Avant</div>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {matchResult.match_score_after || 0}%
                    </div>
                    <div className="text-[10px] text-gray-500">Après</div>
                  </div>
                </div>
                {matchResult.keywords_missing?.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Mots-clés manquants :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {matchResult.keywords_missing.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] bg-red-50 text-danger rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {matchResult.adapted_summary && (
                  <button
                    onClick={applyJobMatchResults}
                    className="w-full py-2 text-sm font-medium text-white bg-blue rounded-[6px] hover:bg-blue-dark"
                  >
                    ✓ Appliquer les modifications au CV
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'optimize' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-600 mb-2 block">Niveau d&apos;optimisation</span>
              <div className="flex gap-1 p-1 bg-gray-100 rounded-[10px]">
                {(['conservative', 'improved', 'aggressive'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setOptimLevel(level)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-[8px] transition-colors ${
                      optimLevel === level
                        ? 'bg-white text-blue shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {level === 'conservative' ? 'Conservateur' : level === 'improved' ? 'Amélioré' : 'Agressif'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {optimLevel === 'conservative'
                  ? 'Corrections mineures, même sens conservé.'
                  : optimLevel === 'improved'
                    ? 'Plus percutant avec résultats ajoutés.'
                    : 'Verbes forts, chiffres, mots-clés ATS max.'}
              </p>
            </div>
            <button
              onClick={handleOptimizeCV}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-blue rounded-[6px] hover:bg-blue-dark disabled:opacity-50"
            >
              <Sliders size={14} />
              {isLoading ? 'Optimisation...' : 'Optimiser tout le CV'}
            </button>
          </div>
        )}

        {/* Stream result area */}
        {streamResult && (
          <div className="mt-4 p-3 bg-gray-50 rounded-[10px] border border-gray-200">
            {(() => {
              try {
                const report = JSON.parse(streamResult)
                if (report.score !== undefined) {
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" style={{color: report.score >= 75 ? '#10B981' : report.score >= 50 ? '#F59E0B' : '#EF4444'}}>
                          {report.score}/100
                        </span>
                        <span className="text-xs text-gray-500">Score ATS</span>
                      </div>
                      {report.quick_wins?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Actions prioritaires :</p>
                          {report.quick_wins.map((win: string, i: number) => (
                            <p key={i} className="text-xs text-gray-600 pl-2">→ {win}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
              } catch {}
              return (
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {streamResult}
                  {isLoading && <span className="inline-block w-1.5 h-3.5 bg-blue ml-0.5 animate-pulse" />}
                </pre>
              )
            })()}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AIPanel
