import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Presentation, HelpCircle, Headphones, Info } from 'lucide-react'
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
  type NotificationType,
} from '@/lib/mock-notifications-store'
import { cn } from '@/lib/utils'

const typeIcons: Record<NotificationType, typeof Presentation> = {
  presentation: Presentation,
  quiz: HelpCircle,
  podcast: Headphones,
  info: Info,
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>(() => getNotifications())
  const [unread, setUnread] = useState(() => getUnreadNotificationCount())
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const refresh = () => {
      setItems(getNotifications())
      setUnread(getUnreadNotificationCount())
    }
    window.addEventListener('alivia-notifications-updated', refresh)
    return () => window.removeEventListener('alivia-notifications-updated', refresh)
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const handleOpen = () => {
    setOpen((v) => !v)
  }

  const handleRead = (id: string) => {
    markNotificationRead(id)
    setOpen(false)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleOpen}
        className="relative rounded-full p-2 text-plum hover:bg-lilac-50"
        title="Notificaciones"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-lilac/30 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-lilac/20 px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notificaciones</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead()}
                className="text-xs font-semibold text-violet hover:underline"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-plum/60">Sin notificaciones</p>
            ) : (
              items.map((n) => {
                const Icon = typeIcons[n.type]
                const content = (
                  <>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn('text-sm font-medium', n.read ? 'text-plum/80' : 'text-ink')}>
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-plum/65">{n.message}</p>
                      <p className="mt-1 text-[10px] text-plum/45">{formatWhen(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet" />}
                  </>
                )

                if (n.href) {
                  return (
                    <Link
                      key={n.id}
                      to={n.href}
                      onClick={() => handleRead(n.id)}
                      className={cn(
                        'flex gap-3 px-4 py-3 transition hover:bg-bone/60',
                        !n.read && 'bg-violet/5',
                      )}
                    >
                      {content}
                    </Link>
                  )
                }

                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleRead(n.id)}
                    className={cn(
                      'flex w-full gap-3 px-4 py-3 text-left transition hover:bg-bone/60',
                      !n.read && 'bg-violet/5',
                    )}
                  >
                    {content}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
