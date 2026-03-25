'use client'

import { useCVStore } from '@/lib/cv-store'
import { Minus, Plus, Maximize2, Minimize2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import ModernTemplate from '@/components/templates/ModernTemplate'
import MinimalTemplate from '@/components/templates/MinimalTemplate'
import TechTemplate from '@/components/templates/TechTemplate'
import CreativeTemplate from '@/components/templates/CreativeTemplate'
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate'
import AcademicTemplate from '@/components/templates/AcademicTemplate'
import ParcoursupTemplate from '@/components/templates/ParcoursupTemplate'
import type { TemplateId } from '@/types/cv'

const TEMPLATE_MAP: Record<TemplateId, React.ComponentType<{ isPreview?: boolean }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  tech: TechTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  academic: AcademicTemplate,
  parcoursup: ParcoursupTemplate,
}

const PreviewPane = () => {
  const zoom = useCVStore((s) => s.zoom)
  const setZoom = useCVStore((s) => s.setZoom)
  const activeTemplate = useCVStore((s) => s.activeTemplate)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const ActiveTemplate = useMemo(() => TEMPLATE_MAP[activeTemplate] || ClassicTemplate, [activeTemplate])

  const handleZoomIn = () => setZoom(Math.min(1.5, zoom + 0.1))
  const handleZoomOut = () => setZoom(Math.max(0.4, zoom - 0.1))
  const handleFit = () => setZoom(0.75)

  return (
    <div
      id="dpreview-pane"
      className={`flex flex-col h-full bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-40' : ''}`}
    >
      {/* Preview canvas */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div
          className="cv-document"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: '210mm',
            minHeight: '297mm',
          }}
        >
          <ActiveTemplate isPreview={false} />
        </div>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-3 py-3 bg-white border-t border-gray-200">
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleFit}
          className="text-xs font-medium text-gray-600 min-w-[40px] text-center"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
        >
          <Plus size={14} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
          title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  )
}

export default PreviewPane
