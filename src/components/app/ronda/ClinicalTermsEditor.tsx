import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ClinicalTerm } from '@/lib/mock-app-data'
import { cn } from '@/lib/utils'

interface ClinicalTermsEditorProps {
  terms: ClinicalTerm[]
  onChange: (terms: ClinicalTerm[]) => void
}

export function ClinicalTermsEditor({ terms, onChange }: ClinicalTermsEditorProps) {
  const [draft, setDraft] = useState('')
  const [addAsMesh, setAddAsMesh] = useState(true)

  const meshTerms = terms.filter((t) => t.isMesh)
  const nonMeshTerms = terms.filter((t) => !t.isMesh)

  const addTerm = () => {
    const label = draft.trim()
    if (!label) return
    if (terms.some((t) => t.label.toLowerCase() === label.toLowerCase())) {
      setDraft('')
      return
    }
    onChange([
      ...terms,
      { id: crypto.randomUUID(), label, isMesh: addAsMesh },
    ])
    setDraft('')
  }

  const removeTerm = (id: string) => {
    onChange(terms.filter((t) => t.id !== id))
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-plum/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-violet" aria-hidden />
          MeSH
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-600" aria-hidden />
          No MeSH
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {meshTerms.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet/70">MeSH</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {meshTerms.map((t) => (
                <TermChip key={t.id} term={t} onRemove={() => removeTerm(t.id)} />
              ))}
            </div>
          </div>
        )}
        {nonMeshTerms.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700/80">
              No MeSH
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {nonMeshTerms.map((t) => (
                <TermChip key={t.id} term={t} onRemove={() => removeTerm(t.id)} />
              ))}
            </div>
          </div>
        )}
        {terms.length === 0 && (
          <p className="text-sm text-plum/50">Aún no hay términos. Agrega al menos uno para buscar en PubMed.</p>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-lilac/30 bg-bone/40 p-3">
        <p className="text-xs font-semibold text-plum/70">Agregar término</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTerm()
              }
            }}
            placeholder="Ej. rivaroxabán, HAS-BLED…"
            className="min-w-0 flex-1 rounded-lg border border-lilac/40 bg-white px-3 py-2 text-sm text-ink placeholder:text-plum/40 focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/20"
          />
          <div className="flex shrink-0 gap-1 rounded-lg bg-white p-1 ring-1 ring-lilac/30">
            <button
              type="button"
              onClick={() => setAddAsMesh(true)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                addAsMesh ? 'bg-violet text-white' : 'text-plum/60 hover:text-violet',
              )}
            >
              MeSH
            </button>
            <button
              type="button"
              onClick={() => setAddAsMesh(false)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                !addAsMesh ? 'bg-teal-600 text-white' : 'text-plum/60 hover:text-teal-700',
              )}
            >
              No MeSH
            </button>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="shrink-0 !px-3 !py-2"
            onClick={addTerm}
            disabled={!draft.trim()}
          >
            <Plus size={16} />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  )
}

function TermChip({ term, onRemove }: { term: ClinicalTerm; onRemove: () => void }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full py-1 pl-3 pr-1.5 text-sm font-medium',
        term.isMesh
          ? 'bg-violet/15 text-violet ring-1 ring-violet/25'
          : 'bg-teal-50 text-teal-800 ring-1 ring-teal-200/80',
      )}
    >
      {term.label}
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          'rounded-full p-0.5 transition hover:bg-black/10',
          term.isMesh ? 'text-violet/70 hover:text-violet' : 'text-teal-700/70 hover:text-teal-900',
        )}
        aria-label={`Quitar ${term.label}`}
      >
        <X size={14} />
      </button>
    </span>
  )
}
