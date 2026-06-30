import { useEffect, useMemo, useState } from 'react'
import { Plus, Clock, CheckCircle2, Search, Trash2 } from 'lucide-react'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import type { RondaSession } from '@/lib/mock-ronda-store'
import { cn } from '@/lib/utils'

const SESSION_PAGE_SIZE = 4

interface RondaSessionBarProps {
  sessions: RondaSession[]
  activeId: string
  lastSaved: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

function formatSavedAt(iso: string | null): string {
  if (!iso) return 'Sin guardar'
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 10_000) return 'Guardado ahora'
  if (diff < 60_000) return 'Guardado hace segundos'
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `Guardado hace ${mins} min`
  return `Guardado ${new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
}

export function RondaSessionBar({
  sessions,
  activeId,
  lastSaved,
  onSelect,
  onNew,
  onDelete,
}: RondaSessionBarProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sessions
    return sessions.filter((s) => s.title.toLowerCase().includes(q))
  }, [sessions, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / SESSION_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * SESSION_PAGE_SIZE
    return filtered.slice(start, start + SESSION_PAGE_SIZE)
  }, [filtered, safePage])

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const activeVisible = filtered.some((s) => s.id === activeId)

  return (
    <AppCard className="mb-6 !p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-plum/60">
          <Clock size={14} className="text-violet" />
          <span>{formatSavedAt(lastSaved)} · borrador automático</span>
        </div>
        <Button variant="secondary" className="!py-2 text-sm" onClick={onNew}>
          <Plus size={16} />
          Nueva ronda
        </Button>
      </div>

      {sessions.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-plum/40"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ronda por título…"
              className="w-full rounded-xl border border-lilac/40 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-plum/40 focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/20"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-plum/60">
              Ninguna ronda coincide con &ldquo;{search}&rdquo;
            </p>
          ) : (
            <>
              {!activeVisible && search.trim() && (
                <p className="text-xs text-amber-700">
                  La ronda activa no coincide con esta búsqueda.
                </p>
              )}

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {paginated.map((s) => {
                  const active = s.id === activeId
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        'group relative rounded-xl border transition',
                        active
                          ? 'border-violet bg-violet/5 ring-1 ring-violet/20'
                          : 'border-lilac/30 bg-white hover:border-violet/30',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(s.id)}
                        className="flex w-full flex-col items-start px-3 py-2.5 pr-9 text-left"
                      >
                        <span className="flex w-full items-center gap-1.5">
                          {s.status === 'completed' && (
                            <CheckCircle2 size={12} className="shrink-0 text-green-600" />
                          )}
                          <span className="line-clamp-2 text-sm font-medium leading-snug text-ink">
                            {s.title}
                          </span>
                        </span>
                        <span className="mt-1 text-[11px] text-plum/50">
                          Paso {s.step}/4 · {s.status === 'completed' ? 'Completada' : 'Borrador'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(s.id)
                        }}
                        className="absolute right-2 top-2 rounded-lg p-1.5 text-plum/40 opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                        aria-label={`Eliminar ronda ${s.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>

              {filtered.length > SESSION_PAGE_SIZE && (
                <Pagination
                  page={safePage}
                  pageSize={SESSION_PAGE_SIZE}
                  total={filtered.length}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      )}
    </AppCard>
  )
}
