import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Headphones,
  Presentation,
  FileText,
  HelpCircle,
  Download,
  Search,
} from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { LibrarySearchLink } from '@/components/app/library/LibrarySearchLink'
import { LibraryPaperUpload } from '@/components/app/library/LibraryPaperUpload'
import { LibraryPaperSummary } from '@/components/app/library/LibraryPaperSummary'
import { EvidenceToolkit } from '@/components/app/evidence/EvidenceToolkit'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { type LibraryPaper } from '@/lib/mock-app-data'
import { getLibraryPapers, setPaperReadStatus } from '@/lib/mock-library-store'
import { getPresentations } from '@/lib/mock-presentations-store'
import { getQuizAttempts, getStoredQuizzes } from '@/lib/mock-quizzes-store'
import { getStoredPodcasts } from '@/lib/mock-podcasts-store'
import { contextFromLibraryPapers, filterLibraryPapers, pubMedFromLibraryPapers, resolveLibraryPaperDoi } from '@/lib/library-paper-utils'
import { contextFromQuiz, librarySectionPath } from '@/lib/library-search-context'
import { downloadPresentation } from '@/lib/presentation-download'
import { downloadPodcast } from '@/lib/podcast-download'
import { PODCAST_LOCALES, PODCAST_VERSIONS } from '@/lib/evidence-toolkit'
import { cn } from '@/lib/utils'

type LibrarySection = 'papers' | 'presentaciones' | 'cuestionarios' | 'podcasts'

const LIBRARY_PAPERS_PAGE_SIZE = 4

const sections: { id: LibrarySection; label: string; icon: typeof FileText }[] = [
  { id: 'papers', label: 'Papers', icon: FileText },
  { id: 'presentaciones', label: 'Presentaciones', icon: Presentation },
  { id: 'cuestionarios', label: 'Cuestionarios', icon: HelpCircle },
  { id: 'podcasts', label: 'Podcasts', icon: Headphones },
]

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function parseSection(raw?: string): LibrarySection {
  if (raw === 'presentaciones' || raw === 'cuestionarios' || raw === 'podcasts') return raw
  return 'papers'
}

