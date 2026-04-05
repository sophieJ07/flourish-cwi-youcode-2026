"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type KioskWellnessPayload = {
  accessCode: string;
  moodLevels: number[];
  shortSurveyCompleted: boolean;
  longSurveyCompleted: boolean;
  sq1: number[] | null;
  sq2: number[] | null;
  sq3: number[] | null;
  lq1: number[] | null;
  lq2: number[] | null;
  lq3: number[] | null;
  lq4: number[] | null;
  lq5: number[] | null;
  lq6: number[] | null;
};

export async function validateKioskAccess(accessCode: string) {
  const code = accessCode.trim();
  if (!code) return { ok: false as const };

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("validate_kiosk_access", {
    p_access_code: code,
  });

  if (error) return { ok: false as const };
  const row = Array.isArray(data) ? data[0] : null;
  if (!row?.shelter_id) return { ok: false as const };
  return { ok: true as const };
}

export async function submitKioskWellnessCheckin(
  payload: KioskWellnessPayload,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("submit_kiosk_wellness_checkin", {
    p_access_code: payload.accessCode.trim(),
    p_mood_levels: payload.moodLevels,
    p_short_survey_completed: payload.shortSurveyCompleted,
    p_long_survey_completed: payload.longSurveyCompleted,
    p_sq1: payload.sq1,
    p_sq2: payload.sq2,
    p_sq3: payload.sq3,
    p_lq1: payload.lq1,
    p_lq2: payload.lq2,
    p_lq3: payload.lq3,
    p_lq4: payload.lq4,
    p_lq5: payload.lq5,
    p_lq6: payload.lq6,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
