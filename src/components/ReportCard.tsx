import { CalendarDays, CheckCircle2, ChevronRight, Clock, MapPin, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { reportStatusLine } from '../data/helpers'
import type { Item } from '../data/types'
import { useI18n } from '../i18n'
import { ItemThumb } from './ItemThumb'
import { StatusBadge } from './StatusBadge'

interface Props {
  item: Item
  matchCount: number
  onEdit: () => void
  onResolve: () => void
  onDelete: () => void
}

const toneStyles = {
  info: { cls: 'bg-primary-soft text-primary-dark', icon: Sparkles },
  wait: { cls: 'bg-amber-50 text-amber-800', icon: Clock },
  done: { cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
}

// An own post: what is happening now plus the next step on its face.
export function ReportCard({ item: rawItem, matchCount, onEdit, onResolve, onDelete }: Props) {
  const { t, item: tItem, location, date } = useI18n()
  const item = tItem(rawItem)
  const status = reportStatusLine(item, matchCount, t)
  const tone = toneStyles[status.tone]
  const resolved = item.status === 'resolved'
  const StatusIcon = tone.icon

  const statusPill = (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${tone.cls}`}>
      <StatusIcon size={14} className="shrink-0" />
      {status.text}
      {status.tone === 'info' && <ChevronRight size={14} className="-mr-0.5 shrink-0" />}
    </span>
  )

  const deleteButton = (
    <button
      type="button"
      onClick={onDelete}
      aria-label={t('reports.card.deleteAria', { name: item.name })}
      className="flex h-8 w-9 shrink-0 items-center justify-center rounded-xl text-red-600 ring-1 ring-red-200"
    >
      <Trash2 size={15} />
    </button>
  )

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <Link to={`/items/${item.id}`} className="flex gap-3 p-3 pb-2">
        <ItemThumb item={item} className="h-16 w-16 shrink-0 rounded-xl" emojiSize="text-3xl" />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{item.name}</h3>
            <StatusBadge status={item.status} />
          </div>
          <p className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={12} className="shrink-0 text-red-500" />
            <span className="truncate">{location(item.location)}</span>
          </p>
          <p className="flex items-center gap-1 text-xs text-muted">
            <CalendarDays size={12} className="shrink-0" />
            {resolved && item.resolvedAt
              ? t('reports.card.closed', { date: date(item.resolvedAt) })
              : t(item.status === 'lost' ? 'reports.card.lost' : 'reports.card.found', { date: date(item.date) })}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        {status.tone === 'info' ? <Link to={`/items/${item.id}/matches`}>{statusPill}</Link> : statusPill}
        {resolved && deleteButton}
      </div>

      {!resolved && (
        <div className="flex items-center gap-2 border-t border-black/5 px-3 py-2.5">
          <button
            type="button"
            onClick={onResolve}
            className="flex-1 rounded-xl bg-emerald-700 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-700/30 active:scale-[0.98]"
          >
            {t(item.status === 'lost' ? 'reports.card.gotBack' : 'reports.card.returned')}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-navy ring-1 ring-black/10"
          >
            <Pencil size={13} /> {t('common.edit')}
          </button>
          {deleteButton}
        </div>
      )}
    </article>
  )
}
