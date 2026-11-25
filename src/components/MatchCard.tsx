import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n, type TKey } from "../i18n";
import { matchLevel, type Match } from "../data/matching";
import { ItemThumb } from "./ItemThumb";
import { StatusBadge } from "./StatusBadge";

const levels: Record<
  "strong" | "good" | "possible",
  { label: TKey; text: string; bar: string; pill: string }
> = {
  strong: {
    label: "matches.level.strong",
    text: "text-emerald-700",
    bar: "bg-success",
    pill: "bg-emerald-50",
  },
  good: {
    label: "matches.level.good",
    text: "text-primary-dark",
    bar: "bg-primary",
    pill: "bg-primary-soft",
  },
  possible: {
    label: "matches.level.possible",
    text: "text-muted",
    bar: "bg-slate-400",
    pill: "bg-slate-100",
  },
};

export function SimilarityMeter({ score }: { score: number }) {
  const { t } = useI18n();
  const level = levels[matchLevel(score)];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${level.text}`}>{t(level.label)}</span>
        <span
          className={`rounded-full px-2 py-0.5 font-bold tabular-nums ${level.pill} ${level.text}`}
        >
          {score}%
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("matches.similarity")}
      >
        <div
          className={`h-full origin-left rounded-full motion-safe:animate-[meter_700ms_cubic-bezier(0.16,1,0.3,1)] ${level.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function MatchCard({
  match,
  showReasons,
}: {
  match: Match;
  showReasons?: boolean;
}) {
  const { t, item: localize, location, date } = useI18n();
  const { score, reasons } = match;
  const item = localize(match.item);
  return (
    <Link
      to={`/items/${item.id}`}
      className="block space-y-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <ItemThumb
          item={item}
          className="h-14 w-14 shrink-0 rounded-xl"
          emojiSize="text-2xl"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 text-sm font-semibold leading-snug">
              {item.name}
            </p>
            <StatusBadge status={item.status} />
          </div>
          <p className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={12} className="shrink-0 text-red-500" />
            <span className="truncate">
              {location(item.location)} · {date(item.date)}
            </span>
          </p>
        </div>
      </div>
      <SimilarityMeter score={score} />
      {showReasons && reasons.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {reasons.map((r) => (
            <li
              key={r.key}
              className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-navy"
            >
              {t(r.key, r.params)}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
