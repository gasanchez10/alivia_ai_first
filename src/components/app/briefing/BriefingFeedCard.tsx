import { useState, type ReactNode } from 'react'
import {
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Calendar,
  Globe,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  Link2,
} from 'lucide-react'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import type {
  BriefingCongress,
  BriefingFeedItem,
  BriefingGuide,
  BriefingPaper,
} from '@/lib/mock-briefing'
import { isPmidSaved, toggleSavedPmid } from '@/lib/mock-library-store'

function MetaRow({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-xs text-plum/70">
      <Icon size={14} className="mt-0.5 shrink-0 text-violet/60" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

function GuideCard({ item }: { item: BriefingGuide }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <AppCard hover>
      <FeedHeader tag={item.tag} timeLabel={item.timeLabel} isNew={item.isNew} />
      <h3 className="mt-2 font-semibold leading-snug text-ink">{item.title}</h3>
      <p className="mt-1 text-sm font-medium text-violet">{item.organization} · {item.year}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-lilac-50 px-2.5 py-0.5 text-[11px] font-medium text-plum">{item.country}</span>
        <span className="rounded-full bg-lilac-50 px-2.5 py-0.5 text-[11px] font-medium text-plum">{item.specialty}</span>
        <span className="rounded-full bg-lilac-50 px-2.5 py-0.5 text-[11px] font-medium text-plum">{item.language}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-plum/85">{item.summary}</p>
      {item.actionRequired && (
        <div className="mt-3 rounded-xl border border-amber-300/40 bg-amber-50/60 p-3">
          <p className="text-xs font-bold text-amber-800">Qué revisar</p>
          <p className="mt-1 text-sm text-amber-900">{item.actionRequired}</p>
        </div>
      )}
      <MetaRow icon={Calendar}>Publicada {item.publishedAt}</MetaRow>
      <MetaRow icon={Users}>Población: {item.targetPopulation}</MetaRow>
      {expanded && (
        <div className="mt-3 rounded-xl bg-bone/70 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-mauve">Cambios clave</p>
          <ul className="mt-2 space-y-1.5">
            {item.keyChanges.map((c) => (
              <li key={c} className="text-sm text-plum/85">· {c}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-violet hover:underline"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Menos detalle' : 'Ver cambios clave'}
        </button>
        <a
          href={item.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-plum ring-1 ring-lilac/40 hover:ring-violet/30"
        >
          <ExternalLink size={14} /> Documento oficial
        </a>
      </div>
    </AppCard>
  )
}

function CongressCard({ item }: { item: BriefingCongress }) {
  return (
    <AppCard hover>
      <FeedHeader tag={item.tag} timeLabel={item.timeLabel} isNew={item.isNew} />
      <h3 className="mt-2 font-semibold leading-snug text-ink">{item.title}</h3>
      <p className="mt-1 text-sm font-medium text-violet">{item.society} · {item.year}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <MetaRow icon={MapPin}>{item.venue}, {item.location}, {item.country}</MetaRow>
        <MetaRow icon={Calendar}>{item.startDate} – {item.endDate}</MetaRow>
        <MetaRow icon={Globe}>{item.format}</MetaRow>
        <MetaRow icon={FileText}>Especialidad: {item.specialty}</MetaRow>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-plum/85">{item.summary}</p>
      <div className="mt-3 rounded-xl border border-amber-200/50 bg-amber-50/60 p-3 text-xs text-amber-900">
        <p><strong>Inscripción:</strong> hasta {item.registrationDeadline}</p>
        {item.earlyBirdDeadline && <p className="mt-1"><strong>Tarifa reducida:</strong> hasta {item.earlyBirdDeadline}</p>}
        {item.abstractDeadline && <p className="mt-1"><strong>Envío de abstracts:</strong> {item.abstractDeadline}</p>}
      </div>
      <ul className="mt-3 space-y-1">
        {item.highlights.map((h) => (
          <li key={h} className="text-sm text-plum/80">· {h}</li>
        ))}
      </ul>
      <a
        href={item.registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-600"
      >
        <Link2 size={16} /> Inscripción y programa
      </a>
    </AppCard>
  )
}

function PaperCard({ item, defaultExpanded }: { item: BriefingPaper; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)
  const [saved, setSaved] = useState(() => isPmidSaved(item.pmid))

  const handleSave = () => {
    const next = toggleSavedPmid(item.pmid)
    setSaved(next)
  }

  return (
    <AppCard hover>
      <FeedHeader tag={item.tag} timeLabel={item.timeLabel} isNew={item.isNew} />
      <h3 className="mt-2 font-semibold leading-snug text-ink">{item.title}</h3>
      <p className="mt-1 text-sm text-plum/70">{item.authors}</p>
      <p className="mt-1 text-sm font-medium text-violet">
        {item.journal} · {item.year} · {item.studyType}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-lilac-50 px-2 py-0.5 font-mono text-plum">PMID {item.pmid}</span>
        <span className="rounded bg-lilac-50 px-2 py-0.5 font-mono text-plum">DOI {item.doi}</span>
        {item.openAccess && (
          <span className="rounded bg-green-100 px-2 py-0.5 font-semibold text-green-700">Open access</span>
        )}
        {item.citations > 0 && (
          <span className="rounded bg-violet/10 px-2 py-0.5 font-semibold text-violet">
            {item.citations.toLocaleString()} citas
          </span>
        )}
      </div>
      <div className="mt-3 rounded-xl bg-violet/5 p-3">
        <p className="text-xs font-bold uppercase text-mauve">Implicancia clínica</p>
        <p className="mt-1 text-sm text-plum/90">{item.clinicalTakeaway}</p>
      </div>
      {expanded && (
        <div className="mt-3 rounded-xl bg-bone/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-mauve">Abstract</p>
          <p className="mt-2 text-sm leading-relaxed text-plum/85">{item.abstract}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={saved ? 'primary' : 'secondary'}
          className="!px-4 !py-2 text-sm"
          onClick={handleSave}
        >
          {saved ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
          {saved ? 'En biblioteca' : 'Añadir a biblioteca'}
        </Button>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-plum ring-1 ring-lilac/40 hover:ring-violet/30"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Ocultar abstract' : 'Ver abstract'}
        </button>
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-violet hover:bg-violet/5"
        >
          PubMed <ExternalLink size={14} />
        </a>
        <a
          href={`https://doi.org/${item.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-violet hover:bg-violet/5"
        >
          DOI <ExternalLink size={14} />
        </a>
      </div>
    </AppCard>
  )
}

function FeedHeader({ tag, timeLabel, isNew }: { tag: string; timeLabel: string; isNew?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-[11px] font-semibold text-violet">{tag}</span>
      {isNew && (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">NUEVO</span>
      )}
      <span className="text-xs text-plum/50">{timeLabel}</span>
    </div>
  )
}

export function BriefingFeedCard({ item }: { item: BriefingFeedItem }) {
  switch (item.type) {
    case 'guide':
      return <GuideCard item={item} />
    case 'congress':
      return <CongressCard item={item} />
    case 'paper':
      return <PaperCard item={item} />
  }
}

export function BriefingPaperFeedCard({ item }: { item: BriefingPaper }) {
  return <PaperCard item={item} defaultExpanded={false} />
}
