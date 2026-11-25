import { useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { PhoneFrame } from './components/PhoneFrame'
import { HowToPanel, IntroPanel } from './components/SidePanels'
import { I18nProvider, useI18n } from './i18n'
import { ItemsProvider } from './data/ItemsProvider'
import { NotificationsProvider } from './data/NotificationsProvider'
import { Home } from './screens/Home'
import { ItemDetails } from './screens/ItemDetails'
import { Matches } from './screens/Matches'
import { MyReports } from './screens/MyReports'
import { Notifications } from './screens/Notifications'
import { Placeholder } from './screens/Placeholder'
import { Profile } from './screens/Profile'
import { Report } from './screens/Report'
import { Search } from './screens/Search'

function NotFound() {
  const { t } = useI18n()
  return <Placeholder title={t('common.notFound')} />
}

function AppLayout() {
  // Reset scroll when the route changes (main is the scroll container).
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh items-center justify-center gap-12 md:p-8">
      <IntroPanel />
      <PhoneFrame>
        <main ref={mainRef} className="no-scrollbar flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </PhoneFrame>
      <HowToPanel />
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
    <ItemsProvider>
    <NotificationsProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="report" element={<Report />} />
          <Route path="report/lost" element={<Navigate to="/report?type=lost" replace />} />
          <Route path="report/found" element={<Navigate to="/report?type=found" replace />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="items/:id" element={<ItemDetails />} />
          <Route path="items/:id/matches" element={<Matches />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </NotificationsProvider>
    </ItemsProvider>
    </I18nProvider>
  )
}
