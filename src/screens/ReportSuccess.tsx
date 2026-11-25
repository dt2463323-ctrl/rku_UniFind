import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { ItemRow } from "../components/ItemRow";
import type { Item } from "../data/types";
import { useI18n } from "../i18n";

export function ReportSuccess({
  item,
  onAnother,
}: {
  item: Item;
  onAnother: () => void;
}) {
  const { t, item: localize } = useI18n();
  const lost = item.status === "lost";
  return (
    <div className="flex min-h-full flex-col px-5 pb-6 pt-10">
      <div className="flex flex-col items-center text-center">
        <span
          className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg motion-safe:animate-[pop_400ms_cubic-bezier(0.16,1,0.3,1)] ${
            lost ? "bg-primary shadow-primary/30" : "bg-indigo shadow-indigo/30"
          }`}
        >
          <Check size={40} strokeWidth={3} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold">
          {t(lost ? "report.success.lost.title" : "report.success.found.title")}
        </h1>
        <p className="mt-2 max-w-72 text-sm leading-relaxed text-muted">
          {t(lost ? "report.success.lost.body" : "report.success.found.body")}
        </p>
      </div>

      <div className="mt-8">
        <ItemRow item={localize(item)} />
      </div>

      <div className="mt-auto space-y-2 pt-8">
        <Link
          to="/search?status=found"
          className={`flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg ${
            lost ? "bg-primary shadow-primary/30" : "bg-indigo shadow-indigo/30"
          }`}
        >
          {t(
            lost ? "report.success.lost.browse" : "report.success.found.browse",
          )}
        </Link>
        <button
          type="button"
          onClick={onAnother}
          className="w-full rounded-2xl py-3.5 text-sm font-semibold text-navy ring-1 ring-black/10"
        >
          {t("report.success.another")}
        </button>
      </div>
    </div>
  );
}
