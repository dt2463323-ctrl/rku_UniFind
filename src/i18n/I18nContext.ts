import { createContext } from 'react'
import type { Category, AppNotification, Item } from '../data/types'
import type { en } from './locales/en'
import type { Lang } from './types'

export type TKey = keyof typeof en

export interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TKey, params?: Record<string, string | number>) => string
  category: (c: Category) => string
  location: (l: string) => string
  item: (i: Item) => Item
  notif: (n: AppNotification) => AppNotification
  date: (iso: string) => string
  ago: (iso: string) => string
}

export const I18nContext = createContext<I18n | null>(null)
