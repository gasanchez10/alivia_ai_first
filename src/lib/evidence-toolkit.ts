import { quizQuestions, type PubMedResult, type QuizQuestion } from '@/lib/mock-app-data'

export const QUIZ_QUESTION_COUNT = 5

export interface EvidenceToolkitContext {
  patientLabel: string
  clinicalQuestion: string
  sourceLabel: string
}

export function rondaEvidenceContext(
  rondaTitle: string,
  patient = 'Caso clínico de la ronda',
  clinicalQuestion = 'Pregunta clínica derivada del encuentro',
): EvidenceToolkitContext {
  return {
    patientLabel: patient,
    clinicalQuestion,
    sourceLabel: `Ronda · ${rondaTitle}`,
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type PodcastLocale = 'es' | 'en' | 'pt'
export type PodcastVersion = 'lite' | 'full'

export const PODCAST_LOCALES: { id: PodcastLocale; label: string }[] = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
]

export const PODCAST_VERSIONS: { id: PodcastVersion; label: string; hint: string }[] = [
  { id: 'lite', label: 'Lite', hint: '~3–4 min · puntos clave' },
  { id: 'full', label: 'Full', hint: '~10–12 min · profundidad clínica' },
]

export function buildPresentationTitle(question: string): string {
  const q = question.trim()
  if (q.length <= 56) return `Presentación — ${q}`
  return `Presentación — ${q.slice(0, 53)}…`
}

export function estimateSlideCount(paperCount: number): number {
  return Math.min(24, 6 + paperCount * 2)
}

function generatedQuestionFromPaper(paper: PubMedResult, index: number, context: EvidenceToolkitContext): QuizQuestion {
  const templates = [
    {
      question: `Según "${paper.title.slice(0, 70)}…", ¿qué aporta al caso (${context.patientLabel})?`,
      options: [
        'No aporta al manejo actual',
        'Refuerza la intervención con evidencia citada',
        'Contraindica la terapia propuesta',
        'Solo aplica en pediatría',
      ],
      correct: 1,
      explanation: `Este artículo (${paper.journal}) está entre tus fuentes seleccionadas y sustenta la respuesta a: ${context.clinicalQuestion}`,
    },
    {
      question: `¿Qué PMID respalda la pregunta "${context.clinicalQuestion.slice(0, 50)}…"?`,
      options: [paper.pmid, '00000000', '12345678', '99999999'],
      correct: 0,
      explanation: `PMID ${paper.pmid} corresponde a la fuente seleccionada en esta búsqueda.`,
    },
  ]
  const t = templates[index % templates.length]
  return {
    id: `gen-${paper.pmid}-${index}`,
    question: t.question,
    options: t.options,
    correct: t.correct,
    explanation: t.explanation,
    pmid: paper.pmid,
  }
}

export function buildQuizFromPapers(
  papers: PubMedResult[],
  context: EvidenceToolkitContext,
): QuizQuestion[] {
  const pmids = new Set(papers.map((p) => p.pmid))
  const matched = quizQuestions.filter((q) => pmids.has(q.pmid))
  const pool: QuizQuestion[] = [...matched]

  let genIndex = 0
  while (pool.length < QUIZ_QUESTION_COUNT && papers.length > 0) {
    const paper = papers[genIndex % papers.length]
    const candidate = generatedQuestionFromPaper(paper, genIndex, context)
    if (!pool.some((q) => q.id === candidate.id)) pool.push(candidate)
    genIndex += 1
    if (genIndex > 12) break
  }

  while (pool.length < QUIZ_QUESTION_COUNT) {
    pool.push({
      id: `fallback-${pool.length}`,
      question: `${context.patientLabel}. ${context.clinicalQuestion}`,
      options: [
        'Opción sin evidencia citada',
        'Opción alineada con las fuentes seleccionadas',
        'Solo antiagregación',
        'Esperar más estudios',
      ],
      correct: 1,
      explanation: `Basado en ${papers.length} fuente(s) para este caso.`,
      pmid: papers[0]?.pmid ?? '—',
    })
  }

  return pool.slice(0, QUIZ_QUESTION_COUNT)
}

export function perQuestionFeedback(correct: boolean, explanation: string): string {
  if (correct) return `Correcto. ${explanation}`
  return `Incorrecto. ${explanation}`
}

export function buildGlobalQuizFeedback(
  score: number,
  total: number,
  context: EvidenceToolkitContext,
): string {
  const pct = Math.round((score / total) * 100)
  if (score === total) {
    return `Excelente (${pct}%). Dominas la evidencia para "${context.clinicalQuestion}". Listo para exponer en ronda con citas PMID.`
  }
  if (score >= total - 1) {
    return `Muy bien (${pct}%). Refuerza 1–2 puntos antes de la exposición. Repasa las preguntas falladas y sus PMIDs.`
  }
  if (score >= Math.ceil(total / 2)) {
    return `Desempeño aceptable (${pct}%). Repasa lecturas clave del caso (${context.patientLabel}) y vuelve a intentar el quiz.`
  }
  return `Necesitas reforzar (${pct}%). Prioriza las lecturas de tus papers seleccionados y el plan de estudio antes de la ronda.`
}

export function buildPodcastScript(
  context: EvidenceToolkitContext,
  papers: PubMedResult[],
  locale: PodcastLocale,
  version: PodcastVersion,
): { script: string; durationMin: number } {
  const refs = papers.map((p) => `${p.journal} (PMID ${p.pmid})`).join('; ')
  const durationMin = version === 'lite' ? 3 + Math.min(papers.length, 2) : 10 + papers.length

  const scripts: Record<PodcastLocale, Record<PodcastVersion, string>> = {
    es: {
      lite: `Resumen lite: ${context.clinicalQuestion} Caso: ${context.patientLabel}. ${papers.length} fuente(s): ${refs}. Conclusión breve para ronda.`,
      full: `Episodio completo en español. Pregunta: ${context.clinicalQuestion}. Paciente: ${context.patientLabel}. Revisamos metodología, hallazgos y aplicabilidad de ${papers.length} artículos (${refs}). Cierre con recomendación citada y puntos para el especialista.`,
    },
    en: {
      lite: `Lite brief: ${context.clinicalQuestion} Patient: ${context.patientLabel}. ${papers.length} source(s): ${refs}. Key takeaway for rounds.`,
      full: `Full episode in English. Clinical question: ${context.clinicalQuestion}. Case: ${context.patientLabel}. Deep dive into ${papers.length} papers (${refs}): methods, outcomes, and bedside application with verifiable citations.`,
    },
    pt: {
      lite: `Resumo lite: ${context.clinicalQuestion} Paciente: ${context.patientLabel}. ${papers.length} fonte(s): ${refs}. Conclusão rápida para a ronda.`,
      full: `Episódio completo em português. Pergunta: ${context.clinicalQuestion}. Caso: ${context.patientLabel}. Análise detalhada de ${papers.length} artigos (${refs}) com recomendação citada para a apresentação.`,
    },
  }

  return { script: scripts[locale][version], durationMin }
}

export function mockChatReply(
  query: string,
  context: EvidenceToolkitContext,
  papers: PubMedResult[],
): string {
  const q = query.toLowerCase()
  const pmidList = papers.map((p) => p.pmid).join(', ')

  if (q.includes('dosis') || q.includes('ajust')) {
    return `En ${context.patientLabel}, revisa función renal y criterios de dosis reducida según las guías en tus fuentes (PMID ${papers[0]?.pmid ?? pmidList}). La evidencia seleccionada prioriza DOAC con ajuste cuando corresponda.`
  }
  if (q.includes('warfarina') || q.includes('doac') || q.includes('apixab')) {
    return `Para responder "${context.clinicalQuestion}", las fuentes seleccionadas (${pmidList}) apoyan DOAC frente a warfarina en sangrado mayor sin perder eficacia en ACV. Cita PMID al exponer en ronda.`
  }
  if (q.includes('contraindic') || q.includes('sangrado')) {
    return `Evalúa HAS-BLED y riesgo trombótico en este paciente. Los abstracts guardados mencionan perfil de sangrado; contrasta NEJM vs revisión en JACC (PMIDs ${pmidList}).`
  }

  return `Con el contexto del paciente (${context.patientLabel}) y ${papers.length} artículo(s) (PMID ${pmidList}), sobre "${query}": la respuesta debe citar solo las fuentes que seleccionaste. ¿Quieres que compare dos PMIDs específicos?`
}
