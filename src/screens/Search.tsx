import { ArrowDownUp, CalendarDays, MapPin, Search as SearchIcon, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ItemRow, ItemRowSkeleton } from '../components/ItemRow'
import { SelectPill } from '../components/SelectPill'
import { filterItems, type ItemFilters } from '../data/helpers'
import { categories, locations } from '../data/items'
import { useItems } from '../data/itemsContext'
import { useI18n } from '../i18n'

export function Search() {
  // Filters live in the URL so Home links like /search?category=Keys work.
  const [params, setParams] = useSearchParams()
  const { items } = useItems()
  const { t, category, location, item: tr } = useI18n()
  const filters: ItemFilters = {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    location: params.get('location') ?? '',
    date: (params.get('date') as ItemFilters['date']) ?? 'any',
    status: (params.get('status') as ItemFilters['status']) ?? 'all',
    sort: (params.get('sort') as ItemFilters['sort']) ?? 'newest',
  }

  const setFilter = (key: keyof ItemFilters, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const statusTabs = [
    { value: 'all', label: t('common.all') },
    { value: 'lost', label: t('status.lost') },
    { value: 'found', label: t('status.found') },
  ] as const
  const dateOptions = [
    { value: 'any', label: t('search.anyTime') },
    { value: 'today', label: t('search.today') },
    { value: 'week', label: t('search.week') },
    { value: 'month', label: t('search.month') },
  ]
  const locationOptions = [
    { value: '', label: t('search.allLocations') },
    ...locations.map((l) => ({ value: l, label: location(l) })),
  ]

  // Fake a short load so the loading state is visible.
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  // Canonical filters first, then match the text query on both English and translated text.
  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const base = filterItems(items, { ...filters, q: '' })
    if (!q) return base
    return base.filter((i) => {
      const tt = tr(i)
      return [i.name, i.description, i.location, tt.name, tt.description, location(i.location)]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [params, items, tr, location])
  const hasFilters = [...params.keys()].some((k) => k !== 'sort')

  return (
    <div className="flex min-h-full flex-col">
      {/* Sticky header with search + filters */}
      <div className="sticky top-0 z-10 space-y-3 bg-surface/95 px-5 pb-3 pt-4 backdrop-blur">
        <h1 className="text-2xl font-extrabold">{t('search.title')}</h1>

        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
          <SearchIcon size={16} className="shrink-0 text-muted" />
          <input
            value={filters.q}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {filters.q && (
            <button onClick={() => setFilter('q', '')} aria-label={t('search.clear')} className="text-muted">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Lost / Found */}
        <div className="grid grid-cols-3 rounded-full bg-white p-1 ring-1 ring-black/5">
          {statusTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter('status', t.value === 'all' ? '' : t.value)}
              className={`rounded-full py-1.5 text-xs font-semibold transition ${
                filters.status === t.value ? 'bg-primary text-white shadow' : 'text-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {categories.map((c) => {
            const active = filters.category === c.name
            return (
              <button
                key={c.name}
                onClick={() => setFilter('category', active ? '' : c.name)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 transition ${
                  active ? 'bg-primary text-white ring-primary' : 'bg-white ring-black/5'
                }`}
              >
                <span>{c.emoji}</span>
                {category(c.name)}
              </button>
            )
          })}
        </div>

        {/* Location + date */}
        <div className="flex gap-2">
          <SelectPill
            label={t('search.location')}
            icon={<MapPin size={14} className="shrink-0" />}
            value={filters.location}
            onChange={(v) => setFilter('location', v)}
            options={locationOptions}
          />
          <SelectPill
            label={t('search.date')}
            icon={<CalendarDays size={14} className="shrink-0" />}
            value={filters.date}
            onChange={(v) => setFilter('date', v === 'any' ? '' : v)}
            options={dateOptions}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 space-y-3 px-5 pb-8 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">
            {loading ? t('search.loading') : results.length === 1 ? t('search.countOne') : t('search.count', { count: results.length })}
            {hasFilters && !loading && (
              <button onClick={() => setParams({}, { replace: true })} className="ml-2 font-semibold text-primary">
                {t('search.clearFilters')}
              </button>
            )}
          </span>
          <button
            onClick={() => setFilter('sort', filters.sort === 'newest' ? 'oldest' : '')}
            className="flex items-center gap-1 font-semibold text-navy"
          >
            <ArrowDownUp size={12} />
            {filters.sort === 'newest' ? t('search.newest') : t('search.oldest')}
          </button>
        </div>

        {loading ? (
          Array.from({ length: 4 }, (_, i) => <ItemRowSkeleton key={i} />)
        ) : results.length > 0 ? (
          results.map((item) => <ItemRow key={item.id} item={item} />)
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="text-5xl">🔍</span>
            <p className="font-semibold">{t('search.emptyTitle')}</p>
            <p className="max-w-60 text-sm text-muted">
              {t('search.emptyBody')}
            </p>
            <button
              onClick={() => setParams({}, { replace: true })}
              className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              {t('search.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
