import type { OptionCount } from "./aggregate";

export type StatRow = { label: string; count: number; pct: number };

/** Top `limit` options by count (excluding zeros). */
export function topOptionsFromCounts(
  counts: OptionCount,
  denominator: number,
  limit: number,
): StatRow[] {
  return Object.entries(counts)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      pct: denominator > 0 ? Math.round((count / denominator) * 100) : 0,
    }));
}

/** Mood tiles: percentage share of all mood selections (multiselect). */
export function moodRowsForDisplay(
  moodCount: OptionCount,
  order: readonly string[],
): StatRow[] {
  const totalSelections = order.reduce(
    (sum, label) => sum + (moodCount[label] ?? 0),
    0,
  );
  return order.map((label) => {
    const count = moodCount[label] ?? 0;
    return {
      label,
      count,
      pct:
        totalSelections > 0
          ? Math.round((count / totalSelections) * 100)
          : 0,
    };
  });
}

/** Pad or trim to exactly `slots` rows for UI placeholders. */
export function padStatSlots(rows: StatRow[], slots: number): (StatRow | null)[] {
  const out: (StatRow | null)[] = rows.slice(0, slots);
  while (out.length < slots) out.push(null);
  return out;
}

/** Likert / fixed-order rows: percentages sum to 100% over non-empty totals. */
export function likertDistributionRows(
  counts: OptionCount,
  orderedLabels: readonly string[],
): StatRow[] {
  const total = orderedLabels.reduce((s, l) => s + (counts[l] ?? 0), 0);
  return orderedLabels.map((label) => {
    const count = counts[label] ?? 0;
    return {
      label,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
}

export type DominantStat = { label: string; count: number; pct: number };

/** Mode for dashboards: highest count, tie-break by first in `orderedLabels`. */
export function dominantOption(
  counts: OptionCount,
  orderedLabels: readonly string[],
): DominantStat | null {
  let best: DominantStat | null = null;
  const total = orderedLabels.reduce((s, l) => s + (counts[l] ?? 0), 0);
  if (total === 0) return null;
  for (const label of orderedLabels) {
    const count = counts[label] ?? 0;
    if (count === 0) continue;
    const pct = Math.round((count / total) * 100);
    if (!best || count > best.count) {
      best = { label, count, pct };
    }
  }
  return best;
}
