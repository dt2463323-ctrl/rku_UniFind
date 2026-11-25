import type { Item } from '../data/types'
import { useI18n } from '../i18n'

// Uploaded photo when present, otherwise the item's emoji on a soft tile.
export function ItemThumb({
  item,
  className,
  emojiSize,
  tile = 'bg-slate-100',
}: {
  item: Item
  className: string
  emojiSize: string
  tile?: string
}) {
  const { item: tr } = useI18n()
  if (item.imageUrl) {
    return <img src={item.imageUrl} alt={tr(item).name} className={`${className} object-cover`} />
  }
  return (
    <div className={`${className} flex items-center justify-center ${tile} ${emojiSize}`} aria-hidden>
      {item.emoji}
    </div>
  )
}
