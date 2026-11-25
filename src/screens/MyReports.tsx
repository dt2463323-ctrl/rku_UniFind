import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ItemSummary } from '../components/ItemRow'
import { ReportCard } from '../components/ReportCard'
import { Sheet } from '../components/Sheet'
import { Toast } from '../components/Toast'
import type { ReportTab } from '../data/helpers'
import { useItems } from '../data/itemsContext'
import { findMatches } from '../data/matching'
import { useI18n, type TKey } from '../i18n'
import type { Item } from '../data/types'
import { daysAgo } from '../utils/date'

const tabs: { value: ReportTab; label: TKey }[] = [
  { value: 'lost', label: 'status.lost' },
  { value: 'found', label: 'status.found' },
  { value: 'resolved', label: 'status.resolved' },
]

const empty: Record<ReportTab, { emoji: string; title: TKey; text: TKey; cta?: { to: string; label: TKey } }> = {
  lost: {
    emoji: '🍀',
    title: 'reports.empty.lost.title',
    text: 'reports.empty.lost.text',
    cta: { to: '/report?type=lost', label: 'reports.empty.lost.cta' },
  },
  found: {
    emoji: '🤝',
    title: 'reports.empty.found.title',
    text: 'reports.empty.found.text',
    cta: { to: '/report?type=found', label: 'reports.empty.found.cta' },
  },
  resolved: {
    emoji: '🎉',
    title: 'reports.empty.resolved.title',
    text: 'reports.empty.resolved.text',
  },
}

interface ToastState {
  id: number
  message: string
  undo?: () => void
}

export function MyReports() {
  const { t, item: tItem } = useI18n()
  const { items, updateItem, removeItem } = useItems()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const tab = (['lost', 'found', 'resolved'].includes(params.get('tab') ?? '') ? params.get('tab') : 'lost') as ReportTab

  const [toast, setToast] = useState<ToastState | null>(null)
  const [deleting, setDeleting] = useState<Item | null>(null)

  // Toast handed over from the Report form after editing.
  useEffect(() => {
    const message = (location.state as { toast?: string } | null)?.toast
    if (message) {
      setToast({ id: Date.now(), message })
      navigate(location.pathname + location.search, { replace: true, state: null })
    }
  }, [location, navigate])

  const mine = items.filter((i) => i.mine)
  const counts = { lost: 0, found: 0, resolved: 0 } as Record<ReportTab, number>
  mine.forEach((i) => counts[i.status]++)
  const shown = mine
    .filter((i) => i.status === tab)
    .sort((a, b) => (b.resolvedAt ?? b.date).localeCompare(a.resolvedAt ?? a.date))
  const active = counts.lost + counts.found

  const resolve = (item: Item) => {
    const from = item.status as 'lost' | 'found'
    updateItem(item.id, { status: 'resolved', resolvedFrom: from, resolvedAt: daysAgo(0) })
    setToast({
      id: Date.now(),
      message: t(from === 'lost' ? 'reports.toast.gotBack' : 'reports.toast.returned'),
      undo: () => updateItem(item.id, { status: from, resolvedFrom: undefined, resolvedAt: undefined }),
    })
  }

  const confirmDelete = () => {
    if (!deleting) return
    removeItem(deleting.id)
    setToast({ id: Date.now(), message: t('reports.toast.deleted') })
    setDeleting(null)
  }

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-extrabold">{t('reports.title')}</h1>
        <p className="text-sm text-muted">
          {active === 0
            ? t('reports.none')
            : t(active === 1 ? 'reports.openOne' : 'reports.openMany', { n: active }) +
              (counts.resolved ? t('reports.closedSuffix', { n: counts.resolved }) : '')}
        </p>
      </header>

      <div role="tablist" aria-label={t('reports.tabsLabel')} className="grid grid-cols-3 rounded-2xl bg-white p-1 ring-1 ring-black/5">
        {tabs.map((tb) => {
          const activeTab = tab === tb.value
          return (
            <button
              key={tb.value}
              role="tab"
              aria-selected={activeTab}
              onClick={() => setParams({ tab: tb.value }, { replace: true })}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200 ${
                activeTab ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-muted'
              }`}
            >
              {t(tb.label)}
              <span
                className={`min-w-5 rounded-full px-1.5 text-[11px] tabular-nums ${
                  activeTab ? 'bg-white/25 text-white' : 'bg-surface text-navy'
                }`}
              >
                {counts[tb.value]}
              </span>
            </button>
          )
        })}
      </div>

      {shown.length > 0 ? (
        <div className="space-y-3">
          {shown.map((item) => (
            <ReportCard
              key={item.id}
              item={item}
              matchCount={item.status === 'lost' ? findMatches(item, items).length : 0}
              onEdit={() => navigate(`/report?edit=${item.id}`)}
              onResolve={() => resolve(item)}
              onDelete={() => setDeleting(item)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-black/5">
          <span className="text-5xl" aria-hidden>
            {empty[tab].emoji}
          </span>
          <p className="mt-1 font-semibold">{t(empty[tab].title)}</p>
          <p className="max-w-64 text-sm leading-relaxed text-muted">{t(empty[tab].text)}</p>
          {empty[tab].cta && (
            <Link
              to={empty[tab].cta.to}
              className="mt-3 flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/30"
            >
              <Plus size={16} strokeWidth={2.5} /> {t(empty[tab].cta.label)}
            </Link>
          )}
        </div>
      )}

      <Sheet open={!!deleting} title={t('reports.delete.title')} onClose={() => setDeleting(null)}>
        {deleting && (
          <div className="space-y-4">
            <ItemSummary item={tItem(deleting)} />
            <p className="text-sm leading-relaxed text-muted">
              {t('reports.delete.text')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="rounded-2xl py-3.5 text-sm font-semibold text-navy ring-1 ring-black/10"
              >
                {t('reports.delete.keep')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-2xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        )}
      </Sheet>

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          actionLabel={toast.undo ? t('reports.undo') : undefined}
          onAction={toast.undo}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  )
}
