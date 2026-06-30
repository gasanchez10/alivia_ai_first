import { Sparkles } from 'lucide-react'
import type { LibraryPaper } from '@/lib/mock-app-data'
import { buildPaperSummary } from '@/lib/library-paper-utils'

interface LibraryPaperSummaryProps {
  paper: LibraryPaper
}

const sections: { key: keyof ReturnType<typeof buildPaperSummary>; label: string }[] = [
  { key: 'question', label: 'Pregunta' },
  { key: 'methods', label: 'Métodos' },
  { key: 'findings', label: 'Hallazgos' },
  { key: 'takeaway', label: 'Implicancia clínica' },
  { key: 'limitations', label: 'Limitaciones' },
]

export function LibraryPaperSummary({ paper }: LibraryPaperSummaryProps) {
  const summary = buildPaperSummary(paper)

  return (
    <div className="mt-4 rounded-xl border border-lilac/30 bg-bone/50 p-4">
      <div className="flex items-center gap-2 text-violet">
        <Sparkles size={18} />
        <p className="text-sm font-semibold text-ink">Resumen estructurado</p>
      </div>
      <p className="mt-1 text-xs text-plum/55">Cada punto referenciado a PMID {paper.pmid}</p>
      <dl className="mt-4 space-y-3">
        {sections.map(({ key, label }) => (
          <div key={key}>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-mauve">{label}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-plum/90">{summary[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
