import { Suspense } from "react";
import { WellnessBrandLogo } from "@/components/wellness-brand-logo";
import {
  StaffShelterSwitcher,
  type StaffShelterOption,
} from "@/components/staff/staff-shelter-switcher";

type Props = {
  showProfileSlot?: boolean;
  profileSlot?: React.ReactNode;
  /** When set with `selectedShelterId`, shows shelter dropdown (e.g. on dashboard). */
  shelters?: StaffShelterOption[];
  selectedShelterId?: string | null;
};

/** Laptop staff shell header — same logo and title treatment as the kiosk. */
export function StaffShellHeader({
  showProfileSlot = false,
  profileSlot,
  shelters,
  selectedShelterId,
}: Props) {
  const switcherShelters =
    shelters && shelters.length > 0 && selectedShelterId
      ? { list: shelters, id: selectedShelterId }
      : null;

  return (
    <header className="relative flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--staff-ink)]/10 bg-[var(--wellness-surface)]/85 px-4 py-4 backdrop-blur-sm sm:gap-4 sm:px-6">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <WellnessBrandLogo />
          <span className="text-lg font-bold tracking-tight text-[var(--staff-ink)] sm:text-xl">
            Flourish: Wellness Check-In
          </span>
        </div>
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        {switcherShelters ? (
          <Suspense
            fallback={
              <div
                className="h-10 w-44 shrink-0 rounded-xl bg-[var(--staff-ink)]/5 sm:w-48"
                aria-hidden
              />
            }
          >
            <StaffShelterSwitcher
              shelters={switcherShelters.list}
              selectedId={switcherShelters.id}
            />
          </Suspense>
        ) : null}
        {showProfileSlot ? (
          profileSlot ?? (
            <button
              type="button"
              className="h-10 w-10 shrink-0 rounded-full bg-[var(--staff-accent)] opacity-90 shadow-md transition hover:opacity-100"
              aria-label="Menu (not wired yet)"
            />
          )
        ) : (
          <div className="h-10 w-10 shrink-0" aria-hidden />
        )}
      </div>
    </header>
  );
}
