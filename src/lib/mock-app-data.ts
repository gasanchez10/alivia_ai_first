export interface LibraryPaper {
  id: string
  title: string
  journal: string
  pmid: string
  doi?: string
  read: boolean
  savedAt: string
  tags: string[]
  excerpt: string
  searchContext?: import('@/lib/library-search-context').LibrarySearchContext
}


export interface PubMedResult {
  id: string
  title: string
  authors: string
  journal: string
  pmid: string
  doi: string
  year: number
  studyType: string
  citations: number
  relevance: number
  openAccess: boolean
  abstract: string
  selected?: boolean
}

export type PlanItemPriority = 'alta' | 'media' | 'baja'

export interface ManagementPlanItem {
  id: string
  claim: string
  pmid: string
  priority: PlanItemPriority
  completed: boolean
}

export interface ManagementPlan {
  id: string
  patientLabel: string
  specialistQuestion?: string
  searchContext: import('@/lib/library-search-context').LibrarySearchContext
  items: ManagementPlanItem[]
  createdAt: string
  updatedAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  pmid: string
}

export interface Presentation {
  id: string
  title: string
  slides: number
  updatedAt: string
  status: 'listo' | 'borrador'
  pmid: string
  searchContext?: import('@/lib/library-search-context').LibrarySearchContext
}

export const dashboardStats = {
  briefingCount: 8,
  encountersPending: 2,
  libraryCount: 12,
  tasksTonight: 3,
  audioMinutes: 12,
}

export const libraryPapers: LibraryPaper[] = [
  {
    id: '1',
    title: 'Apixaban vs warfarin in atrial fibrillation: updated meta-analysis',
    journal: 'NEJM',
    pmid: '38472910',
    doi: '10.1056/NEJMoa2401823',
    read: false,
    savedAt: 'Hoy',
    tags: ['Cardiología', 'FA'],
    excerpt: 'Metaanálisis de 12 RCT. Apixabán reduce sangrado mayor (RR 0.72) sin aumento de ACV.',
  },
  {
    id: '2',
    title: 'Guía MinSalud 2024 — anticoagulación en FA',
    journal: 'MinSalud',
    pmid: '38291044',
    doi: '10.1234/minsalud-fa-2024',
    read: true,
    savedAt: 'Ayer',
    tags: ['Guía', 'LATAM'],
    excerpt: 'Recomendación fuerte: DOAC como primera línea en FA no valvular con CHA₂DS₂-VASc ≥1.',
  },
  {
    id: '3',
    title: 'Burnout en residentes de medicina interna en LATAM',
    journal: 'Lancet Reg Health Am',
    pmid: '38100293',
    read: false,
    savedAt: 'Hace 3 días',
    tags: ['Salud mental'],
    excerpt: 'Prevalencia 62% en R2–R3. Factores: carga horaria, falta de supervisión estructurada.',
  },
  {
    id: '4',
    title: 'Manejo de insuficiencia cardíaca con FEVI reducida — revisión',
    journal: 'Circulation',
    pmid: '37901234',
    read: false,
    savedAt: 'Hace 5 días',
    tags: ['Cardiología', 'IC'],
    excerpt: 'Cuádruple terapia: ARNI, beta-bloqueador, ARM y iSGLT2. Inicio temprano post-hospitalización.',
  },
]

export const encounterTranscript = `Residente: Paciente de 72 años con FA permanente, creatinina 1.4, CHA₂DS₂-VASc 4.
Especialista: ¿Qué anticoagulante elegirías y por qué no warfarina?
Residente: Consideraría apixabán por perfil de sangrado y sin requerir INR.
Especialista: Revisa la guía MinSalud y el metaanálisis reciente de NEJM para mañana.`

export interface ClinicalTerm {
  id: string
  label: string
  isMesh: boolean
}

/** Términos iniciales tras procesar la entrada (demo). */
export const encounterClinicalTerms: ClinicalTerm[] = [
  { id: 't1', label: 'Fibrilación auricular', isMesh: true },
  { id: 't2', label: 'Anticoagulantes', isMesh: true },
  { id: 't3', label: 'Apixabán', isMesh: true },
  { id: 't4', label: 'CHA₂DS₂-VASc', isMesh: false },
  { id: 't5', label: 'DOAC', isMesh: false },
  { id: 't6', label: 'FA no valvular', isMesh: false },
]

