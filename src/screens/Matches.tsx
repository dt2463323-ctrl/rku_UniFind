import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ItemRow } from "../components/ItemRow";
import { MatchCard } from "../components/MatchCard";
import { useItems } from "../data/itemsContext";
import { findMatches } from "../data/matching";
import { useBack } from "../hooks/useBack";
import { useI18n } from "../i18n";

export function Matches() {
  const { id } = useParams();
  const { t, item: localize } = useI18n();
  const { items } = useItems();
  const back = useBack(`/items/${id}`);
  const item = items.find((i) => i.id === id);
  const matches = item ? findMatches(item, items) : [];
  const lost = item?.status === "lost";

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <header className="flex items-center gap-3">
        <button
          onClick={back}
          aria-label={t("matches.back")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold">{t("matches.title")}</h1>
      </header>

      {item && (
        <>
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-100 via-primary-soft to-sky-100 p-5">
            <Sparkles size={22} className="text-primary" />
            <h2 className="mt-2 max-w-[80%] text-2xl font-extrabold leading-tight text-balance">
              {matches.length === 0
                ? t("matches.hero.none")
                : lost
                  ? t("matches.hero.lost")
                  : t("matches.hero.found")}
            </h2>
            <p className="mt-1.5 max-w-[85%] text-sm leading-relaxed text-primary-dark">
              {t("matches.hero.body")}
            </p>
            <span className="absolute bottom-3 right-4 text-5xl" aria-hidden>
              🐱
            </span>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-muted">
              {lost ? t("matches.source.lost") : t("matches.source.found")}
            </h3>
            <ItemRow item={localize(item)} />
          </section>

          <section className="space-y-2">
            {matches.length > 0 && (
              <h3 className="text-xs font-semibold text-muted">
                {t(
                  `matches.count.${lost ? "lost" : "found"}${matches.length === 1 ? "One" : "Many"}` as const,
                  { count: matches.length },
                )}
              </h3>
            )}
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map((m) => (
                  <MatchCard key={m.item.id} match={m} showReasons />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-5 text-center ring-1 ring-black/5">
                <p className="text-sm leading-relaxed text-muted">
                  {t(lost ? "matches.empty.lost" : "matches.empty.found")}
                </p>
                <Link
                  to="/search"
                  className="mt-3 inline-block text-sm font-semibold text-primary"
                >
                  {t("matches.browseAll")}
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
