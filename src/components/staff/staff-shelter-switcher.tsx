"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type StaffShelterOption = { id: string; name: string };

export function StaffShelterSwitcher({
  shelters,
  selectedId,
}: {
  shelters: StaffShelterOption[];
  selectedId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSelect = useCallback(
    (nextId: string) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set("shelter", nextId);
      router.push(`/staff/dashboard?${p.toString()}`);
      router.refresh();
    },
    [router, searchParams],
  );

  if (shelters.length === 0) return null;

  return (
    <div className="min-w-0 max-w-[min(100%,18rem)] sm:max-w-xs">
      <select
        className="w-full rounded-xl border-2 border-[var(--staff-ink)]/15 bg-[var(--staff-input-bg)] px-3 py-2 text-sm font-semibold text-[var(--staff-ink)] shadow-sm focus:border-[var(--staff-accent)] focus:outline-none"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        aria-label="Switch location"
      >
        {shelters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name.trim() || "Unnamed"}
          </option>
        ))}
      </select>
    </div>
  );
}