/** @deprecated Use encounterClinicalTerms */
export const encounterMeshTerms = encounterClinicalTerms
  .filter((t) => t.isMesh)
  .map((t) => t.label)

export const encounterPubMedResults: PubMedResult[] = [
  {
    id: 'p1',
    title: 'Apixaban vs warfarin in atrial fibrillation: updated meta-analysis',
    authors: 'Hart RG, et al.',
    journal: 'New England Journal of Medicine',
    pmid: '38472910',
    doi: '10.1056/NEJMoa2401823',
    year: 2024,
    studyType: 'Metaanálisis · 12 RCT',
    citations: 89,
    relevance: 98,
    openAccess: false,
    selected: true,
    abstract:
      'Background: Direct oral anticoagulants (DOACs) have largely replaced vitamin K antagonists in atrial fibrillation, but comparative effectiveness data continue to evolve. Methods: We searched PubMed, Embase, and Cochrane through January 2024 for randomized trials comparing apixaban with warfarin in patients with AF. Primary outcomes were stroke or systemic embolism and major bleeding. Results: Twelve trials (n=58,442) were included. Apixaban reduced major bleeding compared with warfarin (RR 0.72, 95% CI 0.61–0.85) with no significant difference in stroke prevention. Conclusions: Apixaban remains a preferred option in non-valvular AF, particularly when bleeding risk is elevated.',
  },
  {
    id: 'p2',
    title: 'Guía de práctica clínica — Anticoagulación en fibrilación auricular',
    authors: 'Grupo de trabajo MinSalud',
    journal: 'Ministerio de Salud y Protección Social',
    pmid: '38291044',
    doi: '10.7705/minsalud.fa.2024',
    year: 2024,
    studyType: 'Guía de práctica clínica',
    citations: 34,
    relevance: 95,
    openAccess: true,
    selected: true,
    abstract:
      'Actualización nacional que prioriza DOAC sobre warfarina en FA no valvular. Recomendación fuerte: apixabán o rivaroxabán como primera línea con CHA₂DS₂-VASc ≥2 (hombres) o ≥3 (mujeres). Incluye esquema de ajuste por función renal, peso y edad, y manejo perioperatorio según riesgo trombótico.',
  },
  {
    id: 'p3',
    title: 'Bleeding risk with DOACs in elderly patients: a systematic review',
    authors: 'Patti G, et al.',
    journal: 'Journal of the American College of Cardiology',
    pmid: '38001222',
    doi: '10.1016/j.jacc.2023.11.045',
    year: 2023,
    studyType: 'Revisión sistemática',
    citations: 156,
    relevance: 87,
    openAccess: false,
    selected: false,
    abstract:
      'Objective: To summarize bleeding outcomes with DOACs in adults ≥75 years. Methods: Systematic review of 28 studies (n=124,000). Results: Major bleeding rates were lower with apixaban vs warfarin (HR 0.68) but similar between rivaroxaban and warfarin in frail subgroups. Conclusions: Apixaban may offer the most favorable bleeding profile in elderly patients with AF.',
  },
  {
    id: 'p4',
    title: 'Rivaroxaban versus warfarin in nonvalvular atrial fibrillation',
    authors: 'Patel MR, et al.',
    journal: 'New England Journal of Medicine',
    pmid: '38110001',
    doi: '10.1056/NEJMoa2301001',
    year: 2023,
    studyType: 'RCT · ROCKET-AF',
    citations: 4120,
    relevance: 82,
    openAccess: false,
    selected: false,
    abstract:
      'In patients with nonvalvular atrial fibrillation, rivaroxaban was noninferior to warfarin for stroke prevention with similar major bleeding, though intracranial hemorrhage was reduced.',
  },
  {
    id: 'p5',
    title: 'Edoxaban versus warfarin in atrial fibrillation with renal impairment',
    authors: 'Böhm M, et al.',
    journal: 'European Heart Journal',
    pmid: '38110002',
    doi: '10.1093/eurheartj/ehad501',
    year: 2023,
    studyType: 'Subanálisis · ENGAGE AF-TIMI 48',
    citations: 234,
    relevance: 79,
    openAccess: false,
    selected: false,
    abstract:
      'Edoxaban 30 mg daily reduced bleeding compared with warfarin in patients with moderate renal impairment without loss of ischemic stroke prevention efficacy.',
  },
  {
    id: 'p6',
    title: 'Dabigatran versus warfarin in atrial fibrillation',
    authors: 'Connolly SJ, et al.',
    journal: 'The Lancet',
    pmid: '38110003',
    doi: '10.1016/S0140-6736(23)01234-5',
    year: 2022,
    studyType: 'RCT · RE-LY',
    citations: 8900,
    relevance: 76,
    openAccess: false,
    selected: false,
    abstract:
      'Dabigatran 150 mg twice daily reduced stroke and systemic embolism with lower rates of intracranial hemorrhage compared with warfarin in nonvalvular AF.',
  },
  {
    id: 'p7',
    title: 'HAS-BLED score performance in Latin American patients with atrial fibrillation',
    authors: 'Villa A, et al.',
    journal: 'PLOS ONE',
    pmid: '38110004',
    doi: '10.1371/journal.pone.0281234',
    year: 2024,
    studyType: 'Cohorte · 6 países',
    citations: 45,
    relevance: 74,
    openAccess: true,
    selected: false,
    abstract:
      'HAS-BLED maintained moderate discrimination for major bleeding in a Latin American cohort (n=3,240). Renal dysfunction and age >75 were the strongest contributors.',
  },
  {
    id: 'p8',
    title: 'Left atrial appendage occlusion vs anticoagulation in high bleeding risk',
    authors: 'Holmes DR, et al.',
    journal: 'JAMA Cardiology',
    pmid: '38110005',
    doi: '10.1001/jamacardio.2023.4567',
    year: 2023,
    studyType: 'Metaanálisis',
    citations: 312,
    relevance: 71,
    openAccess: false,
    selected: false,
    abstract:
      'In patients with contraindications to long-term anticoagulation, LAAO reduced hemorrhagic stroke compared with no therapy but comparative data vs DOACs remain limited.',
  },
  {
    id: 'p9',
    title: 'Perioperative management of DOACs: consensus update',
    authors: 'Douketis JD, et al.',
    journal: 'Chest',
    pmid: '38110006',
    doi: '10.1016/j.chest.2023.09.012',
    year: 2023,
    studyType: 'Guía de consenso',
    citations: 178,
    relevance: 68,
    openAccess: true,
    selected: false,
    abstract:
      'Updated guidance on holding apixaban and rivaroxaban before elective procedures based on bleeding risk and CrCl. Last dose timing tables included for common surgeries.',
  },
  {
    id: 'p10',
    title: 'Cost-effectiveness of apixaban in Colombian patients with atrial fibrillation',
    authors: 'Rodríguez C, et al.',
    journal: 'Biomédica',
    pmid: '38110007',
    doi: '10.7705/biomedica.98765',
    year: 2024,
    studyType: 'Análisis costo-efectividad',
    citations: 12,
    relevance: 65,
    openAccess: true,
    selected: false,
    abstract:
      'Apixaban was dominant vs warfarin in a Colombian Markov model when medication adherence and monitoring costs were included. Sensitivity analyses favored DOACs across CHA₂DS₂-VASc ≥2.',
  },
  {
    id: 'p11',
    title: 'Anticoagulation in atrial fibrillation and chronic kidney disease stage 3–4',
    authors: 'Hart RG, et al.',
    journal: 'Circulation',
    pmid: '38110008',
    doi: '10.1161/CIRCULATIONAHA.123.045678',
    year: 2023,
    studyType: 'Revisión narrativa',
    citations: 267,
    relevance: 63,
    openAccess: false,
    selected: false,
    abstract:
      'Reviews dose adjustment of apixaban, rivaroxaban, and edoxaban in CKD. Warfarin remains an option when DOACs are contraindicated but requires closer INR monitoring.',
  },
  {
    id: 'p12',
    title: 'Shared decision-making for anticoagulation in older adults with AF',
    authors: 'Kunneman M, et al.',
    journal: 'BMJ',
    pmid: '38110009',
    doi: '10.1136/bmj.2023-075432',
    year: 2023,
    studyType: 'Ensayo de decisión compartida',
    citations: 89,
    relevance: 58,
    openAccess: true,
    selected: false,
    abstract:
      'A decision aid improved patient knowledge and reduced decisional conflict when choosing between warfarin and DOACs without increasing visit duration.',
  },
]

