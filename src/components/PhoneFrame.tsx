import { useEffect, type ReactNode } from 'react'

// iPhone-like frame on desktop, full screen on phones.
export function PhoneFrame({ children }: { children: ReactNode }) {
  // Lock page scroll while the pointer is over the frame (desktop only)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const root = document.documentElement
    const lock = () => {
      if (mq.matches) root.style.overflow = 'hidden'
    }
    const unlock = () => {
      root.style.overflow = ''
    }
    const el = document.getElementById('phone-frame')
    el?.addEventListener('mouseenter', lock)
    el?.addEventListener('mouseleave', unlock)
    return () => {
      el?.removeEventListener('mouseenter', lock)
      el?.removeEventListener('mouseleave', unlock)
      unlock()
    }
  }, [])

  return (
    <div
      id="phone-frame"
      className="phone-frame relative flex h-dvh w-full flex-col overflow-hidden bg-surface md:h-[844px] md:w-[390px] md:rounded-[48px] md:border-[10px] md:border-navy md:shadow-2xl"
    >
      <div className="hidden items-center justify-between px-7 pt-3 text-xs font-semibold md:flex">
        <span>9:41</span>
        <span className="tracking-widest">●●● ▰</span>
      </div>
      {children}
      {/* Portal target for bottom sheets, kept inside the phone frame */}
      <div id="overlay-root" />
    </div>
  )
}
