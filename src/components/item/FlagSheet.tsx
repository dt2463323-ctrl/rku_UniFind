import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useI18n, type TKey } from "../../i18n";
import { Sheet } from "../Sheet";

const reasons: TKey[] = [
  "item.flag.reason.false",
  "item.flag.reason.spam",
  "item.flag.reason.inappropriate",
  "item.flag.reason.other",
];

// "Report" button on Item Details: flag a post for review.
export function FlagSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);

  const close = () => {
    onClose();
    setTimeout(() => {
      setReason("");
      setSent(false);
    }, 200);
  };

  return (
    <Sheet
      open={open}
      title={sent ? t("item.flag.thanks") : t("item.flag.title")}
      onClose={close}
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <CheckCircle2 size={48} className="mx-auto text-success" />
          <p className="text-sm leading-relaxed text-muted">
            {t("item.flag.thanksBody")}
          </p>
          <button
            type="button"
            onClick={close}
            className="w-full rounded-2xl py-3.5 text-sm font-semibold text-navy ring-1 ring-black/10"
          >
            {t("item.flag.done")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            role="radiogroup"
            aria-label={t("item.flag.reasonAria")}
            className="grid gap-2"
          >
            {reasons.map((r) => {
              const active = reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setReason(r)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium ring-1 transition ${
                    active
                      ? "bg-red-50 text-red-700 ring-2 ring-red-500"
                      : "bg-surface text-navy ring-black/5"
                  }`}
                >
                  {t(r)}
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      active
                        ? "border-red-500 bg-red-500 shadow-[inset_0_0_0_2px_white]"
                        : "border-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!reason}
            onClick={() => setSent(true)}
            className="w-full rounded-2xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 active:scale-[0.99] disabled:bg-slate-300 disabled:shadow-none"
          >
            {t("item.flag.send")}
          </button>
        </div>
      )}
    </Sheet>
  );
}