export const encounterPlan = {
  patient: 'Hombre 72 años · FA permanente',
  items: [
    {
      claim: 'Apixabán 5 mg c/12 h es primera línea según guía MinSalud en FA no valvular con CHA₂DS₂-VASc ≥2.',
      pmid: '38291044',
    },
    {
      claim: 'Metaanálisis NEJM 2024: menor sangrado mayor vs warfarina (RR 0.72, IC 95% 0.61–0.85).',
      pmid: '38472910',
    },
    {
      claim: 'Ajustar dosis a 2.5 mg c/12 h si ≥2 de: edad ≥80, peso ≤60 kg, creatinina ≥1.5.',
      pmid: '38291044',
    },
  ],
  specialistQuestion: '¿Por qué apixabán y no rivaroxabán en este paciente?',
}

export const encounterStudyPlan = {
  taskSummary: 'Responder la pregunta del especialista con evidencia citada',
  readings: [
    { title: 'Metaanálisis apixabán vs warfarina (NEJM)', pmid: '38472910', minutes: 15 },
    { title: 'Guía MinSalud anticoagulación FA', pmid: '38291044', minutes: 10 },
  ],
  quiz: 'Quiz: apixabán vs rivaroxabán en FA con IRC leve',
  quizMinutes: 5,
  answerDraft:
    'Apixabán 5 mg c/12 h como primera línea (MinSalud, PMID 38291044). Menor sangrado mayor vs warfarina en metaanálisis NEJM 2024 (PMID 38472910). Ajustar a 2.5 mg si ≥2 criterios de dosis reducida.',
}

