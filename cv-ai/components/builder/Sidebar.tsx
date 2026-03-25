'use client'

import StepNav from './StepNav'
import CVForm from './CVForm'

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-gray-50">
        <StepNav />
      </div>
      <div className="flex-1 overflow-y-auto">
        <CVForm />
      </div>
    </div>
  )
}

export default Sidebar
