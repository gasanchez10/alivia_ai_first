import type { Locale } from '@/lib/i18n'

export type PricingTierId = 'trial' | 'student' | 'pro' | 'institution'

export interface PricingPlan {
  id: PricingTierId
  name: string
  price: string
  priceDetail?: string
  note: string
  cta: string
  highlight?: boolean
  badge?: string
}

export interface PlatformFeature {
  id: string
  category: Record<Locale, string>
  name: Record<Locale, string>
  tooltip: Record<Locale, string>
  tiers: PricingTierId[]
}

/** All paid and free tiers. */
export const ALL_TIERS: PricingTierId[] = ['trial', 'student', 'pro', 'institution']

/** Basic tier = 15-day trial + founding student (same feature set). */
export const BASIC_TIERS: PricingTierId[] = ['trial', 'student']

/** Estudiante fundador and above (excludes 15-day trial only). */
export const FOUNDING_AND_ABOVE: PricingTierId[] = ['student', 'pro', 'institution']

/** Merged pricing matrix section for encounter + clinical queries. */
export const ENCOUNTER_CATEGORY = {
  es: 'La Ronda y consultas clínicas',
  en: 'Rounds & clinical queries',
} as const

export const pricingPlans: Record<Locale, PricingPlan[]> = {
  es: [
    {
      id: 'trial',
      name: 'Prueba',
      price: '$0',
      priceDetail: '15 días',
      note: 'Sin tarjeta · Funciones esenciales',
      cta: 'Empezar prueba',
      badge: 'Freemium',
    },
    {
      id: 'student',
      name: 'Estudiante fundador',
      price: 'Gratis',
      priceDetail: 'para siempre',
      note: 'Correo @universidad verificado',
      cta: 'Verificar estudiante',
      badge: 'Cohorte fundadora',
    },
    {
      id: 'pro',
      name: 'Residente Pro',
      price: '$9.99',
      priceDetail: '/mes',
      note: '$89/año',
      cta: 'Elegir Pro',
      highlight: true,
      badge: 'Más popular',
    },
    {
      id: 'institution',
      name: 'Institución',
      price: 'A medida',
      note: 'Universidades, hospitales y programas',
      cta: 'Agendar demo',
    },
  ],
  en: [
    {
      id: 'trial',
      name: 'Trial',
      price: '$0',
      priceDetail: '15 days',
      note: 'No card · Essential features',
      cta: 'Start trial',
      badge: 'Freemium',
    },
    {
      id: 'student',
      name: 'Founding Student',
      price: 'Free',
      priceDetail: 'forever',
      note: 'Verified @university email',
      cta: 'Verify student',
      badge: 'Founder cohort',
    },
    {
      id: 'pro',
      name: 'Resident Pro',
      price: '$9.99',
      priceDetail: '/mo',
      note: '$89/yr',
      cta: 'Choose Pro',
      highlight: true,
      badge: 'Most popular',
    },
    {
      id: 'institution',
      name: 'Institution',
      price: 'Custom',
      note: 'Universities, hospitals & programs',
      cta: 'Book a demo',
    },
  ],
}

