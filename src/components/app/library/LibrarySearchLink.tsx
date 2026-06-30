import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import type { LibrarySearchContext } from '@/lib/library-search-context'
import { searchOriginPath } from '@/lib/library-search-context'

interface LibrarySearchLinkProps {
  context: LibrarySearchContext
  className?: string
}

export function LibrarySearchLink({ context, className }: LibrarySearchLinkProps) {
  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase tracking-widest text-mauve">{context.sourceLabel}</p>
      <p className="mt-1 text-sm text-plum/80 line-clamp-2">{context.clinicalQuestion}</p>
      <p className="mt-1 text-xs text-plum/55">{context.patientLabel}</p>
      <p className="mt-1 font-mono text-[10px] text-plum/45">
        PMID {context.pmids.slice(0, 4).join(' · ')}
        {context.pmids.length > 4 ? '…' : ''}
      </p>
      <Link
        to={searchOriginPath(context.origin)}
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
      >
        Ir a la búsqueda <ExternalLink size={12} />
      </Link>
    </div>
  )
}
