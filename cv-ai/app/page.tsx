// app/page.tsx
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)', background: '#fff', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, borderBottom:'1px solid #E5E7EB', position:'sticky', top:0, background:'#fff', zIndex:50 }}>
        <span style={{ fontSize:18, fontWeight:700, color:'#0A0A0A' }}>
          CV<span style={{ color:'#2563EB' }}>.</span>ai
        </span>
        <Link href="/builder" style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 20px', background:'#2563EB', color:'#fff', borderRadius:8, fontSize:14, fontWeight:600, textDecoration:'none' }}>
          Créer mon CV →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ textAlign:'center', padding:'80px 24px 64px', maxWidth:720, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px', background:'#EFF6FF', border:'1px solid #DBEAFE', borderRadius:20, fontSize:12, fontWeight:600, color:'#2563EB', marginBottom:24 }}>
          ✨ Propulsé par Gemini 3.1 Flash Lite
        </div>
        <h1 style={{ fontSize:'clamp(32px,5vw,56px)', fontWeight:700, lineHeight:1.15, color:'#0A0A0A', marginBottom:20 }}>
          Votre CV. En 5 minutes.<br />
          <span style={{ color:'#2563EB' }}>L&apos;IA fait le reste.</span>
        </h1>
        <p style={{ fontSize:18, color:'#6B7280', lineHeight:1.7, marginBottom:40, maxWidth:540, margin:'0 auto 40px' }}>
          Gratuit. Sans inscription. Créez, optimisez et exportez un CV qui passe les filtres ATS et attire les recruteurs.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/builder" style={{ padding:'14px 32px', background:'#2563EB', color:'#fff', borderRadius:10, fontSize:15, fontWeight:600, textDecoration:'none' }}>
            Créer mon CV gratuitement →
          </Link>
          <a href="#templates" style={{ padding:'14px 32px', border:'1px solid #E5E7EB', color:'#374151', borderRadius:10, fontSize:15, fontWeight:500, textDecoration:'none' }}>
            Voir les templates
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:'#F9FAFB', borderTop:'1px solid #E5E7EB', borderBottom:'1px solid #E5E7EB', padding:'40px 24px' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:'clamp(24px,5vw,80px)', flexWrap:'wrap', maxWidth:900, margin:'0 auto' }}>
          {[
            { n:'75%', label:'des CVs ne passent pas les filtres ATS' },
            { n:'6 sec', label:'temps moyen d\'un recruteur sur un CV' },
            { n:'+40%', label:'de chances avec des chiffres dans vos bullets' },
            { n:'100%', label:'gratuit, sans limite cachée' },
          ].map((s) => (
            <div key={s.n} style={{ textAlign:'center', minWidth:120 }}>
              <div style={{ fontSize:28, fontWeight:700, color:'#2563EB' }}>{s.n}</div>
              <div style={{ fontSize:12, color:'#6B7280', marginTop:4, maxWidth:140 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section style={{ padding:'64px 24px', maxWidth:1000, margin:'0 auto' }}>
        <h2 style={{ fontSize:28, fontWeight:700, textAlign:'center', color:'#0A0A0A', marginBottom:12 }}>
          3 modes, 1 outil
        </h2>
        <p style={{ textAlign:'center', color:'#6B7280', fontSize:15, marginBottom:48 }}>
          Adapté à votre situation
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {[
            { icon:'👔', title:'Recruteur standard', desc:'CV professionnel optimisé pour passer les filtres ATS et accrocher les recruteurs humains. Score ATS en temps réel.', tag:'Le plus populaire' },
            { icon:'🎓', title:'Parcoursup', desc:'Format lycéen avec les 5 rubriques standardisées. IA alignée sur les attendus des formations visées.', tag:'Spécial lycée' },
            { icon:'🤖', title:'Anti-bots ATS', desc:'Format machine-readable parfait pour Workday, Taleo, SAP. Export texte pur pour les portails en ligne.', tag:'Score 95+' },
          ].map((m) => (
            <div key={m.title} style={{ padding:28, border:'1px solid #E5E7EB', borderRadius:14, background:'#fff' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{m.icon}</div>
              <div style={{ display:'inline-block', padding:'2px 10px', background:'#EFF6FF', color:'#2563EB', borderRadius:20, fontSize:11, fontWeight:600, marginBottom:10 }}>
                {m.tag}
              </div>
              <h3 style={{ fontSize:17, fontWeight:600, color:'#0A0A0A', marginBottom:8 }}>{m.title}</h3>
              <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features IA */}
      <section style={{ background:'#F9FAFB', padding:'64px 24px', borderTop:'1px solid #E5E7EB' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <h2 style={{ fontSize:28, fontWeight:700, textAlign:'center', color:'#0A0A0A', marginBottom:48 }}>
            IA à chaque étape
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {[
              { icon:'📥', title:'Import & Transform', desc:'Uploadez votre ancien CV. L\'IA le parse et le reformule en 3 niveaux.' },
              { icon:'🎯', title:'Job Match 1-clic', desc:'Collez une offre. L\'IA adapte chaque ligne de votre CV aux mots-clés.' },
              { icon:'📊', title:'Score ATS live', desc:'Votre score se recalcule à chaque frappe. Voyez l\'impact immédiatement.' },
              { icon:'🎤', title:'Simulateur entretien', desc:'Questions générées depuis votre CV + offre. Feedback IA sur vos réponses.' },
              { icon:'✍️', title:'Sélection → IA', desc:'Sélectionnez n\'importe quel texte. Une toolbar IA apparaît pour l\'améliorer.' },
              { icon:'🤖', title:'Agent IA', desc:'Dites en français ce que vous voulez changer. L\'agent s\'en occupe.' },
            ].map((f) => (
              <div key={f.title} style={{ padding:24, background:'#fff', border:'1px solid #E5E7EB', borderRadius:12 }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div>
                <h3 style={{ fontSize:14, fontWeight:600, color:'#0A0A0A', marginBottom:6 }}>{f.title}</h3>
                <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding:'80px 24px', textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:700, color:'#0A0A0A', marginBottom:16 }}>
          Prêt à décrocher ce poste ?
        </h2>
        <p style={{ color:'#6B7280', marginBottom:32, fontSize:15 }}>Aucune inscription. Aucune carte bancaire. Juste votre CV.</p>
        <Link href="/builder" style={{ padding:'16px 40px', background:'#2563EB', color:'#fff', borderRadius:10, fontSize:16, fontWeight:600, textDecoration:'none' }}>
          Créer mon CV maintenant →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid #E5E7EB', padding:'24px', textAlign:'center', fontSize:12, color:'#9CA3AF' }}>
        CV.ai — Gratuit, sans inscription, sans pub.
      </footer>
    </main>
  )
}
