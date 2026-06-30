/** Rich briefing feed — emulates real LATAM resident morning digest. */

export interface BriefingGuide {
  id: string
  type: 'guide'
  tag: string
  title: string
  organization: string
  country: string
  year: number
  specialty: string
  publishedAt: string
  timeLabel: string
  isNew?: boolean
  summary: string
  keyChanges: string[]
  targetPopulation: string
  officialUrl: string
  language: string
  /** Destacado cuando la guía acaba de publicarse (antes “alerta”). */
  actionRequired?: string
}

export interface BriefingCongress {
  id: string
  type: 'congress'
  tag: string
  title: string
  society: string
  specialty: string
  year: number
  location: string
  venue: string
  country: string
  startDate: string
  endDate: string
  format: string
  timeLabel: string
  isNew?: boolean
  registrationUrl: string
  registrationDeadline: string
  earlyBirdDeadline?: string
  abstractDeadline?: string
  summary: string
  highlights: string[]
}

export interface BriefingPaper {
  id: string
  type: 'paper'
  tag: string
  title: string
  authors: string
  journal: string
  year: number
  pmid: string
  doi: string
  studyType: string
  specialty: string
  citations: number
  timeLabel: string
  isNew?: boolean
  openAccess: boolean
  abstract: string
  clinicalTakeaway: string
}

export type BriefingFeedItem = BriefingGuide | BriefingCongress | BriefingPaper

export const briefingAudio = {
  title: 'Resumen en audio',
  duration: '12:08',
  summary: 'MinSalud FA · ACC Chicago 2026 · NEJM apixabán · ESC diabetes cardiovascular.',
}

