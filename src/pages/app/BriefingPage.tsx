import { useMemo, useState } from 'react'
import { Headphones, Play, Radio } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { BriefingFeedCard } from '@/components/app/briefing/BriefingFeedCard'
import { BriefingFilterBar } from '@/components/app/briefing/BriefingFilterBar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import {
  collectBriefingSpecialties,
  filterBriefingFeed,
  resolveDefaultSpecialtyFilters,
  specialtyFilterSummary,
  type BriefingTypeFilter,
} from '@/lib/briefing-filters'
import { briefingAudio, briefingFeed } from '@/lib/mock-briefing'

const briefingSpecialties = collectBriefingSpecialties(briefingFeed)

export function BriefingPage() {
  const { user } = useAuth()
  const [typeFilter, setTypeFilter] = useState<BriefingTypeFilter>('Todo')
  const [specialtyFilter, setSpecialtyFilter] = useState<string[]>(() =>
    resolveDefaultSpecialtyFilters(user?.specialty, briefingSpecialties),
  )
  const [playing, setPlaying] = useState(false)

  const filtered = useMemo(
    () => filterBriefingFeed(briefingFeed, typeFilter, specialtyFilter, briefingSpecialties),
    [typeFilter, specialtyFilter],
  )

  const specialtySummary = specialtyFilterSummary(specialtyFilter, briefingSpecialties)

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        section="Inteligencia diaria"
        title="Resumen de hoy"
        description="Guías, congresos y papers nuevos, curado para tu especialidad."
      />

      <AppCard className="mb-6 border-violet/20 bg-gradient-to-r from-violet/5 to-plum/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/15 text-violet">
              <Headphones size={24} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-mauve">Audio del día</p>
              <p className="font-semibold text-ink">{briefingAudio.title}</p>
              <p className="text-sm text-plum/70">Duración {briefingAudio.duration}</p>
              <p className="mt-1 text-xs text-plum/70">{briefingAudio.summary}</p>
            </div>
          </div>
          <Button variant="secondary" className="shrink-0" onClick={() => setPlaying((p) => !p)}>
            <Play size={18} />
            {playing ? 'Pausar' : 'Escuchar'}
          </Button>
        </div>
        {playing && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-lilac/30">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-violet" />
            </div>
            <p className="mt-2 text-xs text-plum/60">4:12 de {briefingAudio.duration}, simulación</p>
          </div>
        )}
      </AppCard>

      <div className="mb-4 flex items-center gap-2 text-sm text-plum/60">
        <Radio size={16} className="text-violet" />
        <span>
          {filtered.length} elementos
          {specialtySummary !== 'todas las especialidades' && ` · ${specialtySummary}`}
          {' · '}actualizado hace 2 h
        </span>
      </div>

      <BriefingFilterBar
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        specialtyFilter={specialtyFilter}
        onSpecialtyFilterChange={setSpecialtyFilter}
        specialties={briefingSpecialties}
      />

      {filtered.length === 0 ? (
        <AppCard className="py-10 text-center">
          <p className="text-sm text-plum/70">
            No hay elementos para esta combinación de filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setTypeFilter('Todo')
              setSpecialtyFilter([])
            }}
            className="mt-3 text-sm font-semibold text-violet hover:underline"
          >
            Ver todo
          </button>
        </AppCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <BriefingFeedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
