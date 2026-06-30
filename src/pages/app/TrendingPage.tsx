import { useMemo, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { BriefingPaperFeedCard } from '@/components/app/briefing/BriefingFeedCard'
import { BriefingFilterBar } from '@/components/app/briefing/BriefingFilterBar'
import { AppCard } from '@/components/app/AppCard'
import { useAuth } from '@/context/AuthContext'
import {
  collectBriefingSpecialties,
  filterBriefingPapers,
  resolveDefaultSpecialtyFilters,
  specialtyFilterSummary,
} from '@/lib/briefing-filters'
import { trendingPapersRich } from '@/lib/mock-briefing'

const trendingSpecialties = collectBriefingSpecialties(trendingPapersRich)

export function TrendingPage() {
  const { user } = useAuth()
  const [specialtyFilter, setSpecialtyFilter] = useState<string[]>(() =>
    resolveDefaultSpecialtyFilters(user?.specialty, trendingSpecialties),
  )

  const filtered = useMemo(
    () => filterBriefingPapers(trendingPapersRich, specialtyFilter, trendingSpecialties),
    [specialtyFilter],
  )

  const specialtyLabel = specialtyFilterSummary(specialtyFilter, trendingSpecialties)

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        section="Inteligencia diaria"
        title="Alta citación"
        description="Los papers más citados en tu especialidad — abstract, DOI y guardar en un clic."
      />

      <AppCard className="mb-6 flex items-center gap-3 border-green-200/40 bg-green-50/40 py-4">
        <TrendingUp className="shrink-0 text-green-700" size={22} />
        <p className="text-sm text-green-900">
          Ranking basado en citaciones PubMed + relevancia para{' '}
          <strong>{specialtyLabel}</strong> · Colombia
        </p>
      </AppCard>

      <BriefingFilterBar
        showTypeFilter={false}
        specialtyFilter={specialtyFilter}
        onSpecialtyFilterChange={setSpecialtyFilter}
        specialties={trendingSpecialties}
      />

      {filtered.length === 0 ? (
        <AppCard className="py-10 text-center">
          <p className="text-sm text-plum/70">No hay papers para esta especialidad.</p>
          <button
            type="button"
            onClick={() => setSpecialtyFilter([])}
            className="mt-3 text-sm font-semibold text-violet hover:underline"
          >
            Ver todas
          </button>
        </AppCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((paper, i) => (
            <div key={paper.id} className="relative">
              <span className="absolute -left-1 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-violet font-display text-sm font-bold text-white shadow-md sm:-left-3">
                {i + 1}
              </span>
              <div className="pl-6 sm:pl-4">
                <BriefingPaperFeedCard item={paper} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