export const consultaPico = {
  patient: 'Mujer 58 años, HTA, dislipidemia',
  question: '¿Los iSGLT2 reducen eventos cardiovasculares en pacientes sin diabetes?',
  intervention: 'Inhibidores SGLT2',
  comparison: 'Placebo o estándar',
  outcome: 'MACE, muerte cardiovascular, hospitalización por IC',
}

export const seedManagementPlans: ManagementPlan[] = [
  {
    id: 'plan-ronda-seed',
    patientLabel: encounterPlan.patient,
    specialistQuestion: encounterPlan.specialistQuestion,
    searchContext: {
      sourceLabel: 'Ronda · Cama 12',
      clinicalQuestion: encounterPlan.specialistQuestion,
      patientLabel: encounterPlan.patient,
      pmids: [...new Set(encounterPlan.items.map((item) => item.pmid))],
      origin: 'ronda',
    },
    items: encounterPlan.items.map((item, i) => ({
      id: `seed-item-${i}`,
      claim: item.claim,
      pmid: item.pmid,
      priority: i === 0 ? 'alta' : 'media',
      completed: i === encounterPlan.items.length - 1,
    })),
    createdAt: '2026-06-28T18:00:00.000Z',
    updatedAt: '2026-06-29T09:15:00.000Z',
  },
  {
    id: 'plan-consulta-seed',
    patientLabel: consultaPico.patient,
    specialistQuestion: consultaPico.question,
    searchContext: {
      sourceLabel: 'Consulta · iSGLT2 sin diabetes',
      clinicalQuestion: consultaPico.question,
      patientLabel: consultaPico.patient,
      pmids: ['38472910', '38291044'],
      origin: 'consulta',
    },
    items: [
      {
        id: 'consulta-item-1',
        claim:
          'Recomendar iSGLT2 en paciente sin diabetes con IC o alto riesgo CV, citando ensayos con empagliflozina y dapagliflozina.',
        pmid: '38472910',
        priority: 'alta',
        completed: false,
      },
      {
        id: 'consulta-item-2',
        claim: 'Documentar beneficio en MACE y hospitalización por IC en la nota de evolución.',
        pmid: '38291044',
        priority: 'baja',
        completed: false,
      },
    ],
    createdAt: '2026-06-27T14:30:00.000Z',
    updatedAt: '2026-06-27T14:30:00.000Z',
  },
]

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question:
      'Paciente 72 años, FA permanente, Cr 1.4 mg/dL, CHA₂DS₂-VASc 4. ¿Primera línea según MinSalud?',
    options: ['Warfarina', 'Apixabán 5 mg c/12 h', 'AAS 100 mg', 'Sin anticoagulación'],
    correct: 1,
    explanation:
      'MinSalud 2024 recomienda DOAC como primera línea. Apixabán 5 mg c/12 h con ajuste si criterios de dosis reducida.',
    pmid: '38291044',
  },
  {
    id: 'q2',
    question: 'Según el metaanálisis NEJM 2024, apixabán vs warfarina en sangrado mayor:',
    options: [
      'Aumenta sangrado mayor',
      'Sin diferencia',
      'Reduce sangrado mayor (RR ~0.72)',
      'Solo beneficio en <65 años',
    ],
    correct: 2,
    explanation: 'RR 0.72 (IC 95% 0.61–0.85) a favor de apixabán para sangrado mayor.',
    pmid: '38472910',
  },
  {
    id: 'q3',
    question: '¿Cuándo reducir apixabán a 2.5 mg c/12 h según guía MinSalud?',
    options: [
      'Siempre en >70 años',
      'Si ≥2 de: edad ≥80, peso ≤60 kg, creatinina ≥1.5',
      'Solo si CrCl <30',
      'Nunca en FA no valvular',
    ],
    correct: 1,
    explanation: 'Criterios de dosis reducida: ≥2 de edad ≥80, peso ≤60 kg, creatinina sérica ≥1.5 mg/dL.',
    pmid: '38291044',
  },
  {
    id: 'q4',
    question: 'En FA permanente con CHA₂DS₂-VASc 4, ¿cuál es el error más grave?',
    options: [
      'Iniciar DOAC sin ecocardiograma reciente',
      'No anticoagular por miedo al sangrado sin evaluar riesgo',
      'Usar apixabán en lugar de warfarina',
      'Repetir INR mensual',
    ],
    correct: 1,
    explanation: 'El subtratamiento anticoagulante en FA de alto riesgo embolígeno incrementa ACV evitable.',
    pmid: '38472910',
  },
  {
    id: 'q5',
    question: '¿Qué ventaja citan los RCT sobre apixabán frente a warfarina en sangrado intracraneal?',
    options: [
      'Mayor incidencia de SNC',
      'Reducción significativa de sangrado intracraneal',
      'Solo en valvulopatía',
      'Sin datos en metaanálisis',
    ],
    correct: 1,
    explanation: 'Los metaanálisis muestran menor sangrado intracraneal con apixabán vs warfarina.',
    pmid: '38472910',
  },
]

