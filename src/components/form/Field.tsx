import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "../../i18n";

interface Props {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  optional,
  hint,
  error,
  children,
}: Props) {
  const { t } = useI18n();
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between text-sm font-semibold"
      >
        {label}
        {optional && (
          <span className="text-xs font-normal text-muted">
            {t("report.optional")}
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

// Shared look for text inputs, selects and textareas.
export function inputClass(hasError?: boolean, empty?: boolean) {
  return `w-full rounded-xl bg-surface px-3.5 py-3 text-sm ${empty ? "text-muted" : "text-navy"} outline-none ring-1 transition placeholder:text-muted focus:bg-white focus:ring-2 ${
    hasError
      ? "ring-red-400 focus:ring-red-400"
      : "ring-black/5 focus:ring-[var(--tone)]"
  }`;
}
