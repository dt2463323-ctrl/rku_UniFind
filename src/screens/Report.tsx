import { Building2, ChevronDown, Hand, Loader2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DateTimeField } from "../components/form/DateTimeField";
import { Field, inputClass } from "../components/form/Field";
import { PhotoPicker } from "../components/form/PhotoPicker";
import {
  draftToItem,
  itemToDraft,
  validateReport,
  type ReportDraft,
  type ReportErrors,
} from "../data/helpers";
import { categories, locations } from "../data/items";
import { useItems } from "../data/itemsContext";
import { useI18n, type TKey } from "../i18n";
import type { Item } from "../data/types";
import { daysAgo } from "../utils/date";
import { ReportSuccess } from "./ReportSuccess";

type ReportType = ReportDraft["type"];

// Static class sets so Tailwind can see them.
const tones = {
  lost: {
    solid: "bg-primary shadow-primary/30",
    chip: "bg-primary text-white ring-primary",
  },
  found: {
    solid: "bg-indigo shadow-indigo/30",
    chip: "bg-indigo text-white ring-indigo",
  },
};

const handoverOptions: {
  value: ReportDraft["handover"];
  label: TKey;
  icon: typeof Hand;
}[] = [
  { value: "with-me", label: "report.handover.withMe", icon: Hand },
  { value: "office", label: "report.handover.office", icon: Building2 },
];

function emptyDraft(type: ReportType): ReportDraft {
  const now = new Date();
  return {
    type,
    name: "",
    category: "",
    location: "",
    date: daysAgo(0),
    time: now.toTimeString().slice(0, 5),
    description: "",
    contact: "",
    handover: "with-me",
  };
}

// Remount the form when switching between new and edit mode.
export function Report() {
  const [params] = useSearchParams();
  return <ReportForm key={params.get("edit") ?? "new"} />;
}

