'use client'

import { useState, useRef, useEffect } from 'react'
import { useCVStore } from '@/lib/cv-store'
import { showToast } from '@/lib/toast'
import { calculateATSScore } from '@/lib/ats-score'
import {
  Undo2,
  Redo2,
  FileText,
  Palette,
  Sparkles,
  Bot,
  Eye,
  Download,
  ChevronDown,
  Check,
} from 'lucide-react'

const ACCENT_COLORS = [
  '#2563EB', '#1D4ED8', '#7C3AED', '#DB2777',
  '#DC2626', '#EA580C', '#16A34A', '#0D9488',
]

const DocumentToolbar = () => {
  const cv = useCVStore((s) => s.cv)
  const updateTitle = useCVStore((s) => s.updateTitle)
  const undo = useCVStore((s) => s.undo)
  const redo = useCVStore((s) => s.redo)
  const historyIndex = useCVStore((s) => s.historyIndex)
  const historyLength = useCVStore((s) => s.history.length)
  const canUndoVal = historyIndex > 0
  const canRedoVal = historyIndex < historyLength - 1
  const accentColor = useCVStore((s) => s.accentColor)
  const setAccentColor = useCVStore((s) => s.setAccentColor)
  const toggleAIPanel = useCVStore((s) => s.toggleAIPanel)
  const toggleAgent = useCVStore((s) => s.toggleAgent)
  const setTemplate = useCVStore((s) => s.setTemplate)
  const activeTemplate = useCVStore((s) => s.activeTemplate)

  const [showTemplates, setShowTemplates] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [isFullPreview, setIsFullPreview] = useState(false)

  const templateRef = useRef<HTMLDivElement>(null)
  const colorRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  const atsScore = calculateATSScore(cv)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (templateRef.current && !templateRef.current.contains(e.target as Node)) setShowTemplates(false)
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setShowColors(false)
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const templates = [
    { id: 'classic' as const, label: 'Classique', ats: 98 },
    { id: 'modern' as const, label: 'Moderne', ats: 72 },
    { id: 'minimal' as const, label: 'Minimal', ats: 90 },
    { id: 'tech' as const, label: 'Tech', ats: 88 },
    { id: 'creative' as const, label: 'Créatif', ats: 55 },
    { id: 'executive' as const, label: 'Executive', ats: 95 },
    { id: 'academic' as const, label: 'Académique', ats: 92 },
    { id: 'parcoursup' as const, label: 'Parcoursup', ats: 0 },
  ]

  const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
    setShowExport(false)
    
    if (format === 'pdf') {
      window.print()
      return
    }

    if (format === 'docx') {
      showToast('Export DOCX bientôt disponible. Utilisez PDF pour l\'instant.', 'info')
      return
    }

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv, format }),
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cv.title || 'CV'}.txt` 
      a.click()
      URL.revokeObjectURL(url)
      showToast('Export TXT réussi', 'success')
    } catch {
      showToast('Erreur lors de l\'export', 'error')
    }
  }

  return (
    <div
      id="document-toolbar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-[52px] px-4 bg-white border-b border-gray-200"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <span className="text-base font-bold text-gray-900">
          CV<span className="text-blue">.</span>ai
        </span>
      </div>

      <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />

      {/* Title input */}
      <input
        type="text"
        value={cv.title}
        onChange={(e) => updateTitle(e.target.value)}
        placeholder="CV sans titre"
        className="bg-transparent border-none text-sm font-medium text-gray-700 w-32 sm:w-48 focus:outline-none focus:border-b-2 focus:border-blue px-1 py-1 truncate"
        style={{ boxShadow: 'none' }}
      />

      <div className="flex-1" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndoVal}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Annuler"
        >
          <Undo2 size={16} className="text-gray-600" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedoVal}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Rétablir"
        >
          <Redo2 size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />

      {/* ATS Badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor:
              atsScore.total >= 75 ? '#10B981' : atsScore.total >= 50 ? '#F59E0B' : '#EF4444',
          }}
        />
        <span className="text-xs font-semibold text-gray-700">ATS {atsScore.total}</span>
      </div>

      <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block" />

      {/* Templates dropdown */}
      <div className="relative hidden md:block" ref={templateRef}>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100"
        >
          <FileText size={14} />
          <span>Modèles</span>
          <ChevronDown size={12} />
        </button>
        {showTemplates && (
          <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTemplate(t.id); setShowTemplates(false) }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  {activeTemplate === t.id && <Check size={14} className="text-blue" />}
                  {t.label}
                </span>
                {t.ats > 0 && (
                  <span className="text-xs text-gray-400">ATS {t.ats}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color picker */}
      <div className="relative hidden md:block" ref={colorRef}>
        <button
          onClick={() => setShowColors(!showColors)}
          className="p-2 rounded-md hover:bg-gray-100"
          title="Couleur d'accent"
        >
          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: accentColor }} />
        </button>
        {showColors && (
          <div className="absolute top-full right-0 mt-1 p-3 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <div className="grid grid-cols-4 gap-2">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setAccentColor(c); setShowColors(false) }}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: c,
                    borderColor: accentColor === c ? '#111827' : 'transparent',
                  }}
                >
                  {accentColor === c && <Check size={12} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block" />

      {/* AI buttons */}
      <button
        onClick={toggleAIPanel}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue rounded-md hover:bg-blue-light"
      >
        <Sparkles size={14} />
        <span className="hidden lg:inline">IA</span>
      </button>

      <button
        onClick={toggleAgent}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
      >
        <Bot size={14} />
        <span className="hidden lg:inline">Agent</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block" />

      {/* Preview toggle (desktop only) */}
      <button
        onClick={() => setIsFullPreview(!isFullPreview)}
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100"
      >
        <Eye size={14} />
        <span className="hidden lg:inline">Aperçu</span>
      </button>

      {/* Export dropdown */}
      <div className="relative" ref={exportRef}>
        <button
          onClick={() => setShowExport(!showExport)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue rounded-md hover:bg-blue-dark"
          style={{ borderRadius: 6 }}
        >
          <Download size={14} />
          <span className="hidden sm:inline">Exporter</span>
          <ChevronDown size={12} />
        </button>
        {showExport && (
          <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              DOCX
            </button>
            <button
              onClick={() => handleExport('txt')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              TXT
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentToolbar
