import { daysSince } from "../utils/date";
import type { TKey } from "../i18n";
import type { Item } from "./types";

// Reason as a translation key + params, rendered with t() in the UI.
export interface MatchReason {
  key: TKey;
  params?: Record<string, string | number>;
}

export interface Match {
  item: Item;
  score: number; // 0-100
  reasons: MatchReason[];
}

const STOPWORDS = new Set(
  "a an the and or of on in at to with for near by from my is it its this that small big left found lost inside".split(
    " ",
  ),
);

function keywords(item: Item): Set<string> {
  return new Set(
    `${item.name} ${item.description}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

// Simple weighted score (max 95): category 30, place 25, date up to 20, shared words up to 20.
export function scoreMatch(source: Item, candidate: Item): Match {
  const reasons: MatchReason[] = [];
  let score = 0;

  if (source.category === candidate.category) {
    score += 30;
    reasons.push({ key: "matches.reason.category" });
  }
  if (source.location === candidate.location) {
    score += 25;
    reasons.push({ key: "matches.reason.place" });
  }

  const gap = Math.abs(daysSince(source.date) - daysSince(candidate.date));
  const datePoints = gap <= 1 ? 20 : gap <= 3 ? 15 : gap <= 7 ? 8 : 0;
  score += datePoints;
  if (datePoints) {
    reasons.push(
      gap === 0
        ? { key: "matches.reason.sameDay" }
        : gap === 1
          ? { key: "matches.reason.dayApart" }
          : { key: "matches.reason.daysApart", params: { count: gap } },
    );
  }

  const a = keywords(source);
  const shared = [...keywords(candidate)].filter((w) => a.has(w));
  score += Math.min(shared.length * 5, 20);
  if (shared.length)
    reasons.push({
      key: "matches.reason.words",
      params: { words: shared.slice(0, 3).join(", ") },
    });

  return { item: candidate, score: Math.min(score, 100), reasons };
}

// Lost items match found items and vice versa; weak matches are dropped.
export function findMatches(
  source: Item,
  items: Item[],
  minScore = 40,
): Match[] {
  if (source.status === "resolved") return [];
  const opposite = source.status === "lost" ? "found" : "lost";
  return items
    .filter((i) => i.id !== source.id && i.status === opposite)
    .map((i) => scoreMatch(source, i))
    .filter((m) => m.score >= minScore)
    .sort((x, y) => y.score - x.score);
}

export function matchLevel(score: number): "strong" | "good" | "possible" {
  return score >= 75 ? "strong" : score >= 55 ? "good" : "possible";
}