export function BibliotecaPage() {
  const { section: sectionParam } = useParams()
  const navigate = useNavigate()
  const section = parseSection(sectionParam)

  const [papers, setPapers] = useState<LibraryPaper[]>(() => getLibraryPapers())
  const [presentations, setPresentations] = useState(() => getPresentations())
  const [quizzes, setQuizzes] = useState(() => getStoredQuizzes())
  const [attempts, setAttempts] = useState(() => getQuizAttempts())
  const [podcasts, setPodcasts] = useState(() => getStoredPodcasts())
  const [selectedPaper, setSelectedPaper] = useState<LibraryPaper | null>(
    () => getLibraryPapers()[0] ?? null,
  )
  const [paperSearch, setPaperSearch] = useState('')
  const [paperPage, setPaperPage] = useState(1)

  const filteredPapers = useMemo(
    () => filterLibraryPapers(papers, paperSearch),
    [papers, paperSearch],
  )

  const papersTotalPages = Math.max(1, Math.ceil(filteredPapers.length / LIBRARY_PAPERS_PAGE_SIZE))
  const safePaperPage = Math.min(paperPage, papersTotalPages)

  const paginatedPapers = useMemo(() => {
    const start = (safePaperPage - 1) * LIBRARY_PAPERS_PAGE_SIZE
    return filteredPapers.slice(start, start + LIBRARY_PAPERS_PAGE_SIZE)
  }, [filteredPapers, safePaperPage])

  useEffect(() => {
    setPaperPage(1)
  }, [paperSearch])

  useEffect(() => {
    if (!selectedPaper) return
    if (!filteredPapers.some((p) => p.id === selectedPaper.id)) {
      setSelectedPaper(filteredPapers[0] ?? null)
    }
  }, [filteredPapers, selectedPaper])

  const refresh = () => {
    const nextPapers = getLibraryPapers()
    setPapers(nextPapers)
    setPresentations(getPresentations())
    setQuizzes(getStoredQuizzes())
    setAttempts(getQuizAttempts())
    setPodcasts(getStoredPodcasts())
    setSelectedPaper((current) => nextPapers.find((p) => p.id === current?.id) ?? nextPapers[0] ?? null)
  }

  useEffect(() => {
    window.addEventListener('alivia-library-updated', refresh)
    window.addEventListener('alivia-presentations-updated', refresh)
    window.addEventListener('alivia-quizzes-updated', refresh)
    return () => {
      window.removeEventListener('alivia-library-updated', refresh)
      window.removeEventListener('alivia-presentations-updated', refresh)
      window.removeEventListener('alivia-quizzes-updated', refresh)
    }
  }, [])

  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )

  const counts = {
    papers: papers.length,
    presentaciones: presentations.length,
    cuestionarios: sortedAttempts.length,
    podcasts: podcasts.length,
  }

  const toggleRead = (id: string) => {
    const paper = papers.find((p) => p.id === id)
    if (!paper) return
    const nextRead = !paper.read
    setPaperReadStatus(id, nextRead)
    setPapers((prev) => prev.map((p) => (p.id === id ? { ...p, read: nextRead } : p)))
    setSelectedPaper((s) => (s?.id === id ? { ...s, read: nextRead } : s))
  }

  const toolkitLibraryPapers = useMemo(
    () => (selectedPaper ? [selectedPaper] : []),
    [selectedPaper],
  )

  const toolkitContext = useMemo(
    () => contextFromLibraryPapers(toolkitLibraryPapers),
    [toolkitLibraryPapers],
  )

  const toolkitPubMed = useMemo(
    () => pubMedFromLibraryPapers(toolkitLibraryPapers),
    [toolkitLibraryPapers],
  )

  const selectedDoi = selectedPaper ? resolveLibraryPaperDoi(selectedPaper) : ''

  const handlePaperAdded = (pmid: string) => {
    refresh()
    const added = getLibraryPapers().find((p) => p.pmid === pmid)
    if (added) setSelectedPaper(added)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        section="Biblioteca"
        title="La Biblioteca"
        description="Todo lo generado desde tus búsquedas: papers, presentaciones, cuestionarios y podcasts."
        action={
          <span className="rounded-full bg-violet/10 px-3 py-1 text-sm font-semibold text-violet">
            {counts.papers + counts.presentaciones + counts.cuestionarios + counts.podcasts} ítems
          </span>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {sections.map((s) => {
          const Icon = s.icon
          const active = section === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => navigate(librarySectionPath(s.id))}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                active
                  ? 'bg-violet text-white shadow-sm'
                  : 'bg-white text-plum ring-1 ring-lilac/40 hover:ring-violet/30',
              )}
            >
              <Icon size={16} />
              {s.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  active ? 'bg-white/20 text-white' : 'bg-lilac-50 text-plum/70',
                )}
              >
                {counts[s.id]}
              </span>
            </button>
          )
        })}
      </div>

      {section === 'papers' && (
        <div className="space-y-4">
          <LibraryPaperUpload onAdded={handlePaperAdded} />

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-2">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-plum/40"
                />
                <input
                  type="search"
                  value={paperSearch}
                  onChange={(e) => setPaperSearch(e.target.value)}
                  placeholder="Buscar por título o DOI…"
                  className="w-full rounded-xl border border-lilac/40 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/20"
                />
              </div>

              {papers.length === 0 ? (
                <AppCard className="border-dashed border-violet/30 bg-violet/5">
                  <p className="text-sm text-plum/70">
                    Sin papers aún. Sube uno arriba o selecciona artículos en La Ronda o Consulta.
                  </p>
                </AppCard>
              ) : filteredPapers.length === 0 ? (
                <AppCard className="border-dashed border-lilac/30">
                  <p className="text-sm text-plum/70">Ningún paper coincide con tu búsqueda.</p>
                </AppCard>
              ) : (
                <>
                  {filteredPapers.length > LIBRARY_PAPERS_PAGE_SIZE && (
                    <Pagination
                      page={safePaperPage}
                      pageSize={LIBRARY_PAPERS_PAGE_SIZE}
                      total={filteredPapers.length}
                      onPageChange={setPaperPage}
                    />
                  )}

                  {paginatedPapers.map((p) => {
                    const doi = resolveLibraryPaperDoi(p)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPaper(p)}
                        className={cn(
                          'w-full rounded-xl border p-4 text-left transition',
                          selectedPaper?.id === p.id
                            ? 'border-violet bg-violet/5 ring-1 ring-violet/20'
                            : 'border-lilac/30 bg-white hover:border-violet/25',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug text-ink">{p.title}</p>
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold',
                              p.read ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
                            )}
                          >
                            {p.read ? 'Leído' : 'Pendiente'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-plum/60">
                          {p.journal} · PMID {p.pmid}
                          {doi ? ` · DOI ${doi}` : ''}
                        </p>
                      </button>
                    )
                  })}

                  {filteredPapers.length > LIBRARY_PAPERS_PAGE_SIZE && (
                    <Pagination
                      page={safePaperPage}
                      pageSize={LIBRARY_PAPERS_PAGE_SIZE}
                      total={filteredPapers.length}
                      onPageChange={setPaperPage}
                    />
                  )}
                </>
              )}
            </div>

            <div className="space-y-4 lg:col-span-3">
              {selectedPaper && (
                <AppCard>
                  <h2 className="font-display text-xl font-semibold text-ink">{selectedPaper.title}</h2>
                  <p className="mt-1 text-sm text-plum/60">
                    {selectedPaper.journal} · PMID {selectedPaper.pmid}
                    {selectedDoi ? ` · DOI ${selectedDoi}` : ''} · Guardado {selectedPaper.savedAt}
                  </p>

                  <LibraryPaperSummary paper={selectedPaper} />

                  {selectedPaper.searchContext && (
                    <div className="mt-4 rounded-xl border border-lilac/30 bg-bone/40 p-4">
                      <LibrarySearchLink context={selectedPaper.searchContext} />
                    </div>
                  )}

                  <div className="mt-5">
                    <Button variant="secondary" onClick={() => toggleRead(selectedPaper.id)}>
                      Marcar como {selectedPaper.read ? 'pendiente' : 'leído'}
                    </Button>
                  </div>
                </AppCard>
              )}

              {selectedPaper && (
                <EvidenceToolkit context={toolkitContext} papers={toolkitPubMed} />
              )}
            </div>
          </div>
        </div>
      )}

      {section === 'presentaciones' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {presentations.length === 0 ? (
            <AppCard className="border-dashed border-violet/30 bg-violet/5 sm:col-span-2">
              <p className="text-sm text-plum/70">
                Genera una presentación desde los papers de una búsqueda en La Ronda o Consulta.
              </p>
            </AppCard>
          ) : (
            presentations.map((pr) => (
              <AppCard key={pr.id} hover>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
                  {pr.status}
                </span>
                <h3 className="mt-2 font-semibold text-ink">{pr.title}</h3>
                <p className="mt-1 text-xs text-plum/60">
                  {pr.slides} diapositivas · PMID {pr.pmid} · {pr.updatedAt}
                </p>
                {pr.searchContext ? (
                  <div className="mt-3 rounded-xl border border-lilac/30 bg-bone/30 p-3">
                    <LibrarySearchLink context={pr.searchContext} />
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-plum/50">Generada antes de vincular búsquedas</p>
                )}
                <Button
                  variant="secondary"
                  className="mt-4 !px-3 !py-2 text-sm"
                  onClick={() =>
                    downloadPresentation({
                      title: pr.title,
                      clinicalQuestion: pr.searchContext?.clinicalQuestion ?? pr.title,
                      patientLabel: pr.searchContext?.patientLabel ?? 'Caso clínico',
                      papers: [{ title: pr.title, pmid: pr.pmid, journal: 'PubMed' }],
                      slideCount: pr.slides,
                    })
                  }
                >
                  <Download size={16} /> Descargar
                </Button>
              </AppCard>
            ))
          )}
        </div>
      )}

      {section === 'cuestionarios' && (
        <div className="space-y-3">
          {sortedAttempts.length === 0 ? (
            <AppCard className="border-dashed border-violet/30 bg-violet/5">
              <p className="text-sm text-plum/70">
                Completa un quiz desde una búsqueda para ver intentos aquí.
              </p>
            </AppCard>
          ) : (
            sortedAttempts.map((attempt, i) => {
              const quiz = quizzes.find((q) => q.id === attempt.quizId)
              if (!quiz) return null
              const searchContext = contextFromQuiz(quiz)
              return (
                <AppCard key={attempt.id} hover>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-mauve">{quiz.sourceLabel}</p>
                      <h3 className="mt-1 font-semibold text-ink">
                        Intento · {formatDate(attempt.completedAt)}
                      </h3>
                      <p className="mt-1 text-sm text-plum/60">
                        {attempt.score}/{attempt.total} correctas
                      </p>
                    </div>
                    <Link
                      to={librarySectionPath('cuestionarios')}
                      className="text-xs font-semibold text-violet hover:underline"
                    >
                      #{sortedAttempts.length - i}
                    </Link>
                  </div>
                  <div className="mt-3 rounded-xl border border-lilac/30 bg-bone/30 p-3">
                    <LibrarySearchLink context={searchContext} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-plum/75">{attempt.globalFeedback}</p>
                </AppCard>
              )
            })
          )}
        </div>
      )}

      {section === 'podcasts' && (
        <div className="space-y-3">
          {podcasts.length === 0 ? (
            <AppCard className="border-dashed border-violet/30 bg-violet/5">
              <p className="text-sm text-plum/70">
                Genera un podcast desde el panel de herramientas de una búsqueda.
              </p>
            </AppCard>
          ) : (
            podcasts.map((pod) => {
              const localeLabel = PODCAST_LOCALES.find((l) => l.id === pod.locale)?.label ?? pod.locale
              const versionLabel = PODCAST_VERSIONS.find((v) => v.id === pod.version)?.label ?? pod.version
              return (
                <AppCard key={pod.id} hover>
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet">
                      <Headphones size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">
                        Podcast · {localeLabel} · {versionLabel}
                      </p>
                      <p className="mt-1 text-xs text-plum/60">
                        ~{pod.durationMin} min · {formatDate(pod.createdAt)}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-plum/75">{pod.script}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-lilac/30 bg-bone/30 p-3">
                    <LibrarySearchLink context={pod.searchContext} />
                  </div>
                  <Button
                    variant="secondary"
                    className="mt-4 !px-3 !py-2 text-sm"
                    onClick={() =>
                      downloadPodcast({
                        context: {
                          patientLabel: pod.searchContext.patientLabel,
                          clinicalQuestion: pod.searchContext.clinicalQuestion,
                          sourceLabel: pod.searchContext.sourceLabel,
                        },
                        script: pod.script,
                        locale: pod.locale,
                        version: pod.version,
                        durationMin: pod.durationMin,
                        pmids: pod.searchContext.pmids,
                      })
                    }
                  >
                    <Download size={16} /> Descargar
                  </Button>
                </AppCard>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
