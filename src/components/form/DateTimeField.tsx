import { Calendar, Clock } from "lucide-react";
import { useI18n } from "../../i18n";
import { inputClass } from "./Field";

interface Props {
  kind: "date" | "time";
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  max?: string;
  hasError?: boolean;
}

// Native picker underneath, text follows the app language.
export function DateTimeField({
  kind,
  value,
  onChange,
  ariaLabel,
  max,
  hasError,
}: Props) {
  const { lang, t } = useI18n();

  let text = value;
  if (value && kind === "date") {
    text = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: lang === "ja" ? "long" : "short",
      day: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  }
  const Icon = kind === "date" ? Calendar : Clock;

  return (
    <div className="relative">
      <div
        className={`${inputClass(hasError, !value)} flex min-h-[2.75rem] items-center pr-9`}
      >
        {text || t(kind === "date" ? "report.datePlaceholder" : "report.timePlaceholder")}
        <Icon
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
      <input
        type={kind}
        lang={lang}
        aria-label={ariaLabel}
        value={value}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker?.();
          } catch {
            /* ignore */
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
