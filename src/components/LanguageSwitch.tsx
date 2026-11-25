import { useI18n, type Lang } from '../i18n'

const options: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'ja', label: '日本語' },
]

// Segmented pill to switch the app language.
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t('common.language')} className="inline-flex rounded-full bg-white p-0.5 ring-1 ring-black/5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={lang === o.value}
          aria-label={o.value === 'en' ? t('common.english') : t('common.japanese')}
          onClick={() => setLang(o.value)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            lang === o.value ? 'bg-primary text-white' : 'text-muted'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
