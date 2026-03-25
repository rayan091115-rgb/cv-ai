'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface SectionBlockProps {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

const SectionBlock = ({ id, title, icon, children, defaultOpen = true }: SectionBlockProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div id={`section-${id}`} className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 px-4 py-3 bg-white rounded-t-[14px] hover:bg-gray-50 transition-colors border border-gray-200"
        style={{
          borderRadius: isOpen ? '14px 14px 0 0' : '14px',
        }}
      >
        <span className="text-gray-500">{icon}</span>
        <span className="text-sm font-semibold text-gray-900 flex-1 text-left">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 py-4 bg-white border border-t-0 border-gray-200 rounded-b-[14px]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SectionBlock
