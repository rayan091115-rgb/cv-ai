# CV.ai — Éditeur de CV avec IA

Éditeur de CV split-screen avec 8 templates, IA intégrée (Google Gemini), et optimisation ATS. Inspiré de cv.fr avec design supérieur.

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Variables d'environnement
echo "GOOGLE_AI_API_KEY=AIzaSyA52SRCT89ZC3U9ewDYgNUk8Xn7Qn7Zxp8" > .env.local

# Développement
npm run dev

# Build
npm run build

# Production
npm start
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📋 Stack technique

- **Framework**: Next.js 14 App Router + TypeScript strict
- **Styling**: Tailwind CSS v3 avec variables CSS personnalisées
- **Font**: Plus Jakarta Sans
- **State**: Zustand avec persist et undo/redo
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **IA**: Google Gemini SDK (`gemini-3.1-flash-lite-preview`)
- **Build**: Turbopack

## 🏗️ Architecture

```
/app
  /api
    /ai
      /generate      # Génération IA (streaming + JSON)
      /agent        # Agent conversationnel
      /job-match    # Matching offres d'emploi
  /builder
    page.tsx        # Page principale du builder
/layout.tsx
/page.tsx          # Redirect → /builder
/globals.css       # Design system variables

/components
  /builder
    BuilderLayout.tsx          # Layout split-screen
    DocumentToolbar.tsx        # Toolbar supérieur
    Sidebar.tsx                # Colonne gauche
    PreviewPane.tsx            # Aperçu CV
    ContextualToolbar.tsx      # IA sur sélection
    AIPanel.tsx                # Panel IA principal
    AIAgentPanel.tsx           # Chat agent
    CVForm.tsx                 # Formulaire complet
    StepNav.tsx                # Navigation sections
    SectionBlock.tsx           # Wrapper animé
    /sections
      PersonalSection.tsx      # Infos personnelles
      ProfileSection.tsx       # Accroche
      ExperienceSection.tsx    # Expériences
      EducationSection.tsx     # Formation
      SkillsSection.tsx        # Compétences
      LanguagesSection.tsx     # Langues
      InterestsSection.tsx     # Centres d'intérêt
  /templates
    ClassicTemplate.tsx        # Template classique
    ModernTemplate.tsx         # Template moderne
    MinimalTemplate.tsx        # Template minimal
    TechTemplate.tsx           # Template tech
    CreativeTemplate.tsx       # Template créatif
    ExecutiveTemplate.tsx      # Template executive
    AcademicTemplate.tsx       # Template académique
    ParcoursupTemplate.tsx     # Template Parcoursup

/lib
  cv-store.ts          # Zustand store + persist + undo/redo
  ats-score.ts         # Calcul score ATS
  ai-builder.ts        # Interface Google Gemini
  prompts-builder.ts   # Prompts IA centralisés

/types
  cv.ts                # Types TypeScript complets
```

## 🎨 Templates disponibles

- **Classic** (ATS 98%) — Design traditionnel
- **Modern** (ATS 72%) — Sidebar colorée
- **Minimal** (ATS 90%) — Design épuré
- **Tech** (ATS 88%) — Orienté développeur
- **Creative** (ATS 55%) — Visuel, impactant
- **Executive** (ATS 95%) — Formel, corporate
- **Academic** (ATS 92%) — Recherche/formation
- **Parcoursup** (ATS 0%) — Spécial France

## 🤖 Fonctionnalités IA

### Génération
- **Accroche automatique** — 3-4 phrases percutantes
- **Bullets expérience** — Verbes d'action + résultats
- **Suggestion compétences** — Basées sur le profil
- **Titres de poste** — Pertinents selon expérience

### Optimisation
- **Amélioration bullets** — 3 niveaux (conservateur/amélioré/agressif)
- **Humanisation texte** — Style naturel, anti-détection IA
- **Raccourcir/Reformuler** — Optimisation longueur/style
- **Traduction EN** — Export international

### Analyse
- **Score ATS complet** — Sections + suggestions
- **Matching offres** — Keywords missing + adaptations
- **Agent conversationnel** — Commandes naturelles

## 🚀 Déploiement Vercel

1. **Push sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial CV.ai"
   git branch -M main
   git remote add origin <repo>
   git push -u origin main
   ```

2. **Importer sur Vercel**
   - Connectez votre compte GitHub
   - Importez le repository
   - Ajoutez la variable d'environnement :
     ```
     GOOGLE_AI_API_KEY=AIzaSyA52SRCT89ZC3U9ewDYgNUk8Xn7Qn7Zxp8
     ```

3. **Deploy**
   - Vercel détecte automatiquement Next.js
   - Build et déploiement automatiques

## 🔧 Configuration

### Variables d'environnement
```bash
# .env.local
GOOGLE_AI_API_KEY=AIzaSyA52SRCT89ZC3U9ewDYgNUk8Xn7Qn7Zxp8
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Personnalisation
- **Couleurs** : Modifiez `ACCENT_COLORS` dans `DocumentToolbar.tsx`
- **Templates** : Ajoutez dans `/components/templates/`
- **Prompts IA** : Éditez `lib/prompts-builder.ts`

## 📊 Performance

- **Build time** : ~3.5s (Turbopack)
- **Bundle size** : Optimisé avec React.memo
- **SSR** : Pages statiques + API routes dynamiques
- **Persist** : Zustand avec localStorage
- **Streaming** : Réponses IA en temps réel

## 🐛 Debug

### Erreurs communes
- **API 500** : Vérifiez `GOOGLE_AI_API_KEY` dans `.env.local`
- **Hydration** : `suppressHydrationWarning` sur boutons dynamiques
- **Import** : Paths absolus avec `@/` configurés

### Logs
```bash
# Développement
npm run dev

# Production
npm run build && npm start

# Vérifier build
npm run build
```

## 📝 License

Projet personnel/educational. Utilisation libre avec attribution.

---

**Développé avec Next.js 14 + TypeScript + Tailwind CSS + Google Gemini**
