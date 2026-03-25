# 🚀 Setup complet CV.ai

## 1. Installation

```bash
# Clone ou dézippez le projet
cd cv-ai

# Installation dépendances
npm install
```

## 2. Configuration Google AI Studio

### Clé API
```bash
# Créer .env.local
echo "GOOGLE_AI_API_KEY=AIzaSyA52SRCT89ZC3U9ewDYgNUk8Xn7Qn7Zxp8" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
```

### Vérification clé
```bash
# Test direct API
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyA52SRCT89ZC3U9ewDYgNUk8Xn7Qn7Zxp8');
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
model.generateContent('Test').then(r => console.log('✅ API OK:', r.response.text())).catch(e => console.error('❌ API Error:', e.message));
"
```

## 3. Lancement

### Développement
```bash
npm run dev
# → http://localhost:3000 (redirect automatique vers /builder)
```

### Build test
```bash
npm run build
# Devrait retourner "✓ Compiled successfully"
```

### Production
```bash
npm run build && npm start
```

## 4. Vérification fonctionnelle

### 1. Navigation
- [ ] Page principale charge sur `http://localhost:3000`
- [ ] Redirect automatique vers `/builder`
- [ ] Layout split-screen visible (sidebar gauche + aperçu droite)

### 2. Sections formulaire
- [ ] Informations personnelles (Prénom, Nom, Email, etc.)
- [ ] Accroche (textarea avec compteur mots)
- [ ] Expériences (ajout/suppression bullets)
- [ ] Formation (degree, school, year)
- [ ] Compétences (ajout rapide)
- [ ] Langues (dropdown niveaux)
- [ ] Intérêts (tags)

### 3. Navigation sidebar
- [ ] Clic sur sections → scroll smooth
- [ ] États visibles (active/completed)
- [ ] Boutons Undo/Redo fonctionnels

### 4. Templates
- [ ] Dropdown "Modèles" avec 8 options
- [ ] Changement template instantané
- [ ] Couleur d'accent modifiable

### 5. Fonctionnalités IA
```bash
# Test API manuel
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"action":"suggestSkills","cv":{"personal":{"firstName":"Test","lastName":"User","targetRole":"Développeur","email":"test@test.com"},"summary":"","experiences":[],"education":[],"skills":[],"languages":[],"interests":[]}}'
```

- [ ] "Générer l'accroche" → streaming texte
- [ ] "Suggérer des compétences" → JSON array
- [ ] "Suggérer un titre" → 3 suggestions
- [ ] "Générer bullets" → 4 bullets expérience
- [ ] "Améliorer bullet" → texte reformulé
- [ ] Panel IA complet (3 onglets)
- [ ] Agent conversationnel

### 6. Export
- [ ] Export TXT → téléchargement fichier
- [ ] Export PDF/DOCX → fallback TXT (implémentation future)

### 7. ATS Score
- [ ] Badge visible dans toolbar
- [ ] Calcul dynamique selon sections
- [ ] Couleur selon score (vert/orange/rouge)

## 5. Déploiement Vercel

### Préparation
```bash
# Git init (si nécessaire)
git init
git add .
git commit -m "CV.ai ready for deployment"

# Push vers GitHub
git branch -M main
git remote add origin https://github.com/<username>/cv-ai.git
git push -u origin main
```

### Vercel
1. [vercel.com](https://vercel.com) → "New Project"
2. Importer repository GitHub
3. **Variables d'environnement** :
   ```
   GOOGLE_AI_API_KEY=AIzaSyA52SRCT89ZC3U9ewDYgNUk8Xn7Qn7Zxp8
   NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
   ```
4. "Deploy" → Build automatique

### Post-déploiement
- [ ] Site accessible sur `*.vercel.app`
- [ ] Redirection automatique vers `/builder`
- [ ] Fonctionnalités IA opérationnelles
- [ ] Export fonctionnel

## 6. Debug rapide

### Erreurs communes
```bash
# Erreur 500 sur API ?
echo "Check .env.local: $(cat .env.local | grep GOOGLE_AI)"

# Build échoue ?
npm run build 2>&1 | tail -20

# Serveur ne démarre pas ?
lsof -ti:3000 | xargs kill -9 2>/dev/null; npm run dev
```

### Console navigateur
- **F12 → Console** : Pas d'erreurs rouges
- **Network** : Appels `/api/ai/*` status 200
- **Application** : LocalStorage avec clé `cv-store`

## 7. Personnalisation

### Templates
```typescript
// /components/templates/MonTemplate.tsx
import { memo } from 'react'
import { useCVStore } from '@/lib/cv-store'

const MonTemplate = memo(() => {
  const cv = useCVStore((s) => s.cv)
  // Design personnalisé
})
```

### Couleurs
```typescript
// /components/builder/DocumentToolbar.tsx
const ACCENT_COLORS = [
  '#2563EB', '#1D4ED8', '#7C3AED', '#DB2777',
  '#DC2626', '#EA580C', '#16A34A', '#0D9488',
]
```

### Prompts IA
```typescript
// /lib/prompts-builder.ts
export const PROMPTS = {
  monPrompt: (cv: CVProfile) => `${SYSTEM}
  Instructions personnalisées...
  `,
}
```

---

**✅ Setup terminé — CV.ai prêt !**
