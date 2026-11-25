import { ArrowRight, Bell, Plus, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ItemCard } from '../components/ItemCard'
import { LanguageSwitch } from '../components/LanguageSwitch'
import { Logo } from '../components/Logo'
import { categories } from '../data/items'
import { useItems } from '../data/itemsContext'
import { useNotifications } from '../data/notificationsContext'
import { useI18n } from '../i18n'

export function Home() {
  const navigate = useNavigate()
  const { t, category } = useI18n()
  const { items } = useItems()
  const { unreadCount } = useNotifications()
  const recentlyFound = items
    .filter((i) => i.status === 'found')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="space-y-6 px-5 pb-8 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <Link
            to="/notifications"
            aria-label={unreadCount > 0 ? t('home.notificationsUnread', { count: unreadCount }) : t('home.notifications')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-sm"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />}
          </Link>
          <Link
            to="/profile"
            aria-label={t('home.profile')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg"
          >
            🐱
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-100 via-primary-soft to-sky-100 p-5">
        <p className="text-sm font-medium text-muted">{t('home.greeting')}</p>
        <p className="mt-2 text-[11px] font-bold tracking-wider text-primary/80">{t('home.tagline')}</p>
        <h1 className="mt-1 max-w-[70%] text-2xl font-extrabold leading-tight">
          {t('home.hero')}
        </h1>
        <span className="absolute bottom-3 right-4 text-6xl drop-shadow-sm" aria-hidden>
          🐱
        </span>
      </section>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const q = new FormData(e.currentTarget).get('q')?.toString().trim()
          navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
        }}
        className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-black/5"
      >
        <Search size={16} className="text-muted" />
        <input
          name="q"
          placeholder={t('home.searchPlaceholder')}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </form>

      {/* Actions */}
      <section className="grid grid-cols-2 gap-3">
        <Link
          to="/search"
          className="flex h-24 flex-col justify-between rounded-2xl bg-primary p-4 text-white shadow-md shadow-primary/30 active:scale-[0.98]"
        >
          <Search size={20} strokeWidth={2.5} />
          <span className="text-sm font-semibold">{t('home.findLost')}</span>
        </Link>
        <Link
          to="/report?type=found"
          className="flex h-24 flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo to-violet-500 p-4 text-white shadow-md shadow-indigo/30 active:scale-[0.98]"
        >
          <Plus size={22} strokeWidth={2.5} />
          <span className="text-sm font-semibold">{t('home.reportFound')}</span>
        </Link>
      </section>

      {/* Categories */}
      <section>
        <h2 className="mb-3 font-semibold">{t('home.categories')}</h2>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/search?category=${c.name}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm ring-1 ring-black/5"
            >
              <span>{c.emoji}</span>
              {category(c.name)}
            </Link>
          ))}
        </div>
      </section>

      {/* Recently found */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">{t('home.recentlyFound')}</h2>
          <Link to="/search?status=found" className="flex items-center gap-1 text-xs font-semibold text-primary">
            {t('home.seeAll')} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
          {recentlyFound.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Report lost */}
      <section>
        <h2 className="mb-3 font-semibold">{t('home.needReport')}</h2>
        <Link
          to="/report?type=lost"
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/30 active:scale-[0.99]"
        >
          <Plus size={16} strokeWidth={2.5} /> {t('home.reportLost')}
        </Link>
      </section>
    </div>
  )
}
