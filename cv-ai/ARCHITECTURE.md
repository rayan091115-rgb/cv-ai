# 🏗️ Architecture CV.ai

## Vue d'ensemble

CV.ai est une application Next.js 14 App Router avec TypeScript strict, organisée en modules clairs pour maintenabilité et évolutivité.

## Structure des dossiers

```
cv-ai/
├── app/                    # Routes Next.js App Router
│   ├── api/               # API routes (backend)
│   │   └── ai/           # Routes IA (4 endpoints)
│   ├── builder/          # Page principale builder
│   ├── globals.css       # Design system variables
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Redirect → /builder
├── components/            # Composants React
│   ├── builder/         # UI builder
│   │   ├── sections/    # 7 sections formulaire
│   │   └── *.tsx        # Layout + panels
│   └── templates/       # 8 templates CV
├── lib/                  # Logique métier
│   ├── cv-store.ts      # Zustand store
│   ├── ats-score.ts     # Calcul ATS
│   ├── ai-builder.ts    # Interface Gemini
│   └── prompts-builder.ts # Prompts IA
├── types/                # Types TypeScript
│   └── cv.ts            # Interfaces complètes
└── public/              # Assets statiques
```

## Flux de données

### 1. State Management (Zustand)
```typescript
// /lib/cv-store.ts
interface CVState {
  cv: CVProfile              // Données CV
  activeSection: string     // Section active
  activeTemplate: string    // Template sélectionné
  accentColor: string       # Couleur thème
  
  // Actions
  updatePersonal: (data) => void
  addExperience: () => void
  updateSummary: (text) => void
  // ... + undo/redo + persist
}
```

### 2. Flux IA
```
Component → fetch('/api/ai/generate') → Google Gemini → Response
```

### 3. Persistance
```typescript
// Zustand persist middleware
persist({ name: 'cv-store', storage: createJSONStorage(() => localStorage) })
```

## Architecture des composants

### BuilderLayout (Root)
```
┌─────────────────────────────────────────┐
│ DocumentToolbar (fixed top)              │
├─────────────┬───────────────────────────┤
│ Sidebar     │ PreviewPane               │
│ ├─StepNav   │ ├─TemplateSelector       │
│ └─CVForm    │ └─CurrentTemplate        │
│             │                           │
│             │ (Overlay)                 │
│             │ ├─AIPanel                 │
│             │ └─AIAgentPanel            │
└─────────────┴───────────────────────────┘
```

### Sections Formulaire
```typescript
// Pattern commun pour toutes sections
const SectionComponent = () => {
  const data = useCVStore((s) => s.cv.section)
  const update = useCVStore((s) => s.updateSection)
  
  return (
    <SectionBlock id="section-id" title="Titre" icon={<Icon />}>
      {/* Champs du formulaire */}
    </SectionBlock>
  )
}
```

### Templates System
```typescript
// Template pattern
const TemplateName = memo(({ isPreview }: TemplateProps) => {
  const cv = useCVStore((s) => s.cv)
  const accentColor = useCVStore((s) => s.accentColor)
  
  return (
    <div className={isPreview ? 'scale-[0.2]' : ''}>
      {/* Design template avec données cv */}
    </div>
  )
})
```

## API Routes Architecture

### 1. /api/ai/generate
```typescript
// Actions supportées
const jsonActions = [
  'generateBulletsForExp',  // → { bullets: [...] }
  'suggestSkills',          // → { suggestions: [...] }
  'suggestJobTitle',        // → { suggestions: [...] }
  'suggestInterests',       // → { suggestions: [...] }
  'fullATSReport'           // → { score, strengths, ... }
]

const streamActions = [
  'generateSummary',        // → stream texte
  'improveBullet',          // → stream texte
  'humanizeText',           // → stream texte
  // ...
]
```

### 2. /api/ai/agent
```typescript
// Agent conversationnel
interface AgentRequest {
  command: string           // "Ajoute la compétence React"
  cv: CVProfile            // État actuel CV
}

// → { understanding, actions[], explanation }
```

### 3. /api/ai/job-match
```typescript
// Matching offre d'emploi
interface JobMatchRequest {
  jobOffer: string         // Texte offre
  cv?: CVProfile           // CV actuel
}

// → { keywords_missing, match_score, adapted_summary, ... }
```

### 4. /api/export
```typescript
// Export multi-formats
interface ExportRequest {
  cv: CVProfile
  format: 'pdf' | 'docx' | 'txt'
  template: string
}

// → File download
```

## Design System

### CSS Variables (globals.css)
```css
:root {
  --color-blue: #2563EB;
  --color-gray: #6B7280;
  --color-success: #10B981;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Component Patterns
```typescript
// Boutons
<button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue rounded-md hover:bg-blue-light">

// Inputs
<input className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[10px] bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-0">

// Cards
<div className="bg-white border border-gray-200 rounded-xl shadow-sm">
```

## Performance Optimizations

### React.memo sur Templates
```typescript
const ClassicTemplate = memo(({ isPreview }: TemplateProps) => {
  // Re-render uniquement si cv ou accentColor changent
})
```

### useMemo sur calculs lourds
```typescript
const atsScore = useMemo(() => calculateATSScore(cv), [cv])
```

### Debounce sur inputs
```typescript
// 300ms debounce avant update preview
const debouncedUpdate = useMemo(
  () => debounce(updateField, 300),
  []
)
```

## TypeScript Configuration

### Strict mode activé
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Interfaces typées
```typescript
// /types/cv.ts
interface CVProfile {
  personal: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
  languages: Language[]
  interests: string[]
  title: string
}
```

## Sécurité

### API Keys
```typescript
// Côté serveur uniquement
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

// Validation inputs
if (!body.action || typeof body.action !== 'string') {
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
```

### CORS & Headers
```typescript
return new Response(stream, {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  },
})
```

## Monitoring & Debug

### Error Boundaries
```typescript
// Next.js Error Boundary automatique
// Custom errors dans try/catch API routes
```

### Console logging
```typescript
// API routes
console.error('AI Generate error:', error)

// Client (dev only)
if (process.env.NODE_ENV === 'development') {
  console.log('CV updated:', cv)
}
```

---

**Architecture conçue pour :**
- ✅ Maintenabilité (modules clairs)
- ✅ Performance (memo + debounce)
- ✅ Évolutivité (templates extensibles)
- ✅ Type safety (TS strict)
- ✅ UX optimale (streaming IA)