export const briefingFeed: BriefingFeedItem[] = [
  {
    id: 'g-minsalud-fa',
    type: 'guide',
    tag: 'Guía clínica',
    title: 'Anticoagulación en fibrilación auricular',
    organization: 'Ministerio de Salud y Protección Social',
    country: 'Colombia',
    year: 2024,
    specialty: 'Cardiología · Medicina interna',
    publishedAt: '12 mar 2024',
    timeLabel: 'Hace 2 h',
    isNew: true,
    summary:
      'Actualización nacional que prioriza antagonistas de trombina y factor Xa (DOAC) sobre warfarina en FA no valvular, con esquema de ajuste en función renal y riesgo de sangrado.',
    keyChanges: [
      'DOAC como primera línea en FA no valvular con CHA₂DS₂-VASc ≥2 (hombres) o ≥3 (mujeres)',
      'Apixabán 5 mg c/12 h; reducir a 2.5 mg si ≥2 criterios: edad ≥80, peso ≤60 kg, Cr ≥1.5',
      'HAS-BLED obligatorio antes de iniciar — no contraindica, orienta seguimiento',
      'Manejo perioperatorio según riesgo trombótico y tipo de procedimiento',
    ],
    targetPopulation: 'Adultos con fibrilación auricular no valvular en atención primaria y hospitalaria',
    officialUrl: 'https://www.minsalud.gov.co',
    language: 'Español',
  },
  {
    id: 'c-acc-2026',
    type: 'congress',
    tag: 'Congreso',
    title: 'ACC Scientific Sessions 2026',
    society: 'American College of Cardiology (ACC)',
    specialty: 'Cardiología',
    year: 2026,
    location: 'Chicago, Illinois',
    venue: 'McCormick Place · Lakeside Center',
    country: 'Estados Unidos',
    startDate: '28 mar 2026',
    endDate: '30 mar 2026',
    format: 'Presencial + acceso virtual (On Demand)',
    timeLabel: 'Hoy',
    isNew: true,
    registrationUrl: 'https://www.acc.org',
    registrationDeadline: '15 mar 2026',
    earlyBirdDeadline: '1 feb 2026',
    abstractDeadline: '15 sep 2025',
    summary:
      'Principal congreso de cardiología en EE. UU. Guías, ensayos clínicos de fase III y simposios de imagen cardiaca. Descuento estudiantes y fellows con credencial activa.',
    highlights: [
      'Simposio LATAM Cardiology — sáb 29 mar, 14:00 CST',
      'Late-breaking clinical trials — dom 30 mar',
      'Hands-on echo workshop (cupo limitado, registro aparte)',
    ],
  },
  {
    id: 'p-nejm-apixaban',
    type: 'paper',
    tag: 'Nuevo en PubMed',
    title: 'Apixaban versus warfarin in atrial fibrillation: an updated systematic review and meta-analysis',
    authors: 'Hart RG, et al.',
    journal: 'New England Journal of Medicine',
    year: 2024,
    pmid: '38472910',
    doi: '10.1056/NEJMoa2401823',
    studyType: 'Metaanálisis · 12 RCT',
    specialty: 'Cardiología',
    citations: 89,
    timeLabel: 'Ayer',
    isNew: true,
    openAccess: false,
    abstract:
      'Background: Direct oral anticoagulants (DOACs) have largely replaced vitamin K antagonists in atrial fibrillation, but comparative effectiveness data continue to evolve. Methods: We searched PubMed, Embase, and Cochrane through January 2024 for randomized trials comparing apixaban with warfarin in patients with AF. Primary outcomes were stroke or systemic embolism and major bleeding. Results: Twelve trials (n=58,442) were included. Apixaban reduced major bleeding compared with warfarin (RR 0.72, 95% CI 0.61–0.85) with no significant difference in stroke prevention. Conclusions: Apixaban remains a preferred option in non-valvular AF, particularly when bleeding risk is elevated.',
    clinicalTakeaway:
      'En FA no valvular, apixabán reduce sangrado mayor sin perder eficacia en ACV — argumento sólido para ronda cuando el especialista cuestiona warfarina.',
  },
  {
    id: 'g-esc-diabetes',
    type: 'guide',
    tag: 'Guía clínica',
    title: 'Diabetes y enfermedad cardiovascular',
    organization: 'European Society of Cardiology (ESC)',
    country: 'Internacional (Europa)',
    year: 2024,
    specialty: 'Cardiología · Endocrinología',
    publishedAt: '27 jun 2024',
    timeLabel: 'Hace 3 días',
    isNew: true,
    summary:
      'La ESC publicó actualización con énfasis en iSGLT2 y GLP-1 RA con beneficio cardiovascular independiente de la meta glucémica en pacientes con alto riesgo CV.',
    keyChanges: [
      'iSGLT2 y GLP-1 RA con beneficio CV independiente de HbA1c en alto riesgo',
      'Inicio temprano post-evento cardiovascular',
      'Combinación con ARM en IC con FEVI reducida cuando corresponda',
    ],
    targetPopulation: 'Adultos con diabetes tipo 2 y enfermedad cardiovascular o alto riesgo CV',
    officialUrl: 'https://www.escardio.org',
    language: 'Inglés · resumen en español en Alivia',
    actionRequired:
      'Revisar algoritmo de inicio temprano post-evento y combinación con ARM en IC con FEVI reducida',
  },
  {
    id: 'g-esc-hf',
    type: 'guide',
    tag: 'Guía internacional',
    title: 'Focused update on heart failure management',
    organization: 'ESC · EASD',
    country: 'Internacional (Europa)',
    year: 2024,
    specialty: 'Cardiología',
    publishedAt: '8 ene 2024',
    timeLabel: 'Hace 1 sem',
    summary:
      'Refuerza cuádruple terapia en IC con FEVI reducida: ARNI, beta-bloqueador, ARM e iSGLT2. Ventana de inicio temprano post-hospitalización ≤14 días.',
    keyChanges: [
      'iSGLT2 indicado en IC con FEVI reducida independiente de diabetes',
      'ARNI preferido sobre IECA/ARA II en pacientes que toleran',
      'Objetivo de titulación en 3 meses cuando sea posible',
    ],
    targetPopulation: 'Adultos con IC crónica FEVI ≤40%',
    officialUrl: 'https://www.escardio.org',
    language: 'Inglés · resumen en español en Alivia',
  },
  {
    id: 'c-socendi',
    type: 'congress',
    tag: 'Congreso LATAM',
    title: 'Congreso Nacional de Medicina Interna 2025',
    society: 'Asociación Colombiana de Medicina Interna (ASCOCI)',
    specialty: 'Medicina interna',
    year: 2025,
    location: 'Cartagena de Indias',
    venue: 'Centro de Convenciones Cartagena de Indias',
    country: 'Colombia',
    startDate: '15 may 2025',
    endDate: '18 may 2025',
    format: 'Presencial',
    timeLabel: 'Hace 2 días',
    registrationUrl: 'https://www.ascoci.org.co',
    registrationDeadline: '1 may 2025',
    earlyBirdDeadline: '15 mar 2025',
    summary:
      'Congreso nacional con tracks de residentes, simulación clínica y presentación de casos. Tarifa reducida para R1–R4 con certificación de programa.',
    highlights: [
      'Taller: lectura crítica de guías MinSalud — vie 16 may',
      'Sesión residentes: errores en anticoagulación — sáb 17 may',
    ],
  },
  {
    id: 'p-lancet-burnout',
    type: 'paper',
    tag: 'Salud del residente',
    title: 'Burnout among internal medicine residents in Latin America: a multicenter survey',
    authors: 'Rodríguez-Mora C, et al.',
    journal: 'The Lancet Regional Health — Americas',
    year: 2024,
    pmid: '38100293',
    doi: '10.1016/j.lana.2024.100456',
    studyType: 'Estudio transversal · 14 países',
    specialty: 'Medicina interna',
    citations: 34,
    timeLabel: 'Hace 4 días',
    openAccess: true,
    abstract:
      'Objective: To estimate burnout prevalence and associated factors in internal medicine residents across Latin America. Methods: Cross-sectional survey in 42 programs (n=2,847 residents). Burnout was defined by Maslach Burnout Inventory. Results: Overall prevalence 62% (95% CI 60–64). Independent factors: >70 h/week (OR 2.1), lack of structured mentorship (OR 1.8), and inadequate rest between shifts (OR 1.6). Conclusions: Burnout is endemic; structural interventions outperform wellness apps alone.',
    clinicalTakeaway:
      'Útil para contexto institucional — no es paper de ronda, pero valida conversaciones sobre carga horaria con jefatura.',
  },
  {
    id: 'p-minsalud-hta',
    type: 'paper',
    tag: 'Guía relacionada',
    title: 'Colombian hypertension guideline: 2024 recommendations for resistant hypertension',
    authors: 'Grupo de trabajo MinSalud',
    journal: 'Biomédica',
    year: 2024,
    pmid: '38300111',
    doi: '10.7705/biomedica.12345',
    studyType: 'Guía de práctica clínica',
    specialty: 'Medicina interna',
    citations: 12,
    timeLabel: 'Hace 5 días',
    openAccess: true,
    abstract:
      'Resistant hypertension is defined as BP above goal despite three antihypertensive agents including a diuretic. This national guideline recommends screening for secondary causes, optimizing adherence, and adding spironolactone 25–50 mg daily as fourth-line when potassium and renal function allow. Referral to specialty center if uncontrolled on quadruple therapy.',
    clinicalTakeaway:
      'Espironolactona baja dosis como cuarta línea — alinea con rondas de HTA en hospital universitario colombiano.',
  },
]

