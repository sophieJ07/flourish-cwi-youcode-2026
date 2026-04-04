"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const STORAGE_KEY = "shelter_checkin_access_code";

/** 1 = lowest, 5 = highest — stored as mood_level in the database. */
const MOODS = [
  { level: 1 as const, label: "Rough", emoji: "😣" },
  { level: 2 as const, label: "Low", emoji: "😔" },
  { level: 3 as const, label: "Okay", emoji: "🙂" },
  { level: 4 as const, label: "Good", emoji: "😊" },
  { level: 5 as const, label: "Great", emoji: "🌟" },
] as const;

function readStoredAccessCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v?.trim() || null;
  } catch {
    return null;
  }
}

export function KioskCheckIn() {
  const [accessCode, setAccessCodeState] = useState<string | null>(null);
  const [gateCode, setGateCode] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateBusy, setGateBusy] = useState(false);

  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAccessCodeState(readStoredAccessCode());
  }, []);

  const clearLocation = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setAccessCodeState(null);
    setGateCode("");
    setGateError(null);
    setSelected(null);
    setStatus("idle");
  }, []);

  async function onGateSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = gateCode.trim();
    if (!code) return;
    setGateBusy(true);
    setGateError(null);
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.rpc("validate_kiosk_access", {
      p_access_code: code,
    });
    setGateBusy(false);
    if (error) {
      setGateError(
        error.message.includes("function") || error.code === "42883"
          ? "Database is not set up for this screen yet. Ask staff to run the latest migration."
          : error.message,
      );
      return;
    }
    const row = Array.isArray(data) ? data[0] : null;
    if (!row?.shelter_id) {
      setGateError("That code was not recognized. Try again or ask a staff member.");
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      setGateError("This browser blocked saving the code. Check storage settings.");
      return;
    }
    setAccessCodeState(code);
    setGateCode("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = accessCode;
    if (!code || selected == null) return;
    setStatus("saving");
    setErrorMessage(null);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.rpc("submit_mood_checkin", {
      p_access_code: code,
      p_mood_level: selected,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        error.message.includes("invalid access code") ||
          error.message.includes("Invalid access code")
          ? "This device lost its shelter code. Staff can enter it again below."
          : error.message.includes("function") || error.code === "42883"
            ? "This screen is not fully set up yet. Ask staff to run the latest migration."
            : error.message,
      );
      return;
    }

    setStatus("done");
    setSelected(null);
  }

  if (!accessCode) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Staff: set up this tablet
          </h2>
          <p className="mt-2 text-slate-600">
            Enter today&apos;s shelter access code once. Leave this page open for
            guests — they won&apos;t need the code.
          </p>
          <form onSubmit={onGateSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-left">
              <span className="font-medium text-slate-700">Access code</span>
              <input
                type="text"
                autoComplete="off"
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                className="min-h-12 rounded-xl border border-amber-200 px-4 text-lg focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                placeholder="From your team lead"
              />
            </label>
            {gateError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                {gateError}
              </p>
            )}
            <button
              type="submit"
              disabled={gateBusy || !gateCode.trim()}
              className="min-h-14 rounded-xl bg-amber-700 text-lg font-semibold text-white disabled:bg-slate-300"
            >
              {gateBusy ? "Checking…" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-white p-10 text-center shadow-sm">
        <p className="text-2xl font-medium text-slate-800">Thank you</p>
        <p className="mt-2 text-slate-600">Your check-in was saved.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 min-h-14 w-full rounded-xl bg-amber-700 px-6 text-lg font-semibold text-white active:bg-amber-800 sm:min-h-12"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <legend className="sr-only">How do you feel (1–5)</legend>
          {MOODS.map((m) => {
            const isActive = selected === m.level;
            return (
              <button
                key={m.level}
                type="button"
                onClick={() => setSelected(m.level)}
                className={`flex min-h-[5.5rem] flex-col items-center justify-center gap-1 rounded-2xl border-2 text-base font-semibold transition-colors active:scale-[0.99] sm:min-h-24 sm:text-lg ${
                  isActive
                    ? "border-amber-700 bg-amber-100 text-amber-950 shadow-inner"
                    : "border-amber-200/80 bg-white text-slate-800 shadow-sm hover:border-amber-400"
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {m.emoji}
                </span>
                <span>{m.label}</span>
                <span className="text-xs font-normal text-slate-500">
                  {m.level}/5
                </span>
              </button>
            );
          })}
        </fieldset>

        {status === "error" && errorMessage && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-red-800" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={selected == null || status === "saving"}
          className="min-h-14 w-full rounded-xl bg-amber-700 text-lg font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none active:bg-amber-800 sm:min-h-12"
        >
          {status === "saving" ? "Saving…" : "Submit check-in"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        <button
          type="button"
          onClick={clearLocation}
          className="font-medium text-amber-900 underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
        >
          Staff: enter a different shelter code
        </button>
      </p>
    </div>
  );
}
