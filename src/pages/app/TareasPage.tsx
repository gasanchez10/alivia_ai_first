import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Circle, ChevronDown, ExternalLink, FileCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { LibrarySearchLink } from '@/components/app/library/LibrarySearchLink'
import {
  getManagementPlans,
  updatePlanItem,
} from '@/lib/mock-management-plans-store'
import type { ManagementPlan, PlanItemPriority } from '@/lib/mock-app-data'
import { cn } from '@/lib/utils'

const priorityOrder: Record<PlanItemPriority, number> = { alta: 0, media: 1, baja: 2 }

const priorityColors: Record<PlanItemPriority, string> = {
  alta: 'text-red-600 bg-red-50 ring-red-100',
  media: 'text-amber-700 bg-amber-50 ring-amber-100',
  baja: 'text-plum/70 bg-lilac-50 ring-lilac/30',
}

const priorityLabels: Record<PlanItemPriority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

function nextPriority(current: PlanItemPriority): PlanItemPriority {
  if (current === 'alta') return 'media'
  if (current === 'media') return 'baja'
  return 'alta'
}

function sortItems<T extends { priority: PlanItemPriority; completed: boolean }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

function planProgress(plan: ManagementPlan) {
  const done = plan.items.filter((i) => i.completed).length
  return { done, total: plan.items.length }
}

export function TareasPage() {
  const [plans, setPlans] = useState<ManagementPlan[]>(() => getManagementPlans())
  const [expandedId, setExpandedId] = useState<string | null>(
    () => getManagementPlans()[0]?.id ?? null,
  )

  useEffect(() => {
    const refresh = () => setPlans(getManagementPlans())
    window.addEventListener('alivia-management-plans-updated', refresh)
    return () => window.removeEventListener('alivia-management-plans-updated', refresh)
  }, [])

  const pendingItems = useMemo(
    () => plans.reduce((sum, p) => sum + p.items.filter((i) => !i.completed).length, 0),
    [plans],
  )

  const toggleCompleted = (planId: string, itemId: string, completed: boolean) => {
    updatePlanItem(planId, itemId, { completed: !completed })
    setPlans(getManagementPlans())
  }

  const cyclePriority = (planId: string, itemId: string, current: PlanItemPriority) => {
    updatePlanItem(planId, itemId, { priority: nextPriority(current) })
    setPlans(getManagementPlans())
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        section="Estudio"
        title="Planes de manejo"
        description="Afirmaciones citadas por paciente o caso. Prioriza ítems y márcalos al cerrar el plan."
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/10 px-3 py-1 text-sm font-semibold text-violet">
            <FileCheck size={16} />
            {pendingItems} ítems pendientes
          </span>
        }
      />

      {plans.length === 0 ? (
        <AppCard className="border-dashed border-violet/30 bg-violet/5">
          <p className="text-sm text-plum/70">
            Aún no tienes planes. Genera uno al cerrar una búsqueda en{' '}
            <Link to="/app/ronda" className="font-semibold text-violet hover:underline">
              Ronda
            </Link>
            .
          </p>
        </AppCard>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const { done, total } = planProgress(plan)
            const expanded = expandedId === plan.id
            const sorted = sortItems(plan.items)

            return (
              <AppCard key={plan.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : plan.id)}
                  className="flex w-full items-start gap-3 p-5 text-left"
                >
                  <FileCheck size={20} className="mt-0.5 shrink-0 text-violet" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{plan.patientLabel}</p>
                    {plan.specialistQuestion && (
                      <p className="mt-1 text-sm text-plum/65 line-clamp-2">
                        {plan.specialistQuestion}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-plum/50">
                      {plan.searchContext.sourceLabel} · {done}/{total} completados
                    </p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-plum/40 transition-transform',
                      expanded && 'rotate-180',
                    )}
                  />
                </button>

                {expanded && (
                  <div className="border-t border-lilac/20 px-5 pb-5">
                    <div className="mt-4 rounded-xl border border-lilac/30 bg-bone/40 p-4">
                      <LibrarySearchLink context={plan.searchContext} />
                    </div>

                    <ul className="mt-4 space-y-2">
                      {sorted.map((item) => (
                        <li
                          key={item.id}
                          className={cn(
                            'flex gap-3 rounded-xl border border-lilac/25 bg-white p-4',
                            item.completed && 'opacity-60',
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => toggleCompleted(plan.id, item.id, item.completed)}
                            className="mt-0.5 shrink-0 text-violet"
                            aria-label={item.completed ? 'Marcar pendiente' : 'Marcar completado'}
                          >
                            {item.completed ? (
                              <CheckCircle2 size={22} />
                            ) : (
                              <Circle size={22} />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => cyclePriority(plan.id, item.id, item.priority)}
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1',
                                  priorityColors[item.priority],
                                )}
                                title="Cambiar prioridad"
                              >
                                {priorityLabels[item.priority]}
                              </button>
                            </div>
                            <p
                              className={cn(
                                'mt-1.5 text-sm leading-relaxed text-plum/90',
                                item.completed && 'line-through',
                              )}
                            >
                              {item.claim}
                            </p>
                            <a
                              href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
                            >
                              PMID {item.pmid} <ExternalLink size={12} />
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AppCard>
            )
          })}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-plum/60">
        Los planes se generan al cerrar una búsqueda en{' '}
        <Link to="/app/ronda" className="font-semibold text-violet hover:underline">
          Ronda
        </Link>
        .
      </p>
    </div>
  )
}
