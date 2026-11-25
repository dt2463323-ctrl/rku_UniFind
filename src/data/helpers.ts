import type { I18n } from "../i18n/I18nContext";
import { daysSince } from "../utils/date";
import type { AppNotification, Category, Handover, Item } from "./types";

export type DateRange = "any" | "today" | "week" | "month";
export type StatusFilter = "all" | "lost" | "found";
export type SortOrder = "newest" | "oldest";

export interface ItemFilters {
  q: string;
  category: string;
  location: string;
  date: DateRange;
  status: StatusFilter;
  sort: SortOrder;
}

const maxDays: Record<DateRange, number> = {
  any: Infinity,
  today: 0,
  week: 7,
  month: 30,
};

export function filterItems(items: Item[], f: ItemFilters): Item[] {
  const q = f.q.trim().toLowerCase();
  return items
    .filter((i) => i.status !== "resolved")
    .filter(
      (i) =>
        !q ||
        `${i.name} ${i.description} ${i.location}`.toLowerCase().includes(q),
    )
    .filter((i) => !f.category || i.category === f.category)
    .filter((i) => !f.location || i.location === f.location)
    .filter((i) => f.status === "all" || i.status === f.status)
    .filter((i) => daysSince(i.date) <= maxDays[f.date])
    .sort((a, b) =>
      f.sort === "newest"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
}

export interface ReportDraft {
  type: "lost" | "found";
  imageUrl?: string;
  name: string;
  category: Category | "";
  location: string;
  date: string;
  time: string;
  description: string;
  contact: string;
  handover: Handover;
}

export type ReportErrors = Partial<
  Record<"name" | "category" | "location" | "date", string>
>;

export function validateReport(d: ReportDraft, t: I18n["t"]): ReportErrors {
  const errors: ReportErrors = {};
  if (!d.name.trim()) errors.name = t("report.error.name");
  if (!d.category) errors.category = t("report.error.category");
  if (!d.location)
    errors.location = t(
      d.type === "lost"
        ? "report.error.location.lost"
        : "report.error.location.found",
    );
  if (!d.date) errors.date = t("report.error.date");
  return errors;
}

export function draftToItem(d: ReportDraft, emoji: string): Item {
  return {
    id: `report-${Date.now()}`,
    name: d.name.trim(),
    emoji,
    category: d.category as Category,
    status: d.type,
    location: d.location,
    date: d.date,
    time: d.time || undefined,
    description: d.description.trim(),
    imageUrl: d.imageUrl,
    contact: d.type === "lost" ? d.contact.trim() || undefined : undefined,
    handover: d.type === "found" ? d.handover : undefined,
    mine: true,
  };
}

export type ReportTab = "lost" | "found" | "resolved";

// One-line "what is happening now" for an own post.
export function reportStatusLine(
  item: Item,
  matchCount: number,
  t: I18n["t"],
): { text: string; tone: "info" | "wait" | "done" } {
  if (item.status === "resolved") {
    return {
      text: t(
        item.resolvedFrom === "found"
          ? "report.statusLine.resolvedFound"
          : "report.statusLine.resolvedLost",
      ),
      tone: "done",
    };
  }
  if (item.status === "lost") {
    return matchCount > 0
      ? {
          text: t(
            matchCount === 1
              ? "report.statusLine.matchesOne"
              : "report.statusLine.matchesMany",
            {
              count: matchCount,
            },
          ),
          tone: "info",
        }
      : { text: t("report.statusLine.searching"), tone: "wait" };
  }
  return {
    text: t(
      item.handover === "office"
        ? "report.statusLine.office"
        : "report.statusLine.withMe",
    ),
    tone: "wait",
  };
}

// Prefill the Report form from an existing post.
export function itemToDraft(item: Item): ReportDraft {
  return {
    type: item.status === "found" ? "found" : "lost",
    imageUrl: item.imageUrl,
    name: item.name,
    category: item.category,
    location: item.location,
    date: item.date,
    time: item.time ?? "",
    description: item.description,
    contact: item.contact ?? "",
    handover: item.handover ?? "with-me",
  };
}

// Split notifications into the last 24 hours and older, newest first.
export function groupNotifications(list: AppNotification[]): {
  today: AppNotification[];
  earlier: AppNotification[];
} {
  const sorted = [...list].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const cutoff = Date.now() - 86_400_000;
  return {
    today: sorted.filter((n) => new Date(n.createdAt).getTime() > cutoff),
    earlier: sorted.filter((n) => new Date(n.createdAt).getTime() <= cutoff),
  };
}
