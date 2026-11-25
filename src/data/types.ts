export type ItemStatus = 'lost' | 'found' | 'resolved'

export type Category =
  | 'Electronics'
  | 'Wallets'
  | 'Keys'
  | 'Bags'
  | 'Accessories'
  | 'Books'

export type Handover = 'with-me' | 'office'

export interface Item {
  id: string
  name: string
  emoji: string
  category: Category
  status: ItemStatus
  location: string
  date: string // ISO date
  description: string
  time?: string // HH:mm
  imageUrl?: string // local preview of an uploaded photo
  contact?: string // lost reports only
  handover?: Handover // found reports only
  mine?: boolean // posted by the current user
  resolvedFrom?: 'lost' | 'found' // original status of a resolved post
  resolvedAt?: string // ISO date
}

export type NotificationType = 'match' | 'saved-search' | 'status' | 'message'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string // ISO datetime
  read: boolean
  to: string // route to open
  itemId?: string // shows the item's thumb
}