export const platformFeatures: PlatformFeature[] = [
  {
    id: 'briefing-daily',
    category: { es: 'El Briefing', en: 'The Briefing' },
    name: {
      es: 'Briefing diario en español (guías, congresos, evidencia nueva)',
      en: 'Daily Spanish briefing (guidelines, congresses, new evidence)',
    },
    tooltip: {
      es: 'Cada mañana recibes un resumen curado en español: guías nuevas o actualizadas (con badge NUEVO y qué revisar), fechas de congresos relevantes y artículos clave de las últimas 24–48 h en tu especialidad. Es el punto de partida del día — lo que necesitas saber antes de la ronda.',
      en: 'Every morning you get a curated Spanish digest: new or updated guidelines (with a NEW badge and what to review), relevant congress dates, and key papers from the last 24–48 hours in your specialty. It is your day’s starting point — what you need before rounds.',
    },
    tiers: BASIC_TIERS,
  },
  {
    id: 'briefing-audio',
    category: { es: 'El Briefing', en: 'The Briefing' },
    name: {
      es: 'Audio del briefing para el trayecto (~12 min)',
      en: 'Commute audio briefing (~12 min)',
    },
    tooltip: {
      es: 'Versión en audio del briefing (~12 min) para escuchar en el bus, metro o entre servicios. Misma evidencia que el texto, optimizada para consumo manos libres.',
      en: 'Audio version of the briefing (~12 min) for your commute or between shifts. Same evidence as the text, optimized for hands-free listening.',
    },
    tiers: ALL_TIERS,
  },
  {
    id: 'discovery-trending',
    category: { es: 'El Briefing', en: 'The Briefing' },
    name: {
      es: 'Artículos más citados en tu especialidad',
      en: 'Most-cited papers in your specialty',
    },
    tooltip: {
      es: 'Feed de artículos con alto impacto de citación en tu especialidad, actualizado desde PubMed. Sirve para priorizar lectura: lo que la comunidad científica ya validó como referencia.',
      en: 'Feed of high-impact cited papers in your specialty, updated from PubMed. Helps you prioritize reading: what the scientific community already treats as a reference.',
    },
    tiers: ALL_TIERS,
  },
  {
    id: 'encounter-record',
    category: ENCOUNTER_CATEGORY,
    name: {
      es: 'Grabación y transcripción de rondas (consentimiento / enseñanza)',
      en: 'Round recording & transcription (consent / teaching mode)',
    },
    tooltip: {
      es: 'Graba en la ronda, sube un archivo de audio o pega texto del caso. Alivia transcribe en español cuando aplica y deja el texto listo para extraer términos clínicos y buscar evidencia.',
      en: 'Record on rounds, upload an audio file, or paste case text. Alivia transcribes in Spanish when needed and prepares the text for clinical term extraction and evidence search.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'queries-new',
    category: ENCOUNTER_CATEGORY,
    name: {
      es: 'Nueva consulta clínica con flujo guiado',
      en: 'New clinical query with guided workflow',
    },
    tooltip: {
      es: 'Flujo paso a paso para plantear una pregunta clínica (PICO), refinar la búsqueda, revisar resultados de PubMed y llegar a una respuesta citada. Ideal cuando no partes de una grabación sino de un caso puntual.',
      en: 'Step-by-step flow to frame a clinical question (PICO), refine the search, review PubMed results, and reach a cited answer. Ideal when you start from a specific case, not a recording.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'encounter-mesh',
    category: ENCOUNTER_CATEGORY,
    name: {
      es: 'Extracción MeSH + búsqueda PubMed en tiempo real',
      en: 'MeSH extraction + live PubMed search',
    },
    tooltip: {
      es: 'A partir de la transcripción o del caso, Alivia identifica términos MeSH y no-MeSH y lanza búsquedas en PubMed al instante. Tú apruebas las fuentes antes de que se use evidencia en un plan.',
      en: 'From the transcript or case, Alivia identifies MeSH and non-MeSH terms and runs PubMed searches instantly. You approve sources before evidence is used in a plan.',
    },
    tiers: FOUNDING_AND_ABOVE,
  },
  {
    id: 'queries-pubmed',
    category: ENCOUNTER_CATEGORY,
    name: {
      es: 'Búsqueda PubMed manual y resultados clasificados',
      en: 'Manual PubMed search & classified results',
    },
    tooltip: {
      es: 'Motor de búsqueda PubMed integrado con filtros por especialidad, tipo de estudio y relevancia. Los resultados llegan clasificados para que no pierdas tiempo en abstracts irrelevantes.',
      en: 'Integrated PubMed search with filters by specialty, study type, and relevance. Results are ranked so you do not waste time on irrelevant abstracts.',
    },
    tiers: BASIC_TIERS,
  },
  {
    id: 'encounter-plan',
    category: ENCOUNTER_CATEGORY,
    name: {
      es: 'Plan por paciente con citas PMID verificables',
      en: 'Per-patient plan with verifiable PMIDs',
    },
    tooltip: {
      es: 'Genera un plan de manejo o estudio por paciente donde cada afirmación clínica enlaza a un PMID real en PubMed. Clic en la cita → artículo fuente. Cero texto sin respaldo bibliográfico.',
      en: 'Generates a management or study plan per patient where every clinical statement links to a real PubMed PMID. Click the citation → source article. No unsupported clinical text.',
    },
    tiers: FOUNDING_AND_ABOVE,
  },
  {
    id: 'encounter-night-list',
    category: ENCOUNTER_CATEGORY,
    name: {
      es: 'Lista nocturna de lectura',
      en: 'Nightly reading list',
    },
    tooltip: {
      es: 'Al final del día, una lista priorizada de qué leer esta noche: artículos y temas derivados de tus rondas, lagunas detectadas y preguntas del especialista. Convierte el caos post-guardia en un plan de 30–45 min.',
      en: 'At day’s end, a prioritized list of what to read tonight: papers and topics from your rounds, detected gaps, and specialist questions. Turns post-shift chaos into a 30–45 minute plan.',
    },
    tiers: FOUNDING_AND_ABOVE,
  },
  {
    id: 'queries-pending',
    category: ENCOUNTER_CATEGORY,
    name: {
      es: 'Mis pendientes',
      en: 'My pending tasks',
    },
    tooltip: {
      es: 'Bandeja de tareas clínicas y académicas: artículos por leer, preguntas por responder, planes por cerrar. Todo lo que salió de rondas y consultas, en un solo lugar.',
      en: 'Inbox for clinical and academic tasks: papers to read, questions to answer, plans to finish. Everything from rounds and queries, in one place.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'library-unlimited',
    category: { es: 'La Biblioteca', en: 'The Library' },
    name: {
      es: 'Biblioteca ilimitada',
      en: 'Unlimited library',
    },
    tooltip: {
      es: 'Guarda todos los artículos que quieras desde búsquedas, el briefing o subida de PDF. Tu repositorio personal de evidencia, siempre disponible en la app.',
      en: 'Save as many papers as you want from searches, the briefing, or PDF upload. Your personal evidence repository, always available in the app.',
    },
    tiers: ALL_TIERS,
  },
  {
    id: 'library-summary',
    category: { es: 'La Biblioteca', en: 'The Library' },
    name: {
      es: 'Resúmenes estructurados',
      en: 'Structured summaries',
    },
    tooltip: {
      es: 'Resumen en español con secciones fijas: pregunta, métodos, hallazgos, implicancia clínica y limitaciones. Cada punto relevante referenciado al texto original o al PMID.',
      en: 'Spanish summary with fixed sections: question, methods, findings, clinical takeaway, and limitations. Each relevant point tied to the original text or PMID.',
    },
    tiers: ALL_TIERS,
  },
  {
    id: 'library-podcast',
    category: { es: 'La Biblioteca', en: 'The Library' },
    name: {
      es: 'Podcast y audiolibro por artículo',
      en: 'Per-article podcast & audiobook',
    },
    tooltip: {
      es: 'Convierte cualquier artículo guardado en audio (~10–12 min) en español. Para el trayecto, el gimnasio o cerrar los ojos después de un guardia de 24 h.',
      en: 'Turn any saved paper into ~10–12 minute Spanish audio. For your commute, the gym, or closing your eyes after a 24-hour shift.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'library-presentation',
    category: { es: 'La Biblioteca', en: 'The Library' },
    name: {
      es: 'Presentación con citas exportable (PPTX)',
      en: 'Cited presentation export (PPTX)',
    },
    tooltip: {
      es: 'Genera diapositivas listas para journal club o exposición de caso, con citas en cada slide. Exportas PPTX y ajustas el diseño en PowerPoint o Google Slides.',
      en: 'Generates journal club or case presentation slides with citations on each slide. Export PPTX and refine the design in PowerPoint or Google Slides.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'library-chat',
    category: { es: 'La Biblioteca', en: 'The Library' },
    name: {
      es: 'Chat con el artículo',
      en: 'Chat with paper',
    },
    tooltip: {
      es: 'Haz preguntas sobre un artículo guardado. Alivia responde solo con base en ese PDF o registro PubMed, citando párrafo o sección — no inventa datos del estudio.',
      en: 'Ask questions about a saved paper. Alivia answers only from that PDF or PubMed record, citing paragraph or section — it does not invent study data.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'library-compare',
    category: { es: 'La Biblioteca', en: 'The Library' },
    name: {
      es: 'Comparar dos artículos lado a lado',
      en: 'Side-by-side paper comparison',
    },
    tooltip: {
      es: 'Compara dos papers en población, intervención, desenlaces y nivel de evidencia. Útil para resolver discrepancias entre guías o preparar una discusión en ronda.',
      en: 'Compare two papers on population, intervention, outcomes, and evidence level. Useful for resolving guideline conflicts or preparing a round discussion.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'library-citations',
    category: { es: 'La Biblioteca', en: 'The Library' },
    name: {
      es: 'Exportar citas AMA y Vancouver',
      en: 'AMA & Vancouver citation export',
    },
    tooltip: {
      es: 'Exporta la bibliografía del artículo o de tu selección en formato AMA o Vancouver, listo para pegar en un protocolo, tesis o presentación institucional.',
      en: 'Export bibliography for a paper or your selection in AMA or Vancouver format, ready to paste into a protocol, thesis, or institutional presentation.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'quiz-basic',
    category: { es: 'Cuestionarios y examen', en: 'Quizzes & exams' },
    name: {
      es: 'Quiz básico semanal (1 por semana)',
      en: 'Basic weekly quiz (1 per week)',
    },
    tooltip: {
      es: 'Un cuestionario automático por semana a partir de lo que leíste o de temas del briefing. Repaso ligero para no perder el hilo entre guardias.',
      en: 'One auto-generated quiz per week from what you read or briefing topics. Light review so you do not lose the thread between shifts.',
    },
    tiers: BASIC_TIERS,
  },
  {
    id: 'quiz-full',
    category: { es: 'Cuestionarios y examen', en: 'Quizzes & exams' },
    name: {
      es: 'Quizzes ilimitados desde artículos y rondas',
      en: 'Unlimited quizzes from papers & rounds',
    },
    tooltip: {
      es: 'Genera quizzes ilimitados desde cualquier artículo, plan de paciente o pregunta de ronda. Preguntas tipo examen con explicación y referencia al fuente.',
      en: 'Generate unlimited quizzes from any paper, patient plan, or round question. Exam-style questions with explanation and source reference.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'quiz-spaced',
    category: { es: 'Cuestionarios y examen', en: 'Quizzes & exams' },
    name: {
      es: 'Repetición espaciada y prep por año / especialidad / país',
      en: 'Spaced repetition & prep by year / specialty / country',
    },
    tooltip: {
      es: 'Plan de estudio adaptado a tu año de formación, especialidad y país (EUNACOM, internado, R1–R4). Repetición espaciada sobre tus lagunas reales, no un mazo genérico en inglés.',
      en: 'Study plan adapted to your training year, specialty, and country. Spaced repetition on your real gaps, not a generic English deck.',
    },
    tiers: ['pro', 'institution'],
  },
  {
    id: 'trust-pmid',
    category: { es: 'Confianza y plataforma', en: 'Trust & platform' },
    name: {
      es: 'Cero afirmaciones clínicas sin PMID verificable',
      en: 'Zero clinical claims without verifiable PMID',
    },
    tooltip: {
      es: 'Regla de producto: ninguna recomendación clínica se muestra sin un PMID que abre en PubMed. Si no hay evidencia, Alivia lo dice — no rellena con texto inventado.',
      en: 'Product rule: no clinical recommendation is shown without a PMID that opens in PubMed. If there is no evidence, Alivia says so — no filler invented text.',
    },
    tiers: ['trial', 'student', 'pro', 'institution'],
  },
  {
    id: 'trust-latam',
    category: { es: 'Confianza y plataforma', en: 'Trust & platform' },
    name: {
      es: 'Español nativo + guías LATAM priorizadas',
      en: 'Native Spanish + LATAM guidelines prioritized',
    },
    tooltip: {
      es: 'Interfaz y contenido pensados para residentes LATAM. MinSalud, guías regionales y congresos locales tienen prioridad sobre flujos centrados en EE. UU.',
      en: 'Interface and content built for LATAM residents. MinSalud, regional guidelines, and local congresses are prioritized over US-centric workflows.',
    },
    tiers: ['trial', 'student', 'pro', 'institution'],
  },
  {
    id: 'platform-pwa',
    category: { es: 'Confianza y plataforma', en: 'Trust & platform' },
    name: {
      es: 'PWA en iOS, Android y escritorio',
      en: 'PWA on iOS, Android & desktop',
    },
    tooltip: {
      es: 'Instala Alivia como app en el celular o úsala en el navegador. Acceso offline a artículos y audios ya descargados — útil en hospital con mala señal.',
      en: 'Install Alivia as an app on your phone or use it in the browser. Offline access to downloaded papers and audio — useful in hospitals with poor signal.',
    },
    tiers: ['trial', 'student', 'pro', 'institution'],
  },
  {
    id: 'platform-profile',
    category: { es: 'Confianza y plataforma', en: 'Trust & platform' },
    name: {
      es: 'Perfil, especialidad, año y verificación institucional',
      en: 'Profile, specialty, year & institutional verification',
    },
    tooltip: {
      es: 'Configuras especialidad, año de formación y universidad/hospital. La verificación por correo institucional desbloquea beneficios (p. ej. Estudiante fundador) y personaliza el briefing.',
      en: 'Set specialty, training year, and university/hospital. Institutional email verification unlocks benefits (e.g. Founding Student) and personalizes the briefing.',
    },
    tiers: ['trial', 'student', 'pro', 'institution'],
  },
  {
    id: 'institution-seats',
    category: { es: 'Institución', en: 'Institution' },
    name: {
      es: 'Residente Pro para toda la cohorte',
      en: 'Resident Pro for entire cohort',
    },
    tooltip: {
      es: 'Licenciamiento masivo: todos los residentes o estudiantes de un programa con acceso Pro. Facturación única a la universidad o hospital.',
      en: 'Bulk licensing: all residents or students in a program get Pro access. Single invoice to the university or hospital.',
    },
    tiers: ['institution'],
  },
  {
    id: 'institution-dashboard',
    category: { es: 'Institución', en: 'Institution' },
    name: {
      es: 'Dashboard decanato y métricas de uso',
      en: 'Dean dashboard & usage metrics',
    },
    tooltip: {
      es: 'Panel para decanato o jefatura: adopción, horas estimadas ahorradas, temas más consultados y cumplimiento de lectura. Datos agregados, sin exponer casos clínicos.',
      en: 'Panel for deans or program leads: adoption, estimated hours saved, top topics, and reading compliance. Aggregated data, no exposed clinical cases.',
    },
    tiers: ['institution'],
  },
  {
    id: 'institution-onboarding',
    category: { es: 'Institución', en: 'Institution' },
    name: {
      es: 'Onboarding y soporte dedicado',
      en: 'Dedicated onboarding & support',
    },
    tooltip: {
      es: 'Implementación guiada: altas en lote, sesión de capacitación para residentes, canal de soporte prioritario y materiales para director de programa.',
      en: 'Guided rollout: bulk provisioning, resident training session, priority support channel, and materials for program directors.',
    },
    tiers: ['institution'],
  },
]

export function featureIncluded(feature: PlatformFeature, tierId: PricingTierId): boolean {
  return feature.tiers.includes(tierId)
}

export function featuresByCategory(locale: Locale): { category: string; features: PlatformFeature[] }[] {
  const seen = new Map<string, PlatformFeature[]>()

  for (const feature of platformFeatures) {
    const cat = feature.category[locale]
    const list = seen.get(cat) ?? []
    list.push(feature)
    seen.set(cat, list)
  }

  return Array.from(seen.entries()).map(([category, features]) => ({ category, features }))
}

export const TIER_COLUMNS: PricingTierId[] = ['trial', 'student', 'pro', 'institution']

export function tierLabel(locale: Locale, tierId: PricingTierId): string {
  const plan = pricingPlans[locale].find((p) => p.id === tierId)
  return plan?.name ?? tierId
}
