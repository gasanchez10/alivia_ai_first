export type NotificationType = 'presentation' | 'quiz' | 'podcast' | 'info'

export interface AppNotification {
  id: string
  title: string
  message: string
  href?: string
  read: boolean
  createdAt: string
  type: NotificationType
}

const NOTIFICATIONS_KEY = 'alivia.mock.notifications'

function load(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    return raw ? (JSON.parse(raw) as AppNotification[]) : []
  } catch {
    return []
  }
}

function save(items: AppNotification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('alivia-notifications-updated'))
}

export function getNotifications(): AppNotification[] {
  return load()
}

export function getUnreadNotificationCount(): number {
  return load().filter((n) => !n.read).length
}

export function addNotification(
  input: Omit<AppNotification, 'id' | 'read' | 'createdAt'>,
): AppNotification {
  const item: AppNotification = {
    ...input,
    id: `notif-${crypto.randomUUID().slice(0, 8)}`,
    read: false,
    createdAt: new Date().toISOString(),
  }
  save([item, ...load()])
  return item
}

export function markNotificationRead(id: string) {
  const next = load().map((n) => (n.id === id ? { ...n, read: true } : n))
  save(next)
}

export function markAllNotificationsRead() {
  save(load().map((n) => ({ ...n, read: true })))
}
