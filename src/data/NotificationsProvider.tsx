import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { notifications as sampleNotifications } from './notifications'
import { NotificationsContext } from './notificationsContext'
import type { AppNotification } from './types'

// In-memory store: read state lives until the page reloads.
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(sampleNotifications)
  const markRead = useCallback(
    (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [],
  )
  const markAllRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), [])
  const value = useMemo(
    () => ({ notifications, unreadCount: notifications.filter((n) => !n.read).length, markRead, markAllRead }),
    [notifications, markRead, markAllRead],
  )
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
