import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Item } from '../data/types'
import { useI18n } from '../i18n'
import { ItemThumb } from './ItemThumb'
import { StatusBadge } from './StatusBadge'

export function ItemCard({ item: raw }: { item: Item }) {
  const { item: tr, location, date } = useI18n()
  const item = tr(raw)
  return (
    <Link
      to={`/items/${item.id}`}
      className="block w-40 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition active:scale-[0.98]"
    >
      <ItemThumb item={item} className="h-24 w-full" emojiSize="text-4xl" />
      <div className="space-y-1.5 p-3">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <p className="flex items-center gap-1 text-[11px] text-muted">
          <MapPin size={11} className="text-red-500" />
          <span className="truncate">
            {location(item.location)} · {date(item.date)}
          </span>
        </p>
        <StatusBadge status={item.status} />
      </div>
    </Link>
  )
}
