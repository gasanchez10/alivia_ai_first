const WAITLIST_KEY = 'alivia.waitlist'
const COUNT_KEY = 'alivia.waitlist.baseCount'

export interface WaitlistEntry {
  id: string
  email: string
  country: string
  city: string
  university: string
  year: string
  specialty: string
  whatsapp: boolean
  createdAt: string
}

const BASE_COUNT = 247

export function getWaitlistCount(): number {
  const stored = localStorage.getItem(COUNT_KEY)
  const base = stored ? parseInt(stored, 10) : BASE_COUNT
  const entries = loadEntries()
  return base + entries.length
}

export function loadEntries(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(WAITLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function submitWaitlist(data: Omit<WaitlistEntry, 'id' | 'createdAt'>): Promise<WaitlistEntry> {
  await new Promise((r) => setTimeout(r, 600))
  const entries = loadEntries()
  if (entries.some((e) => e.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('Este correo ya está en la lista')
  }
  const entry: WaitlistEntry = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  entries.push(entry)
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(entries))
  return entry
}

export function getSpotsRemaining(): number {
  return getFounderOfferStats().remaining
}

const FOUNDER_SLOTS = 50
const BASE_CLAIMED_KEY = 'alivia.founder.baseClaimed'
const DEFAULT_BASE_CLAIMED = 39

export interface FounderOfferStats {
  total: number
  claimed: number
  remaining: number
}

export function getFounderOfferStats(): FounderOfferStats {
  const stored = localStorage.getItem(BASE_CLAIMED_KEY)
  const baseClaimed = stored ? parseInt(stored, 10) : DEFAULT_BASE_CLAIMED
  const localJoins = loadEntries().length
  const claimed = Math.min(FOUNDER_SLOTS, baseClaimed + localJoins)
  const remaining = Math.max(0, FOUNDER_SLOTS - claimed)
  return { total: FOUNDER_SLOTS, claimed, remaining }
}