export const trendingPapersRich: BriefingPaper[] = [
  {
    id: 'tr-1',
    type: 'paper',
    tag: 'Alta citación',
    title: 'SGLT2 inhibitors in heart failure with preserved ejection fraction',
    authors: 'Solomon SD, et al.',
    journal: 'New England Journal of Medicine',
    year: 2024,
    pmid: '38501234',
    doi: '10.1056/NEJMoa2312345',
    studyType: 'Metaanálisis · REDEFINE-HF',
    specialty: 'Cardiología',
    citations: 1240,
    timeLabel: 'Top 30 días',
    openAccess: false,
    abstract:
      'SGLT2 inhibitors consistently reduce heart failure hospitalizations in HFpEF across ejection fraction strata. Benefit extends to patients without diabetes. EMPEROR-Preserved and DELIVER trials pooled analysis shows HR 0.82 for composite CV death or HF hospitalization.',
    clinicalTakeaway: 'iSGLT2 ya no es solo diabetes — indicación en IC FEVI preservada con síntomas, con o sin DM2.',
  },
  {
    id: 'tr-2',
    type: 'paper',
    tag: 'Alta citación',
    title: 'GLP-1 receptor agonists and cardiovascular outcomes in obesity without diabetes',
    authors: 'Lincoff AM, et al.',
    journal: 'The Lancet',
    year: 2024,
    pmid: '38450123',
    doi: '10.1016/S0140-6736(24)00123-4',
    studyType: 'RCT · SELECT trial',
    specialty: 'Cardiología · Endocrinología',
    citations: 980,
    timeLabel: 'Top 30 días',
    openAccess: false,
    abstract:
      'In patients with preexisting cardiovascular disease and overweight or obesity but without diabetes, weekly semaglutide 2.4 mg reduced major adverse cardiovascular events by 20% over 3.3 years versus placebo. NNT ≈ 67 over 3 years for one MACE prevented.',
    clinicalTakeaway: 'Semaglutida 2.4 mg con beneficio CV en obesidad sin diabetes — relevante para clínica de riesgo CV.',
  },
  {
    id: 'tr-3',
    type: 'paper',
    tag: 'LATAM',
    title: 'Epidemiology of Chagas cardiomyopathy in the Andean region: updated cohort',
    authors: 'Villa A, et al.',
    journal: 'PLOS Neglected Tropical Diseases',
    year: 2024,
    pmid: '38200456',
    doi: '10.1371/journal.pntd.0012345',
    studyType: 'Cohorte prospectiva',
    specialty: 'Cardiología · Infectología',
    citations: 156,
    timeLabel: 'Top en Colombia',
    openAccess: true,
    abstract:
      'Ten-year follow-up of 1,204 seropositive patients in Colombia and Ecuador. Annual mortality 2.8%; progression to dilated cardiomyopathy 1.2%/year. Early benznidazole treatment in indeterminate phase associated with lower progression (HR 0.71).',
    clinicalTakeaway: 'Datos regionales para discutir screening y seguimiento de Chagas en pacientes de zonas endémicas.',
  },
  {
    id: 'tr-4',
    type: 'paper',
    tag: 'Alta citación',
    title: 'Colchicine after myocardial infarction: COLCOT-2 pooled analysis',
    authors: 'Tardif JC, et al.',
    journal: 'JAMA',
    year: 2024,
    pmid: '38600412',
    doi: '10.1001/jama.2024.5678',
    studyType: 'Metaanálisis',
    specialty: 'Cardiología',
    citations: 412,
    timeLabel: 'Top 30 días',
    openAccess: false,
    abstract:
      'Low-dose colchicine 0.5 mg daily reduces ischemic events post-MI with modest increase in non-CV mortality signal in elderly subgroups. Net benefit favorable in patients <75 years without severe CKD.',
    clinicalTakeaway: 'Colchicina post-IAM — conocer el matiz en mayores de 75 y ERC antes de indicar en ronda.',
  },
]
