"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function StaffShelterClaim() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    const supabase = createBrowserSupabaseClient();
    const { data, error: rpcError } = await supabase.rpc("claim_shelter_access", {
      p_access_code: trimmed,
    });
    setBusy(false);
    if (rpcError) {
      setError(
        rpcError.message.includes("invalid access code") ||
          rpcError.message.includes("Invalid access code")
          ? "That code was not recognized."
          : rpcError.message,
      );
      return;
    }
    const row = Array.isArray(data) ? data[0] : null;
    if (!row?.shelter_id) {
      setError("That code was not recognized.");
      return;
    }
    setCode("");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6"
    >
      <h2 className="font-semibold text-slate-900">Shelter access</h2>
      <p className="mt-2 text-sm text-slate-600">
        Enter your shelter&apos;s access code to load check-ins for that location.
        Your account remembers each code you unlock.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Access code</span>
          <input
            type="text"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !code.trim()}
          className="min-h-11 rounded-lg bg-amber-700 px-5 font-medium text-white disabled:bg-slate-300"
        >
          {busy ? "Unlocking…" : "Unlock"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
