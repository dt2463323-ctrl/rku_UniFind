import { useI18n } from '../i18n'
import { Logo } from './Logo'

export function IntroPanel() {
  const { t } = useI18n()
  const features = ([1, 2, 3, 4] as const).map((n) => t(`panels.feature${n}`))
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold tracking-wide text-primary">
        {t('panels.badge')}
      </span>
      <Logo className="mt-5 block text-5xl" />
      <p className="mt-5 font-semibold">{t('panels.slogan')}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t('panels.about')}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{t('panels.explore')}</p>
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="font-semibold">{t('panels.featuresTitle')}</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export function HowToPanel() {
  const { t } = useI18n()
  const steps = ([1, 2, 3, 4] as const).map((n) => t(`panels.step${n}`))
  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <p className="font-semibold">{t('panels.howTitle')}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t('panels.howBody')}</p>
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="font-semibold">{t('panels.flowTitle')}</p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
