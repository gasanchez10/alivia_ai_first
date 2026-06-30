import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import type { PubMedResult } from '@/lib/mock-app-data'
import { cn } from '@/lib/utils'

interface PubMedPaperCardProps {
  paper: PubMedResult
  selected: boolean
  onToggle: () => void
}

export function PubMedPaperCard({ paper, selected, onToggle }: PubMedPaperCardProps) {
  const [abstractOpen, setAbstractOpen] = useState(false)

  return (
    <article
      className={cn(
        'rounded-xl border p-4 transition',
        selected
          ? 'border-violet bg-violet/5 ring-1 ring-violet/20'
          : 'border-lilac/30 bg-white hover:border-violet/20',
      )}
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-1 h-4 w-4 shrink-0 rounded border-lilac/60 text-violet focus:ring-violet/30"
        />
        <span className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-violet">
            Usar para resolver el estudio
          </span>
          <h3 className="mt-1 text-sm font-semibold leading-snug text-ink">{paper.title}</h3>
          <p className="mt-1 text-sm text-plum/70">{paper.authors}</p>
        </span>
      </label>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <MetaBadge>{paper.journal}</MetaBadge>
        <MetaBadge>{paper.year}</MetaBadge>
        <MetaBadge>{paper.studyType}</MetaBadge>
        <MetaBadge className="font-mono">PMID {paper.pmid}</MetaBadge>
        <MetaBadge className="font-mono">DOI {paper.doi}</MetaBadge>
        {paper.openAccess && (
          <span className="rounded bg-green-100 px-2 py-0.5 font-semibold text-green-700">
            Open access
          </span>
        )}
        <span className="rounded bg-violet/10 px-2 py-0.5 font-semibold text-violet">
          {paper.citations.toLocaleString()} citas
        </span>
        <span className="rounded bg-plum/10 px-2 py-0.5 font-semibold text-plum">
          {paper.relevance}% relevancia
        </span>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setAbstractOpen((o) => !o)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-violet hover:underline"
        >
          {abstractOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {abstractOpen ? 'Ocultar abstract' : 'Ver abstract'}
        </button>
        {abstractOpen && (
          <p className="mt-2 rounded-xl bg-bone/60 p-3 text-sm leading-relaxed text-plum/85">
            {paper.abstract}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
        >
          PubMed <ExternalLink size={12} />
        </a>
        <a
          href={`https://doi.org/${paper.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
        >
          DOI <ExternalLink size={12} />
        </a>
      </div>
    </article>
  )
}

function MetaBadge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn('rounded bg-lilac-50 px-2 py-0.5 font-medium text-plum', className)}>
      {children}
    </span>
  )
}
