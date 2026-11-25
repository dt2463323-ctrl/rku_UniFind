import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export function Placeholder({ title }: { title: string }) {
  const { t } = useI18n()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="text-5xl">🚧</span>
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-sm text-muted">{t('common.comingSoon')}</p>
      <Link to="/" className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
        {t('common.backHome')}
      </Link>
    </div>
  )
}
