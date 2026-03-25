'use client'

import { useState, useRef, useEffect } from 'react'
import { useCVStore } from '@/lib/cv-store'
import { motion } from 'framer-motion'
import { X, Bot, Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const AIAgentPanel = () => {
  const toggleAgent = useCVStore((s) => s.toggleAgent)
  const importCV = useCVStore((s) => s.importCV)
  const cv = useCVStore((s) => s.cv)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre agent CV. Je peux modifier n\'importe quelle partie de votre CV sur demande. Que souhaitez-vous faire ?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: input, cv }),
      })

      if (!res.ok) throw new Error()
      const data = await res.json()

      // Apply actions
      if (data.actions && Array.isArray(data.actions)) {
        for (const action of data.actions) {
          switch (action.type) {
            case 'UPDATE_SUMMARY':
              importCV({ summary: action.value as string })
              break
            case 'UPDATE_FIELD':
              if (action.path) {
                const parts = action.path.split('.')
                if (parts[0] === 'personal') {
                  importCV({ personal: { ...cv.personal, [parts[1]]: action.value } })
                }
              }
              break
            case 'REPLACE_SKILLS':
              importCV({ skills: action.value as string[] })
              break
            case 'UPDATE_INTERESTS':
              importCV({ interests: action.value as string[] })
              break
            case 'UPDATE_EXPERIENCE_BULLET':
              if (typeof action.exp_index === 'number' && typeof action.bullet_index === 'number') {
                const exps = [...cv.experiences]
                if (exps[action.exp_index]) {
                  const bullets = [...exps[action.exp_index].bullets]
                  bullets[action.bullet_index] = action.value as string
                  exps[action.exp_index] = { ...exps[action.exp_index], bullets }
                  importCV({ experiences: exps })
                }
              }
              break
          }
        }
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.explanation || 'Modifications appliquées.',
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg h-[600px] bg-white rounded-[14px] flex flex-col overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-blue" />
            <span className="text-sm font-semibold text-gray-900">Agent IA</span>
          </div>
          <button onClick={toggleAgent} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 text-sm rounded-[10px] ${
                  msg.role === 'user'
                    ? 'bg-blue text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 bg-gray-100 rounded-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Demandez une modification..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 bg-blue text-white rounded-[6px] hover:bg-blue-dark disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {['Améliore mes descriptions', 'Génère une accroche', 'Ajoute des compétences'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="px-2 py-0.5 text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AIAgentPanel
