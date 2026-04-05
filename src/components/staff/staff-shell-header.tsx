type Props = {
  showProfileSlot?: boolean;
  profileSlot?: React.ReactNode;
};

/** Laptop staff shell: maroon roundel + title; optional top-right profile placeholder. */
export function StaffShellHeader({
  showProfileSlot = false,
  profileSlot,
}: Props) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[var(--staff-ink)]/10 bg-white/80 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full bg-[var(--staff-accent)] text-center text-[0.55rem] font-bold leading-tight text-white shadow-sm ring-2 ring-[var(--staff-accent)]/40"
          aria-hidden
        >
          <span>CWI</span>
          <span className="font-semibold">Wellness</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-[var(--staff-ink)]">
          Wellness Check-in
        </span>
      </div>
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
    </header>
  );
}
