import {
  seedManagementPlans,
  type ManagementPlan,
  type ManagementPlanItem,
} from '@/lib/mock-app-data'
import type { LibrarySearchContext } from '@/lib/library-search-context'
import type { PubMedResult } from '@/lib/mock-app-data'
import type { RondaSession, RondaStudyMaterial } from '@/lib/mock-ronda-store'

const PLANS_KEY = 'alivia.mock.managementPlans'

function loadPlans(): ManagementPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_KEY)
    return raw ? (JSON.parse(raw) as ManagementPlan[]) : seedManagementPlans
  } catch {
    return seedManagementPlans
  }
}

function savePlans(plans: ManagementPlan[]) {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans))
  window.dispatchEvent(new Event('alivia-management-plans-updated'))
}

export function getManagementPlans(): ManagementPlan[] {
  const stored = localStorage.getItem(PLANS_KEY)
  if (!stored) {
    savePlans(seedManagementPlans)
    return seedManagementPlans
  }
  return loadPlans().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

export function upsertManagementPlan(plan: ManagementPlan) {
  const plans = getManagementPlans()
  const idx = plans.findIndex((p) => p.id === plan.id)
  const next = { ...plan, updatedAt: new Date().toISOString() }
  if (idx >= 0) plans[idx] = next
  else plans.unshift(next)
  savePlans(plans)
}

export function updatePlanItem(
  planId: string,
  itemId: string,
  patch: Partial<Pick<ManagementPlanItem, 'completed' | 'priority'>>,
) {
  const plans = getManagementPlans()
  const plan = plans.find((p) => p.id === planId)
  if (!plan) return
  const items = plan.items.map((item) =>
    item.id === itemId ? { ...item, ...patch } : item,
  )
  upsertManagementPlan({ ...plan, items })
}

export function addManagementPlanFromRonda(
  session: RondaSession,
  material: RondaStudyMaterial,
  selected: PubMedResult[],
): void {
  if (session.studySynced || material.managementItems.length === 0) return

  const searchContext: LibrarySearchContext = {
    sourceLabel: `Ronda · ${session.title}`,
    clinicalQuestion: material.specialistQuestion,
    patientLabel: material.patient,
    pmids: selected.map((a) => a.pmid),
    origin: 'ronda',
  }

  upsertManagementPlan({
    id: `plan-ronda-${session.id}`,
    patientLabel: material.patient,
    specialistQuestion: material.specialistQuestion,
    searchContext,
    items: material.managementItems.map((item, i) => ({
      id: `${session.id.slice(0, 8)}-${item.pmid}-${i}`,
      claim: item.claim,
      pmid: item.pmid,
      priority: i === 0 ? 'alta' : 'media',
      completed: false,
    })),
    createdAt: session.createdAt,
    updatedAt: new Date().toISOString(),
  })
}
