import { Calendar, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Item } from '../data/types'
import { useI18n } from '../i18n'
import { ItemThumb } from './ItemThumb'
import { StatusBadge } from './StatusBadge'

// Static summary (no link, no chevron) for places like confirmation sheets.
export function ItemSummary({ item }: { item: Item }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/5">
      <ItemRowBody item={item} />
    </div>
  )
}

export function ItemRow({ item }: { item: Item }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <ItemRowBody item={item} />
      <ChevronRight size={16} className="shrink-0 text-slate-300" />
    </Link>
  )
}

function ItemRowBody({ item: raw }: { item: Item }) {
  const { item: tr, location, date } = useI18n()
  const item = tr(raw)
  return (
    <>
      <ItemThumb item={item} className="h-16 w-16 shrink-0 rounded-xl" emojiSize="text-3xl" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-semibold leading-snug">{item.name}</p>
          <StatusBadge status={item.status} />
        </div>
        <p className="flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} className="shrink-0 text-red-500" />
          <span className="truncate">{location(item.location)}</span>
        </p>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Calendar size={12} className="shrink-0" />
          {date(item.date)}
        </p>
      </div>
    </>
  )
}

export function ItemRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/5">
      <div className="h-16 w-16 rounded-xl bg-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="h-3 w-1/3 rounded bg-slate-100" />
      </div>
    </div>
  )
}
