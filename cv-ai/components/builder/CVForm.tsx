'use client'

import PersonalSection from './sections/PersonalSection'
import ProfileSection from './sections/ProfileSection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection from './sections/EducationSection'
import SkillsSection from './sections/SkillsSection'
import LanguagesSection from './sections/LanguagesSection'
import InterestsSection from './sections/InterestsSection'

const CVForm = () => {
  return (
    <div className="space-y-1 px-3 py-4">
      <PersonalSection />
      <ProfileSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <LanguagesSection />
      <InterestsSection />
    </div>
  )
}

export default CVForm
