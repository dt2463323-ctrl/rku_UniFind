import { ArrowLeft, Clock, MessageCircle, Search, Sparkles, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ItemThumb } from '../components/ItemThumb'
import { Toast } from '../components/Toast'
import { groupNotifications } from '../data/helpers'
import { useItems } from '../data/itemsContext'
import { useNotifications } from '../data/notificationsContext'
import type { AppNotification, NotificationType } from '../data/types'
import { useBack } from '../hooks/useBack'
import { useI18n, type TKey } from '../i18n'

type Filter = 'all' | NotificationType

const filters: { value: Filter; label: TKey }[] = [
  { value: 'all', label: 'common.all' },
  { value: 'match', label: 'notifications.filter.match' },
  { value: 'saved-search', label: 'notifications.filter.saved-search' },
  { value: 'message', label: 'notifications.filter.message' },
  { value: 'status', label: 'notifications.filter.status' },
]

const typeStyle: Record<NotificationType, { Icon: LucideIcon; tone: string }> = {
  match: { Icon: Sparkles, tone: 'bg-emerald-50 text-emerald-700' },
  'saved-search': { Icon: Search, tone: 'bg-primary-soft text-primary-dark' },
  status: { Icon: Clock, tone: 'bg-amber-50 text-amber-800' },
  message: { Icon: MessageCircle, tone: 'bg-indigo-50 text-indigo-700' },
}

function NotificationRow({ n: raw, onOpen }: { n: AppNotification; onOpen: () => void }) {
  const { t, notif, item: tItem, ago } = useI18n()
  const n = notif(raw)
  const { items } = useItems()
  const found = n.itemId ? items.find((i) => i.id === n.itemId) : undefined
  const item = found && tItem(found)
  const { Icon, tone } = typeStyle[n.type]

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`relative flex w-full items-start gap-3 rounded-2xl p-3 text-left ring-1 ring-black/5 transition active:scale-[0.99] ${
        n.read ? 'bg-white' : 'bg-primary-soft/60'
      }`}
    >
      {item ? (
        <span className="relative shrink-0">
          <ItemThumb item={item} className="h-11 w-11 rounded-xl" emojiSize="text-xl" />
          <span
            className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white ${tone}`}
            aria-hidden
          >
            <Icon size={11} strokeWidth={2.5} />
          </span>
        </span>
      ) : (
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`} aria-hidden>
          <Icon size={20} />
        </span>
      )}
      <span className="min-w-0 flex-1 space-y-0.5 pr-3">
        <span className="line-clamp-2 block text-sm font-semibold">{n.title}</span>
        <span className="line-clamp-2 block text-xs text-muted">{n.body}</span>
        <span className="block pt-0.5 text-[11px] text-muted">{ago(n.createdAt)}</span>
      </span>
      {!n.read && (
        <>
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" aria-hidden />
          <span className="sr-only">{t('notifications.unreadSr')}</span>
        </>
      )}
    </button>
  )
}

export function Notifications() {
  const { t } = useI18n()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const back = useBack('/')
  const [toast, setToast] = useState<number | null>(null)

  const param = params.get('filter')
  const filter = (filters.some((f) => f.value === param) ? param : 'all') as Filter
  const counts = (v: Filter) => (v === 'all' ? notifications.length : notifications.filter((n) => n.type === v).length)
  const visible = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter)
  const { today, earlier } = groupNotifications(visible)

  const open = (n: AppNotification) => {
    markRead(n.id)
    navigate(n.to)
  }

  const groups = [
    { label: t('notifications.today'), list: today },
    { label: t('notifications.earlier'), list: earlier },
  ]

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={back}
            aria-label={t('common.back')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="flex-1 text-lg font-bold">{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => {
                markAllRead()
                setToast(Date.now())
              }}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-primary"
            >
              {t('notifications.markAll')}
            </button>
          )}
        </div>
        <p className="text-sm text-muted">{unreadCount > 0 ? t('notifications.unreadCount', { n: unreadCount }) : t('notifications.caughtUp')}</p>
      </header>

      <div role="group" aria-label={t('notifications.filterAria')} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {filters.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={active}
              onClick={() => setParams(f.value === 'all' ? {} : { filter: f.value }, { replace: true })}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 transition ${
                active ? 'bg-primary text-white ring-primary' : 'bg-white ring-black/5'
              }`}
            >
              {t(f.label)}
              <span
                className={`min-w-5 rounded-full px-1.5 text-center text-[11px] tabular-nums ${
                  active ? 'bg-white/25 text-white' : 'bg-surface text-navy'
                }`}
              >
                {counts(f.value)}
              </span>
            </button>
          )
        })}
      </div>

      {today.length + earlier.length > 0 ? (
        groups.map(
          (g) =>
            g.list.length > 0 && (
              <section key={g.label} className="space-y-2">
                <h2 className="text-xs font-semibold text-muted">{g.label}</h2>
                <div className="space-y-2">
                  {g.list.map((n) => (
                    <NotificationRow key={n.id} n={n} onOpen={() => open(n)} />
                  ))}
                </div>
              </section>
            ),
        )
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-black/5">
          <span className="text-5xl" aria-hidden>
            🔔
          </span>
          <p className="mt-1 font-semibold">{t('notifications.empty.title')}</p>
          <p className="max-w-64 text-sm leading-relaxed text-muted">{t(`notifications.empty.${filter}` as TKey)}</p>
        </div>
      )}

      {toast && <Toast key={toast} message={t('notifications.toast')} onDone={() => setToast(null)} />}
    </div>
  )
}
