import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

// Bottom sheet rendered inside the phone frame (#overlay-root).
export function Sheet({ open, title, onClose, children }: Props) {
  const { t } = useI18n()
  const panelRef = useRef<HTMLDivElement>(null)
  // Latest onClose without re-running the effect (which would steal focus on every render).
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus({ preventScroll: true })
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const root = document.getElementById('overlay-root')
  if (!open || !root) return null

  return createPortal(
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label={t('common.close')}
        onClick={onClose}
        className="absolute inset-0 bg-navy/40 motion-safe:animate-[fade-in_200ms_ease-out]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative max-h-[85%] overflow-y-auto rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-[0_-8px_30px_rgba(29,39,66,0.15)] outline-none motion-safe:animate-[sheet-up_320ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-navy"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    root,
  )
}
