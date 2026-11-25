import type { Lang } from '../i18n/types'

// "2026-11-18" -> "Nov 18" (en) or "11月18日" (ja)
export function formatShortDate(iso: string, lang: Lang = 'en'): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// ISO date (YYYY-MM-DD) for n days before today, so sample data stays fresh.
export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toLocaleDateString('en-CA')
}

// Whole days between an ISO date and today.
export function daysSince(iso: string): number {
  const today = new Date(daysAgo(0) + 'T00:00:00').getTime()
  const date = new Date(`${iso}T00:00:00`).getTime()
  return Math.round((today - date) / 86_400_000)
}

// ISO datetime for n hours before now, so sample data stays fresh.
export function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 3_600_000).toISOString()
}

// "Just now", "12m ago", "3h ago", "Yesterday", "3d ago", or "Nov 4" after a week.
export function timeAgo(iso: string, lang: Lang = 'en'): string {
  const ja = lang === 'ja'
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (mins < 1) return ja ? 'たった今' : 'Just now'
  if (mins < 60) return ja ? `${mins}分前` : `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return ja ? `${hours}時間前` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return ja ? '昨日' : 'Yesterday'
  if (days <= 7) return ja ? `${days}日前` : `${days}d ago`
  return formatShortDate(new Date(iso).toLocaleDateString('en-CA'), lang)
}
