import type { CVProfile } from '@/types/cv'

export const SYSTEM = `
Tu es un expert RH et coach carrière français avec 15 ans d'expérience.
Tu maîtrises les ATS (Workday, Taleo, SAP SuccessFactors) et le marché français.
RÈGLES ABSOLUES :
- Toujours en français professionnel courant
- JAMAIS de formules génériques : "passionné", "dynamique", "motivé", "rigoureux"
- JAMAIS de style IA détectable : "il convient de", "néanmoins", "en outre", "certes"
- Verbes d'action forts en début de bullet : développé, conçu, piloté, optimisé...
- Chiffres et résultats concrets quand logique
- Répondre UNIQUEMENT avec le contenu demandé, sans préambule
`

export const PROMPTS = {
  generateSummary: (cv: CVProfile) => `${SYSTEM}
Génère une accroche de 3-4 phrases pour :
Poste visé : ${cv.personal.targetRole || 'Non spécifié'}
Expériences : ${cv.experiences.slice(0, 3).map((e) => `${e.title} chez ${e.company}`).join(', ') || 'Aucune'}
Compétences : ${cv.skills.slice(0, 6).join(', ') || 'Aucune'}
Règles : commence par le titre profil (pas "Je"), valeur ajoutée concrète,
3-4 phrases max, 100% humain.`,

  improveBullet: (text: string, level: 'conservative' | 'improved' | 'aggressive', role: string) => `${SYSTEM}
Reformule ce bullet pour le poste "${role}" :
"${text}"
Niveau : ${
    level === 'conservative'
      ? 'CONSERVATEUR — même sens, meilleure formulation'
      : level === 'improved'
        ? 'AMÉLIORÉ — plus percutant, résultat si logique'
        : 'AGRESSIF — verbe fort, chiffre si possible, mots-clés ATS'
  }
Réponds uniquement avec le bullet reformulé (sans tiret ni puce).`,

  generateBulletsForExp: (title: string, company: string, sector: string) => `${SYSTEM}
Génère 4 bullets de description pour :
Poste : ${title} chez ${company} (secteur : ${sector || 'général'})
Chaque bullet : verbe d'action fort, action concrète, résultat si possible.
Réponds en JSON : { "bullets": ["...", "...", "...", "..."] }`,

  suggestSkills: (cv: CVProfile) => `${SYSTEM}
Suggère 10 compétences pertinentes manquantes pour ${cv.personal.targetRole || 'ce profil'}.
Compétences actuelles : ${cv.skills.join(', ') || 'Aucune'}
Réponds en JSON : { "suggestions": ["...", ...] }`,

  humanizeText: (text: string) => `${SYSTEM}
Réécris ce texte pour qu'il semble 100% écrit par un humain.
Texte : "${text}"
— Garde le sens exact
— Varie la longueur des phrases
— Supprime tout mot typiquement IA
— Ne dépasse pas la longueur originale
Réponds uniquement avec le texte réécrit.`,

  shortenText: (text: string) => `${SYSTEM}
Raccourcis ce texte de 30-40% en gardant l'essentiel :
"${text}"
Réponds uniquement avec le texte raccourci.`,

  reformulateText: (text: string) => `${SYSTEM}
Reformule ce texte sans changer le sens, avec un style naturel et professionnel :
"${text}"
Réponds uniquement avec le texte reformulé.`,

  translateText: (text: string, targetLang: string) => `${SYSTEM}
Traduis ce texte en ${targetLang === 'en' ? 'anglais' : 'français'} :
"${text}"
Réponds uniquement avec la traduction.`,

  adaptToJobOffer: (cv: CVProfile, offer: string) => `${SYSTEM}
Analyse cette offre et adapte le CV.
OFFRE : ${offer.slice(0, 800)}
CV : poste="${cv.personal.targetRole}" | résumé="${cv.summary?.slice(0, 200)}" | skills="${cv.skills.join(', ')}"
Réponds en JSON :
{
  "keywords_missing": [],
  "keywords_present": [],
  "match_score_before": 0,
  "match_score_after": 0,
  "adapted_summary": "",
  "adapted_bullets": [{ "original": "", "improved": "", "exp_index": 0, "bullet_index": 0 }]
}`,

  agentExecute: (cv: CVProfile, userCommand: string) => `${SYSTEM}
Tu es un agent avec accès complet au CV. CV actuel :
${JSON.stringify(cv, null, 2)}

Commande utilisateur : "${userCommand}"

Analyse la commande et génère les modifications nécessaires.
Réponds en JSON :
{
  "understanding": "Ce que tu as compris",
  "actions": [
    {
      "type": "UPDATE_FIELD",
      "path": "personal.targetRole",
      "value": "..."
    }
  ],
  "explanation": "Explication en français de ce qui a été fait"
}`,

  fullATSReport: (cv: CVProfile) => `${SYSTEM}
Génère un rapport ATS complet pour ce CV.
CV : ${JSON.stringify({ personal: cv.personal, summary: cv.summary, experiences: cv.experiences.slice(0, 3), skills: cv.skills })}
Réponds en JSON :
{
  "score": 0,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "quick_wins": ["action concrète à faire", "..."],
  "section_scores": { "personal": 0, "summary": 0, "experiences": 0, "skills": 0, "format": 0 }
}`,

  parseCV: (rawText: string) => `${SYSTEM}
Parse ce texte de CV et retourne un JSON CVProfile.
Texte : ---
${rawText}
---
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Structure : { "personal": { "firstName": "", "lastName": "", "targetRole": "", "email": "", "phone": "", "city": "" }, "summary": "", "experiences": [{ "title": "", "company": "", "startDate": "", "endDate": "", "bullets": [], "location": "" }], "education": [{ "degree": "", "school": "", "year": "", "location": "" }], "skills": [], "languages": [{ "language": "", "level": "" }], "interests": [] }`,

  suggestJobTitle: (cv: CVProfile) => `${SYSTEM}
Suggère 3 titres de poste pertinents basés sur ce profil :
Expériences : ${cv.experiences.slice(0, 3).map((e) => `${e.title} chez ${e.company}`).join(', ') || 'Aucune'}
Compétences : ${cv.skills.slice(0, 8).join(', ') || 'Aucune'}
Réponds en JSON : { "suggestions": ["...", "...", "..."] }`,
}
