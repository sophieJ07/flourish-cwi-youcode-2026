import type { useTranslations } from "next-intl";

export type WellnessQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

type TFunction = ReturnType<typeof useTranslations>;

export function getMoodOptions(t: TFunction) {
  return [
    { id: "great", label: t("MoodOptions.great") },
    { id: "good", label: t("MoodOptions.good") },
    { id: "okay", label: t("MoodOptions.okay") },
    { id: "low", label: t("MoodOptions.low") },
    { id: "stressed", label: t("MoodOptions.stressed") },
    { id: "tired", label: t("MoodOptions.tired") },
  ];
}

const SHORT_IDS = ["short-1", "short-2", "short-3"];
const SHORT_OPT_COUNTS: Record<string, number> = {
  "short-1": 6,
  "short-2": 5,
  "short-3": 5,
};

export function getShortQuestions(t: TFunction): WellnessQuestion[] {
  return SHORT_IDS.map((id) => ({
    id,
    prompt: t(`ShortQuestions.${id}-prompt` as Parameters<TFunction>[0]),
    options: Array.from({ length: SHORT_OPT_COUNTS[id] }, (_, i) =>
      t(`ShortQuestions.${id}-opt-${i}` as Parameters<TFunction>[0]),
    ),
  }));
}

const LONG_IDS = ["long-1", "long-2", "long-3", "long-4", "long-5", "long-6"];
const LONG_OPT_COUNTS: Record<string, number> = {
  "long-1": 5,
  "long-2": 6,
  "long-3": 5,
  "long-4": 6,
  "long-5": 6,
  "long-6": 5,
};

export function getLongQuestions(t: TFunction): WellnessQuestion[] {
  return LONG_IDS.map((id) => ({
    id,
    prompt: t(`LongQuestions.${id}-prompt` as Parameters<TFunction>[0]),
    options: Array.from({ length: LONG_OPT_COUNTS[id] }, (_, i) =>
      t(`LongQuestions.${id}-opt-${i}` as Parameters<TFunction>[0]),
    ),
  }));
}