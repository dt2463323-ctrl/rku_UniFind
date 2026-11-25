import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  icon: LucideIcon
  tile: string // icon tile colours
  label: string
  hint?: string
  badge?: ReactNode
  to?: string
  onClick?: () => void
}

// One row of the Profile menu: a link or a button with the same look.
export function MenuRow({ icon: Icon, tile, label, hint, badge, to, onClick }: Props) {
  const body = (
    <>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tile}`}>
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block truncate text-xs text-muted">{hint}</span>}
      </span>
      {badge}
      <ChevronRight size={16} className="shrink-0 text-slate-400" />
    </>
  )
  const cls = 'flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-surface'
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  )
}

export function CountBadge({ count, tone = 'bg-surface text-navy' }: { count: number; tone?: string }) {
  if (!count) return null
  return (
    <span className={`min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-bold tabular-nums ${tone}`}>
      {count}
    </span>
  )
}
