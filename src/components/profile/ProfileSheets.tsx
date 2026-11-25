import { ChevronDown, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useItems } from '../../data/itemsContext'
import { faqs, savedItemIds, savedSearches } from '../../data/profile'
import { useI18n, type TKey } from '../../i18n'
import { ItemRow } from '../ItemRow'
import { Sheet } from '../Sheet'

interface SheetProps {
  open: boolean
  onClose: () => void
}

export function SavedSheet({ open, onClose }: SheetProps) {
  const { t, item: tItem } = useI18n()
  const { items } = useItems()
  const saved = items.filter((i) => savedItemIds.includes(i.id)).map(tItem)
  return (
    <Sheet open={open} title={t('profile.savedSheet.title')} onClose={onClose}>
      <div className="space-y-5">
        <section className="space-y-2">
          <h3 className="text-xs font-semibold text-muted">{t('profile.savedSheet.searches')}</h3>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map((s) => (
              <Link
                key={s}
                to={`/search?q=${encodeURIComponent(s)}`}
                onClick={onClose}
                className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-dark"
              >
                “{t(`profile.search.${s}` as TKey)}”
              </Link>
            ))}
          </div>
        </section>
        <section className="space-y-2">
          <h3 className="text-xs font-semibold text-muted">{t('profile.savedSheet.items')}</h3>
          {saved.length > 0 ? (
            <div className="space-y-2" onClick={onClose}>
              {saved.map((i) => (
                <ItemRow key={i.id} item={i} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{t('profile.savedSheet.none')}</p>
          )}
        </section>
      </div>
    </Sheet>
  )
}

const settingsList = [
  { key: 'push', label: 'profile.setting.push', hint: 'profile.setting.pushHint' },
  { key: 'matches', label: 'profile.setting.matches', hint: 'profile.setting.matchesHint' },
  { key: 'contact', label: 'profile.setting.contact', hint: 'profile.setting.contactHint' },
] as const

type SettingKey = (typeof settingsList)[number]['key']

export function SettingsSheet({ open, onClose }: SheetProps) {
  const { t } = useI18n()
  const [values, setValues] = useState<Record<SettingKey, boolean>>({ push: true, matches: true, contact: false })
  return (
    <Sheet open={open} title={t('profile.settings')} onClose={onClose}>
      <ul className="divide-y divide-black/5 rounded-2xl ring-1 ring-black/5">
        {settingsList.map((s) => {
          const on = values[s.key]
          return (
            <li key={s.key}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{t(s.label)}</span>
                  <span className="block text-xs text-muted">{t(s.hint)}</span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  checked={on}
                  onChange={() => setValues((v) => ({ ...v, [s.key]: !v[s.key] }))}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
                    on ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      on ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}

export function HelpSheet({ open, onClose }: SheetProps) {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <Sheet open={open} title={t('profile.helpSheet.title')} onClose={onClose}>
      <div className="space-y-4">
        <ul className="divide-y divide-black/5 rounded-2xl ring-1 ring-black/5">
          {faqs.map((f, i) => {
            const expanded = openIndex === i
            return (
              <li key={f.q}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpenIndex(expanded ? null : i)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold"
                >
                  <span className="flex-1">{t(f.q)}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded && <p className="px-4 pb-3 text-sm leading-relaxed text-muted">{t(f.a)}</p>}
              </li>
            )
          })}
        </ul>
        <p className="flex gap-2.5 rounded-xl bg-primary-soft p-3 text-sm leading-relaxed text-primary-dark">
          <Mail size={18} className="mt-0.5 shrink-0" />
          {t('profile.helpSheet.stuck')}
        </p>
      </div>
    </Sheet>
  )
}
