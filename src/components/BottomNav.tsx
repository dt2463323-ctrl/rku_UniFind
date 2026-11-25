import { ClipboardList, Home, Plus, Search, User, type LucideIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useI18n, type TKey } from '../i18n'

const tabs: { to: string; label: TKey; icon: LucideIcon; primary?: boolean }[] = [
  { to: '/', label: 'nav.home', icon: Home },
  { to: '/search', label: 'nav.search', icon: Search },
  { to: '/report', label: 'nav.report', icon: Plus, primary: true },
  { to: '/my-reports', label: 'nav.myReports', icon: ClipboardList },
  { to: '/profile', label: 'nav.profile', icon: User },
]

export function BottomNav() {
  const { t } = useI18n()
  // Editing a post belongs to My Reports, not the Report tab.
  const { pathname, search } = useLocation()
  const editing = pathname === '/report' && new URLSearchParams(search).has('edit')

  return (
    <nav className="border-t border-slate-100 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur">
      <ul className="flex items-end justify-between">
        {tabs.map(({ to, label, icon: Icon, primary }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => {
                const active = editing ? to === '/my-reports' : isActive
                return `flex flex-col items-center gap-1 text-[10px] font-medium ${
                  active ? 'text-primary' : 'text-slate-400'
                }`
              }}
            >
              {primary ? (
                <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40">
                  <Icon size={24} strokeWidth={2.5} />
                </span>
              ) : (
                <Icon size={22} />
              )}
              {t(label)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
