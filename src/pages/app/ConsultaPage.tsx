import { useState } from 'react'
import { Search, ChevronRight, ExternalLink, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { PubMedPaperCard } from '@/components/app/ronda/PubMedPaperCard'
import { EvidenceToolkit } from '@/components/app/evidence/EvidenceToolkit'
import { Button } from '@/components/ui/Button'
import { consultaEvidenceContext } from '@/lib/evidence-toolkit'
import { consultaPico, encounterPubMedResults, type PubMedResult } from '@/lib/mock-app-data'
import { addManagementPlanFromConsulta } from '@/lib/mock-management-plans-store'

export function ConsultaPage() {
  const [phase, setPhase] = useState<'form' | 'results' | 'answer'>('form')
  const [articles, setArticles] = useState<PubMedResult[]>(encounterPubMedResults)

  const selectedArticles = articles.filter((a) => a.selected)
  const evidenceContext = consultaEvidenceContext()

  const toggleArticle = (id: string) => {
    setArticles((prev) => {
      const target = prev.find((a) => a.id === id)
      const selectedCount = prev.filter((a) => a.selected).length
      if (target?.selected && selectedCount <= 1) return prev
      return prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    })
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        section="Clínico"
        title="Nueva consulta"
        description="Plantea una pregunta clínica (PICO), busca en PubMed y obtén una respuesta citada."
      />

      {phase === 'form' && (
        <div className="space-y-4">
          <AppCard>
            <p className="text-xs font-bold uppercase tracking-widest text-mauve">Paso 1 · Caso clínico</p>
            <label className="mt-3 block text-sm font-medium text-plum">Paciente</label>
            <input
              readOnly
              value={consultaPico.patient}
              className="mt-1 w-full rounded-xl border border-lilac/40 bg-bone/40 px-4 py-2.5 text-sm text-ink"
            />
            <label className="mt-4 block text-sm font-medium text-plum">Pregunta clínica</label>
            <textarea
              readOnly
              rows={2}
              value={consultaPico.question}
              className="mt-1 w-full rounded-xl border border-lilac/40 bg-bone/40 px-4 py-2.5 text-sm text-ink"
            />
          </AppCard>

          <AppCard>
            <p className="text-xs font-bold uppercase tracking-widest text-mauve">Paso 2 · PICO</p>
            <dl className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ['Intervención', consultaPico.intervention],
                ['Comparador', consultaPico.comparison],
                ['Desenlace', consultaPico.outcome],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-lilac-50/50 p-3">
                  <dt className="text-[11px] font-bold uppercase text-mauve">{label}</dt>
                  <dd className="mt-1 text-sm text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <Button className="mt-4" onClick={() => setPhase('results')}>
              <Search size={18} /> Buscar en PubMed
            </Button>
          </AppCard>
        </div>
      )}

      {phase === 'results' && (
        <div className="space-y-4">
          <AppCard>
            <p className="text-xs font-bold uppercase tracking-widest text-mauve">
              Resultados clasificados · {articles.length} artículos
            </p>
            <p className="mt-1 text-sm text-plum/60">
              Selecciona las fuentes para la respuesta y para generar presentación, quiz, podcast o chat.
            </p>
          </AppCard>

          <div className="space-y-3">
            {articles.slice(0, 6).map((a) => (
              <PubMedPaperCard
                key={a.id}
                paper={a}
                selected={!!a.selected}
                onToggle={() => toggleArticle(a.id)}
              />
            ))}
          </div>

          <EvidenceToolkit context={evidenceContext} papers={selectedArticles} />

          <Button
            className="w-full sm:w-auto"
            disabled={selectedArticles.length === 0}
            onClick={() => {
              addManagementPlanFromConsulta(
                selectedArticles,
                consultaPico.patient,
                consultaPico.question,
              )
              setPhase('answer')
            }}
          >
            Generar respuesta citada <ChevronRight size={18} />
          </Button>
        </div>
      )}

      {phase === 'answer' && (
        <div className="space-y-4">
          <AppCard className="border-violet/20">
            <div className="flex items-center gap-2 text-violet">
              <Sparkles size={20} />
              <p className="font-semibold text-ink">Respuesta con evidencia</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-plum/90">
              Los iSGLT2 reducen MACE y hospitalización por IC en pacientes con IC, con o sin diabetes.
              En pacientes sin diabetes con alto riesgo CV, el beneficio es consistente en ensayos con
              empagliflozina y dapagliflozina.
            </p>
            <ul className="mt-4 space-y-2">
              {selectedArticles.map((a) => (
                <li key={a.pmid}>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${a.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
                  >
                    PMID {a.pmid} · {a.title.slice(0, 48)}… <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </AppCard>

          <EvidenceToolkit context={evidenceContext} papers={selectedArticles} />

          <Button variant="secondary" onClick={() => setPhase('form')}>
            Nueva consulta
          </Button>
        </div>
      )}
    </div>
  )
}