function ReportForm() {
  const { t, category: categoryLabel, location: locationLabel } = useI18n();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, addItem, updateItem } = useItems();
  const editing = items.find(
    (i) => i.id === params.get("edit") && i.mine && i.status !== "resolved",
  );
  const type: ReportType = editing
    ? (editing.status as ReportType)
    : params.get("type") === "found"
      ? "found"
      : "lost";

  const [draft, setDraft] = useState<ReportDraft>(() =>
    editing ? itemToDraft(editing) : emptyDraft(type),
  );
  const [errors, setErrors] = useState<ReportErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState<Item | null>(null);

  const tone = tones[type];
  const update = <K extends keyof ReportDraft>(
    key: K,
    value: ReportDraft[K],
  ) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key as keyof ReportErrors])
      setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const switchType = (next: ReportType) => {
    setParams({ type: next }, { replace: true });
    setDraft((d) => ({ ...d, type: next }));
    setErrors({});
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateReport({ ...draft, type }, t);
    setErrors(found);
    if (Object.keys(found).length) {
      document
        .getElementById(`field-${Object.keys(found)[0]}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    // Fake network delay for the loading state.
    setTimeout(() => {
      // Keep the post's own emoji unless the category changed.
      const emoji =
        editing && editing.category === draft.category
          ? editing.emoji
          : (categories.find((c) => c.name === draft.category)?.emoji ?? "📦");
      const item = draftToItem({ ...draft, type }, emoji);
      if (editing) {
        updateItem(editing.id, { ...item, id: editing.id });
        navigate(`/my-reports?tab=${type}`, {
          state: { toast: t("report.changesSaved") },
        });
        return;
      }
      addItem(item);
      setPosted(item);
      setSubmitting(false);
    }, 700);
  };

  if (posted) {
    return (
      <ReportSuccess
        item={posted}
        onAnother={() => {
          setPosted(null);
          setDraft(emptyDraft(type));
        }}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex min-h-full flex-col"
      style={
        {
          "--tone":
            type === "lost" ? "var(--color-primary)" : "var(--color-indigo)",
        } as React.CSSProperties
      }
    >
      <div className="space-y-5 px-5 pb-6 pt-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">
            {editing ? t("report.title.edit") : t("report.title.new")}
          </h1>
          <Link
            to={editing ? `/my-reports?tab=${type}` : "/"}
            aria-label={t("report.close")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-sm"
          >
            <X size={18} />
          </Link>
        </header>

        {/* Intent switch (type is fixed when editing) */}
        {!editing && (
          <div
            role="tablist"
            aria-label={t("report.typeLabel")}
            className="grid grid-cols-2 rounded-2xl bg-white p-1 ring-1 ring-black/5"
          >
            {(["lost", "found"] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={type === k}
                onClick={() => switchType(k)}
                className={`rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  type === k
                    ? `${tones[k].solid} text-white shadow-md`
                    : "text-muted"
                }`}
              >
                {t(k === "lost" ? "report.type.lost" : "report.type.found")}
              </button>
            ))}
          </div>
        )}

        <PhotoPicker
          value={draft.imageUrl}
          onChange={(url) => update("imageUrl", url)}
          tone={type}
        />

        <div
          className={`space-y-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5`}
        >
          <div id="field-name">
            <Field
              label={t("report.name.label")}
              htmlFor="name"
              error={errors.name}
            >
              <input
                id="name"
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={t(
                  type === "lost"
                    ? "report.name.placeholder.lost"
                    : "report.name.placeholder.found",
                )}
                maxLength={40}
                className={inputClass(!!errors.name)}
              />
            </Field>
          </div>

          <div id="field-category">
            <Field label={t("report.category.label")} error={errors.category}>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((c) => {
                  const active = draft.category === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => update("category", c.name)}
                      className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium ring-1 transition ${
                        active ? tone.chip : "bg-surface text-navy ring-black/5"
                      }`}
                    >
                      <span className="text-lg" aria-hidden>
                        {c.emoji}
                      </span>
                      {categoryLabel(c.name)}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </div>

        <div
          className={`space-y-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5`}
        >
          <div id="field-location">
            <Field
              label={t(
                type === "lost" ? "report.place.lost" : "report.place.found",
              )}
              htmlFor="location"
              error={errors.location}
            >
              <div className="relative">
                <select
                  id="location"
                  value={draft.location}
                  onChange={(e) => update("location", e.target.value)}
                  className={`${inputClass(!!errors.location, !draft.location)} appearance-none pr-9`}
                >
                  <option value="">{t("report.location.choose")}</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {locationLabel(l)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </Field>
          </div>

          <div id="field-date">
            <Field
              label={t(
                type === "lost" ? "report.when.lost" : "report.when.found",
              )}
              error={errors.date}
            >
              <div className="grid grid-cols-[1.4fr_1fr] gap-2">
                <DateTimeField
                  kind="date"
                  ariaLabel={t("report.dateAria")}
                  value={draft.date}
                  max={daysAgo(0)}
                  onChange={(v) => update("date", v)}
                  hasError={!!errors.date}
                />
                <DateTimeField
                  kind="time"
                  ariaLabel={t("report.timeAria")}
                  value={draft.time}
                  onChange={(v) => update("time", v)}
                />
              </div>
            </Field>
          </div>

          <Field
            label={t("report.description.label")}
            htmlFor="description"
            optional
            hint={t(
              type === "found"
                ? "report.description.hint.found"
                : "report.description.hint.lost",
            )}
          >
            <textarea
              id="description"
              rows={3}
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder={t(
                type === "lost"
                  ? "report.description.placeholder.lost"
                  : "report.description.placeholder.found",
              )}
              className={`${inputClass()} resize-none`}
            />
          </Field>

          {type === "lost" ? (
            <Field
              label={t("report.contact.label")}
              htmlFor="contact"
              optional
              hint={t("report.contact.hint")}
            >
              <input
                id="contact"
                value={draft.contact}
                onChange={(e) => update("contact", e.target.value)}
                placeholder={t("report.contact.placeholder")}
                className={inputClass()}
              />
            </Field>
          ) : (
            <Field label={t("report.handover.label")}>
              <div className="grid gap-2" role="radiogroup">
                {handoverOptions.map(({ value, label, icon: Icon }) => {
                  const active = draft.handover === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => update("handover", value)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium ring-1 transition ${
                        active
                          ? "bg-indigo-50 text-indigo ring-2 ring-indigo"
                          : "bg-surface text-navy ring-black/5"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {t(label)}
                      <span
                        className={`ml-auto h-4 w-4 shrink-0 rounded-full border-2 ${
                          active
                            ? "border-indigo bg-indigo shadow-[inset_0_0_0_2px_white]"
                            : "border-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
        </div>
      </div>

      {/* Sticky submit */}
      <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-surface via-surface to-surface/0 px-5 pb-4 pt-3">
        <button
          type="submit"
          disabled={submitting}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg transition active:scale-[0.99] disabled:opacity-80 ${tone.solid}`}
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting
            ? editing
              ? t("report.saving")
              : t("report.posting")
            : editing
              ? t("report.saveChanges")
              : t(
                  type === "lost"
                    ? "report.submit.lost"
                    : "report.submit.found",
                )}
        </button>
      </div>
    </form>
  );
}
