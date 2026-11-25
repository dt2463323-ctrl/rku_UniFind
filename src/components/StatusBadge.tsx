import type { ItemStatus } from '../data/types'
import { useI18n } from '../i18n'

const styles: Record<ItemStatus, string> = {
  found: 'bg-primary-soft text-primary-dark',
  lost: 'bg-orange-100 text-orange-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  const { t } = useI18n()
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {t(`status.${status}`)}
    </span>
  )
}
