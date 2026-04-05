import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { aggregateEntries, type RawMoodEntry } from "./aggregate";
import {
  LQ1_OPTIONS,
  LQ2_OPTIONS,
  LQ4_OPTIONS,
  LQ5_OPTIONS,
  QUESTION_LABELS,
} from "./questions";
import { getLongRangeBounds, type LongTimeRange } from "./time-range";
import {
  dominantOption,
  likertDistributionRows,
  topOptionsFromCounts,
  type StatRow,
  type DominantStat,
} from "./stats-helpers";

const LQ1_ORDER = Object.values(LQ1_OPTIONS);
const LQ2_ORDER = Object.values(LQ2_OPTIONS);
const LQ4_ORDER = Object.values(LQ4_OPTIONS);
const LQ5_ORDER = Object.values(LQ5_OPTIONS);
export type LongInsightsSnapshot = {
  total: number;
  rangeKey: LongTimeRange;
  rangeLabel: string;
  stressDominant: DominantStat | null;
  hopefulDistribution: StatRow[];
  physicalTop: StatRow[];
  foodDistribution: StatRow[];
  belongingDominant: DominantStat | null;
  programsTop: StatRow[];
  copy: {
    stressLeadIn: string;
    hopefulLeadIn: string;
    physicalLeadIn: string;
    foodLeadIn: string;
    belongingLeadIn: string;
    programsLeadIn: string;
  };
};

function rowsWithLongSurvey(rows: RawMoodEntry[]): RawMoodEntry[] {
  return rows.filter((r) => r.long_survey_completed);
}

export async function fetchLongTermInsightsInner(
  range: LongTimeRange,
): Promise<LongInsightsSnapshot> {
  const supabase = await createServerSupabaseClient();
  const { since, until, label } = getLongRangeBounds(range);

  const { data, error } = await supabase
    .from("mood_entries")
    .select(
      "mood_level, short_survey_completed, long_survey_completed, sq1_answer, sq2_answer, sq3_answer, lq1_answer, lq2_answer, lq3_answer, lq4_answer, lq5_answer, lq6_answer",
    )
    .gte("created_at", since)
    .lte("created_at", until);

  if (error) throw new Error(error.message);

  const raw = (data ?? []) as RawMoodEntry[];
  const longRows = rowsWithLongSurvey(raw);
  const aggregated = aggregateEntries(longRows);
  const total = longRows.length;

  const { lq1Count, lq2Count, lq3Count, lq4Count, lq5Count, lq6Count } =
    aggregated;

  const lq3Den = Object.values(lq3Count).reduce((a, b) => a + b, 0);
  const lq6Den = Object.values(lq6Count).reduce((a, b) => a + b, 0);

  return {
    total,
    rangeKey: range,
    rangeLabel: label,
    stressDominant: dominantOption(lq1Count, LQ1_ORDER),
    hopefulDistribution: likertDistributionRows(lq2Count, LQ2_ORDER),
    physicalTop: topOptionsFromCounts(
      lq3Count,
      lq3Den > 0 ? lq3Den : 1,
      5,
    ).slice(0, 3),
    foodDistribution: likertDistributionRows(lq4Count, LQ4_ORDER),
    belongingDominant: dominantOption(lq5Count, LQ5_ORDER),
    programsTop: topOptionsFromCounts(
      lq6Count,
      lq6Den > 0 ? lq6Den : 1,
      5,
    ).slice(0, 3),
    copy: {
      stressLeadIn: "Overall stress levels among residents are…",
      hopefulLeadIn: QUESTION_LABELS.lq2_answer,
      physicalLeadIn: "How have residents been feeling physically?",
      foodLeadIn: QUESTION_LABELS.lq4_answer,
      belongingLeadIn:
        "Overall, residents' sense of belonging in the community is…",
      programsLeadIn: "Top programs residents are interested in",
    },
  };
}

export const getLongTermInsightsData = cache(fetchLongTermInsightsInner);
