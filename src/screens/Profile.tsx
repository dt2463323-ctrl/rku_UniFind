import { Bell, Bookmark, ClipboardList, HelpCircle, Languages, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { CountBadge, MenuRow } from '../components/profile/MenuRow'
import { HelpSheet, SavedSheet, SettingsSheet } from '../components/profile/ProfileSheets'
import { LanguageSwitch } from '../components/LanguageSwitch'
import { Toast } from '../components/Toast'
import { useItems } from '../data/itemsContext'
import { useNotifications } from '../data/notificationsContext'
import { savedItemIds, savedSearches, student } from '../data/profile'
import { useI18n } from '../i18n'

type SheetName = 'saved' | 'settings' | 'help' | null

export function Profile() {
  const { t } = useI18n()
  const { items } = useItems()
  const { unreadCount } = useNotifications()
  const [sheet, setSheet] = useState<SheetName>(null)
  const [toast, setToast] = useState<number | null>(null)

  const mine = items.filter((i) => i.mine)
  const open = mine.filter((i) => i.status !== 'resolved').length
  const returned = mine.filter((i) => i.status === 'resolved').length
  const close = () => setSheet(null)

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <h1 className="text-2xl font-extrabold">{t('profile.title')}</h1>

      {/* Student card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-100 via-primary-soft to-sky-100 p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-100 text-4xl shadow-sm ring-4 ring-white">
            🐱
          </span>
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-tight">{student.name}</p>
            <p className="text-sm text-primary-dark">{t('profile.faculty')}</p>
            <p className="mt-1 text-xs text-navy/75 tabular-nums">{t('profile.studentId', { id: student.studentId })}</p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-white/70 px-3 py-2 text-sm text-navy">
          {returned > 0
            ? t(returned === 1 ? 'profile.helpedOne' : 'profile.helpedMany', { n: returned })
            : t('profile.helpedNone')}
        </p>
      </section>

      {/* Menu */}
      <nav
        aria-label={t('profile.menuAria')}
        className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
      >
        <MenuRow
          icon={ClipboardList}
          tile="bg-primary-soft text-primary-dark"
          label={t('profile.myReports')}
          hint={t('profile.myReportsHint', { open, resolved: returned })}
          to="/my-reports"
        />
        <MenuRow
          icon={Bookmark}
          tile="bg-amber-50 text-amber-800"
          label={t('profile.saved')}
          hint={t('profile.savedHint', { items: savedItemIds.length, searches: savedSearches.length })}
          onClick={() => setSheet('saved')}
        />
        <MenuRow
          icon={Bell}
          tile="bg-indigo-50 text-indigo-700"
          label={t('profile.notifications')}
          hint={unreadCount ? t('profile.unread', { n: unreadCount }) : t('profile.allCaughtUp')}
          badge={<CountBadge count={unreadCount} tone="bg-accent text-navy" />}
          to="/notifications"
        />
      </nav>

      <nav
        aria-label={t('profile.appAria')}
        className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Languages size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{t('profile.language')}</span>
            <span className="block truncate text-xs text-muted">{t('profile.languageHint')}</span>
          </span>
          <LanguageSwitch />
        </div>
        <MenuRow
          icon={Settings}
          tile="bg-slate-100 text-navy"
          label={t('profile.settings')}
          hint={t('profile.settingsHint')}
          onClick={() => setSheet('settings')}
        />
        <MenuRow
          icon={HelpCircle}
          tile="bg-emerald-50 text-emerald-700"
          label={t('profile.help')}
          hint={t('profile.helpHint')}
          onClick={() => setSheet('help')}
        />
      </nav>

      <button
        type="button"
        onClick={() => setToast(Date.now())}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-red-600 ring-1 ring-red-200"
      >
        <LogOut size={16} /> {t('profile.logout')}
      </button>
      <p className="text-center text-xs text-muted">{t('profile.footer')}</p>

      <SavedSheet open={sheet === 'saved'} onClose={close} />
      <SettingsSheet open={sheet === 'settings'} onClose={close} />
      <HelpSheet open={sheet === 'help'} onClose={close} />

      {toast && <Toast key={toast} message={t('profile.logoutToast')} onDone={() => setToast(null)} />}
    </div>
  )
}