export const presentations: Presentation[] = [
  {
    id: 'pr1',
    title: 'Journal club — Anticoagulación en FA (NEJM 2024)',
    slides: 14,
    updatedAt: 'Hace 2 h',
    status: 'listo',
    pmid: '38472910',
  },
  {
    id: 'pr2',
    title: 'Exposición caso — IC con FEVI reducida',
    slides: 8,
    updatedAt: 'Ayer',
    status: 'borrador',
    pmid: '37901234',
  },
]

export const profilePlan = {
  name: 'Residente Pro',
  price: '$9.99/mes',
  renews: '15 jul 2026',
  features: ['La Ronda + grabación', 'Quizzes ilimitados', 'Presentaciones PPTX'],
}

export const helpFaq = [
  {
    q: '¿Alivia alucina citas?',
    a: 'No. Toda afirmación clínica enlaza a un PMID verificable en PubMed. Si no hay evidencia, Alivia lo indica.',
  },
  {
    q: '¿Cómo inicio una ronda?',
    a: 'Ve a Ronda → graba en vivo, sube un audio que ya tengas, o pega el texto del caso. Alivia transcribe si hace falta, extrae términos y busca en PubMed.',
  },
  {
    q: '¿Qué es la lista nocturna?',
    a: 'Al final del día, Alivia prioriza qué leer según tus rondas, lagunas y preguntas del especialista.',
  },
  {
    q: '¿Puedo usar Alivia sin internet?',
    a: 'Los artículos y audios descargados están disponibles offline como PWA.',
  },
  {
    q: 'Contacto',
    a: 'hola@alivia-ai.com · WhatsApp en horario de soporte LATAM.',
  },
]
