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

/** Likert 1..n: first option = 1, …, last = n. Label = option whose step is nearest the mean (rounded). */
export type MeanLikertStat = {
  label: string;
  mean: number;
  /** Ring fill 0–100: mean as a fraction of the top-of-scale (n). */
  arcPct: number;
};

export function meanLikertSummary(
  counts: OptionCount,
  orderedLabels: readonly string[],
): MeanLikertStat | null {
  const n = orderedLabels.length;
  if (n === 0) return null;

  let weighted = 0;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const label = orderedLabels[i]!;
    const c = counts[label] ?? 0;
    weighted += (i + 1) * c;
    total += c;
  }
  if (total === 0) return null;

  const mean = weighted / total;
  const rounded = Math.min(n, Math.max(1, Math.round(mean)));
  const label = orderedLabels[rounded - 1]!;
  const arcPct = (mean / n) * 100;

  return { label, mean, arcPct };
}
