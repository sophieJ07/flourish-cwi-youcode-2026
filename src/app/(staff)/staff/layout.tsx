import type { CSSProperties } from "react";

export default function StaffSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="staff-laptop-shell flex min-h-dvh flex-col font-sans antialiased"
      style={
        {
          "--staff-bg": "#f5eaec",
          "--staff-ink": "#4a1f24",
          "--staff-accent": "#6b2d38",
          "--staff-input-bg": "#e6dfe3",
          "--staff-card": "#ffffff",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
