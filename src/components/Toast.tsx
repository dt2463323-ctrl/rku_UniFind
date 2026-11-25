import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  message: string
  actionLabel?: string
  onAction?: () => void
  onDone: () => void
  duration?: number
}

// Short feedback bar above the bottom nav, rendered inside the phone frame.
export function Toast({ message, actionLabel, onAction, onDone, duration = 5000 }: Props) {
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })
  useEffect(() => {
    const t = setTimeout(() => doneRef.current(), duration)
    return () => clearTimeout(t)
  }, [message, duration])

  const root = document.getElementById('overlay-root')
  if (!root) return null

  return createPortal(
    <div
      role="status"
      className="pointer-events-auto absolute inset-x-4 bottom-24 z-40 flex items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-sm text-white shadow-[0_8px_24px_rgba(29,39,66,0.3)] motion-safe:animate-[toast-in_260ms_cubic-bezier(0.16,1,0.3,1)]"
    >
      <span className="flex-1">{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={() => {
            onAction()
            doneRef.current()
          }}
          className="rounded-lg px-2 py-1 font-semibold text-sky-300"
        >
          {actionLabel}
        </button>
      )}
    </div>,
    root,
  )
}
