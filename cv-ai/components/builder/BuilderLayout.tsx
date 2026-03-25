'use client'

import { useState } from 'react'
import { useCVStore } from '@/lib/cv-store'
import DocumentToolbar from './DocumentToolbar'
import Sidebar from './Sidebar'
import PreviewPane from './PreviewPane'
import AIPanel from './AIPanel'
import AIAgentPanel from './AIAgentPanel'
import ContextualToolbar from './ContextualToolbar'

const BuilderLayout = () => {
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const isAIPanelOpen = useCVStore((s) => s.isAIPanelOpen)
  const isAgentOpen = useCVStore((s) => s.isAgentOpen)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DocumentToolbar />

      <div className="flex flex-1 overflow-hidden" style={{ marginTop: 52 }}>
        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex">
          <button
            onClick={() => setMobileTab('edit')}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              mobileTab === 'edit'
                ? 'text-blue border-t-2 border-blue bg-blue-light'
                : 'text-gray-500'
            }`}
          >
            Éditer
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              mobileTab === 'preview'
                ? 'text-blue border-t-2 border-blue bg-blue-light'
                : 'text-gray-500'
            }`}
          >
            Aperçu
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`w-full md:w-80 md:min-w-80 md:block overflow-y-auto border-r border-gray-200 bg-white ${
            mobileTab === 'edit' ? 'block' : 'hidden'
          }`}
          style={{ paddingBottom: 60 }}
        >
          <Sidebar />
        </div>

        {/* Preview */}
        <div
          className={`flex-1 md:block overflow-hidden ${
            mobileTab === 'preview' ? 'block' : 'hidden'
          }`}
        >
          <PreviewPane />
        </div>

        {/* AI Panel overlay */}
        {isAIPanelOpen && <AIPanel />}

        {/* Agent Panel overlay */}
        {isAgentOpen && <AIAgentPanel />}
      </div>

      {/* Contextual Toolbar */}
      <ContextualToolbar />
    </div>
  )
}

export default BuilderLayout
