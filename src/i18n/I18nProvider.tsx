import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppNotification, Item } from '../data/types'
import { formatShortDate, timeAgo } from '../utils/date'
import { I18nContext, type I18n, type TKey } from './I18nContext'
import { en } from './locales/en'
import { ja } from './locales/ja'
import type { Lang } from './types'

const STORAGE_KEY = 'unifind-lang'
const dicts: Record<Lang, Record<string, string>> = { en, ja }

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ja') return saved
  } catch {
    // storage unavailable
  }
  return navigator.language?.toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable
    }
  }, [])

  const value = useMemo<I18n>(() => {
    const dict = dicts[lang]
    // Lookup by arbitrary string; falls back to en, then undefined.
    const find = (key: string) => dict[key] ?? dicts.en[key]
    const t = (key: TKey, params?: Record<string, string | number>) => {
      let s = find(key) ?? key
      if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v))
      return s
    }
    // Only translate when the lang is not en and the key exists (seed data).
    const own = (key: string) => (lang === 'en' ? undefined : dict[key])
    return {
      lang,
      setLang,
      t,
      category: (c) => t(`category.${c}` as TKey),
      location: (l) => find(`location.${l}`) ?? l,
      item: (i: Item) => ({
        ...i,
        name: own(`item.${i.id}.name`) ?? i.name,
        description: own(`item.${i.id}.description`) ?? i.description,
      }),
      notif: (n: AppNotification) => ({
        ...n,
        title: own(`notif.${n.id}.title`) ?? n.title,
        body: own(`notif.${n.id}.body`) ?? n.body,
      }),
      date: (iso) => formatShortDate(iso, lang),
      ago: (iso) => timeAgo(iso, lang),
    }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
