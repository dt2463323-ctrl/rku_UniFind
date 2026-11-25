import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Flag,
  Hand,
  MapPin,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ContactSheet } from "../components/item/ContactSheet";
import { FlagSheet } from "../components/item/FlagSheet";
import { ItemThumb } from "../components/ItemThumb";
import { MatchCard } from "../components/MatchCard";
import { StatusBadge } from "../components/StatusBadge";
import { categories } from "../data/items";
import { useBack } from "../hooks/useBack";
import { useItems } from "../data/itemsContext";
import { useI18n } from "../i18n";
import { findMatches } from "../data/matching";

function FactRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function ItemDetails() {
  const {
    t,
    item: localize,
    category: categoryLabel,
    location,
    date,
  } = useI18n();
  const { id } = useParams();
  const { items } = useItems();
  const back = useBack("/search");
  const [contactOpen, setContactOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);
  const [toast, setToast] = useState("");

  const raw = items.find((i) => i.id === id);

  if (!raw) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="text-5xl">🔍</span>
        <h1 className="text-xl font-bold">{t("item.gone.title")}</h1>
        <p className="text-sm text-muted">{t("item.gone.body")}</p>
        <Link
          to="/search"
          className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
        >
          {t("item.gone.browse")}
        </Link>
      </div>
    );
  }

  const item = localize(raw);
  const matches = findMatches(raw, items);
  const lost = item.status === "lost";
  const category = categories.find((c) => c.name === raw.category);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: item.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setToast(t("item.linkCopied"));
        setTimeout(() => setToast(""), 1800);
      }
    } catch {
      // user cancelled share
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      {/* Photo */}
      <div className="relative">
        <ItemThumb
          item={item}
          className="h-64 w-full pb-4"
          emojiSize="text-9xl drop-shadow-lg"
          tile="bg-gradient-to-br from-indigo-100 via-primary-soft to-sky-100"
        />
        <div className="absolute inset-x-4 top-4 flex justify-between">
          <button
            onClick={back}
            aria-label={t("item.back")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-md"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={share}
            aria-label={t("item.share")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-md"
          >
            <Share2 size={17} />
          </button>
        </div>
        {toast && (
          <p
            role="status"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-navy px-3 py-1.5 text-xs font-medium text-white"
          >
            {toast}
          </p>
        )}
      </div>

      {/* Sheet with facts */}
      <div className="relative -mt-6 flex-1 space-y-6 rounded-t-3xl bg-surface px-5 pb-6 pt-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-navy ring-1 ring-black/5">
              <span aria-hidden>{category?.emoji}</span>
              {categoryLabel(item.category)}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight text-balance">
            {item.name}
          </h1>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <FactRow
            icon={<MapPin size={18} />}
            label={t(lost ? "item.lastSeenAt" : "item.foundAt")}
            value={location(item.location)}
          />
          <FactRow
            icon={<CalendarDays size={18} />}
            label={t(lost ? "item.lostOn" : "item.foundOn")}
            value={`${date(item.date)}${item.time ? `, ${item.time}` : ""}`}
          />
          {!lost && item.handover && (
            <FactRow
              icon={
                item.handover === "office" ? (
                  <Building2 size={18} />
                ) : (
                  <Hand size={18} />
                )
              }
              label={t("item.nowLabel")}
              value={t(
                item.handover === "office"
                  ? "item.now.office"
                  : "item.now.finder",
              )}
            />
          )}
        </div>

        <section className="space-y-3">
          <h2 className="font-semibold">{t("item.description")}</h2>
          <p className="text-sm leading-relaxed text-navy/85">
            {item.description || t("item.noDescription")}
          </p>
          <p className="flex gap-2.5 rounded-xl bg-primary-soft p-3 text-xs leading-relaxed text-primary-dark">
            <ShieldCheck size={16} className="mt-px shrink-0" />
            {t(lost ? "item.privacy.lost" : "item.privacy.found")}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("item.matches.title")}</h2>
            {matches.length > 0 && (
              <Link
                to={`/items/${item.id}/matches`}
                className="flex items-center gap-1 text-xs font-semibold text-primary"
              >
                {matches.length > 1
                  ? t("item.matches.seeAll", { count: matches.length })
                  : t("item.matches.why")}{" "}
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.slice(0, 2).map((m) => (
                <MatchCard key={m.item.id} match={m} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-muted ring-1 ring-black/5">
              {t(lost ? "item.matches.none.lost" : "item.matches.none.found")}
            </p>
          )}
        </section>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 border-t border-black/5 bg-surface px-5 pb-4 pt-3">
        {item.mine ? (
          <Link
            to="/my-reports"
            className="flex w-full items-center justify-center rounded-2xl bg-white py-3.5 text-sm font-semibold text-navy shadow-lg ring-1 ring-black/5"
          >
            {t("item.mine")}
          </Link>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setContactOpen(true)}
              className="flex-1 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 active:scale-[0.99]"
            >
              {t(lost ? "item.contact.lost" : "item.contact.found")}
            </button>
            <button
              onClick={() => setFlagOpen(true)}
              aria-label={t("item.flag.aria")}
              className="flex w-14 items-center justify-center rounded-2xl bg-white text-navy shadow-lg ring-1 ring-black/5"
            >
              <Flag size={18} />
            </button>
          </div>
        )}
      </div>

      <ContactSheet
        key={item.id}
        item={raw}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
      <FlagSheet open={flagOpen} onClose={() => setFlagOpen(false)} />
    </div>
  );
}
