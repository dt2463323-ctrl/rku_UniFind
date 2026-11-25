import { createContext, useContext } from 'react'
import type { AppNotification } from './types'

export interface NotificationsStore {
  notifications: AppNotification[]
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
}

export const NotificationsContext = createContext<NotificationsStore | null>(null)

export function useNotifications(): NotificationsStore {
  const store = useContext(NotificationsContext)
  if (!store) throw new Error('useNotifications must be used inside NotificationsProvider')
  return store
}
