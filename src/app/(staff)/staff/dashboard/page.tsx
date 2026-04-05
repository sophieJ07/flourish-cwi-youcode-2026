import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/staff/sign-out-button";
import { StaffShellHeader } from "@/components/staff/staff-shell-header";
import { StaffInsightsDashboard } from "@/components/staff/staff-insights-dashboard";
import { getLongTermInsightsData } from "@/lib/insights/long-term-insights";
import { getShortTermInsightsData } from "@/lib/insights/short-term-insights";
import { staffDashboardQuery } from "@/lib/staff/dashboard-search";
import {
  parseLongTimeRange,
  parseShortTimeRange,
} from "@/lib/insights/time-range";

export const metadata: Metadata = {
  title: "Insights | Staff",
};

type SearchParams = Promise<{
  term?: string;
  range?: string;
  lrange?: string;
  shelter?: string;
}>;

export default async function StaffDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const term = sp.term === "long" ? "long" : "short";
  const range = parseShortTimeRange(sp.range);
  const longRange = parseLongTimeRange(sp.lrange);

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/staff/login?next=/staff/dashboard");
  }

  const { count, error } = await supabase
    .from("user_shelter_access")
    .select("*", { count: "exact", head: true });

  if (!error && (count == null || count < 1)) {
    redirect("/staff/access-code");
  }

  const { data: accessibleShelters } = await supabase
    .from("shelters")
    .select("id, name")
    .order("name");

  const shelters = accessibleShelters ?? [];
  const validIds = new Set(shelters.map((s) => s.id));
  const requested = sp.shelter;
  const selectedId =
    requested && validIds.has(requested) ? requested : shelters[0]?.id;

  if (!selectedId) {
    redirect("/staff/access-code");
  }

  if (!requested || !validIds.has(requested)) {
    redirect(
      staffDashboardQuery({
        shelterId: selectedId,
        term: sp.term,
        range: sp.range,
        lrange: sp.lrange,
      }),
    );
  }

  const currentName =
    shelters.find((s) => s.id === selectedId)?.name?.trim() ?? "this shelter";

  const shortData =
    term === "short"
      ? await getShortTermInsightsData(range, selectedId)
      : null;
  const longData =
    term === "long"
      ? await getLongTermInsightsData(longRange, selectedId)
      : null;

  const aiConfigured =
    process.env.AI_PROVIDER === "claude" &&
    Boolean(process.env.ANTHROPIC_API_KEY);

  const shelterOptions = shelters.map((s) => ({
    id: s.id,
    name: s.name ?? "",
  }));

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--staff-bg)] text-[var(--staff-ink)]">
      <StaffShellHeader
        showProfileSlot
        profileSlot={<SignOutButton />}
        shelters={shelterOptions}
        selectedShelterId={selectedId}
      />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <h1 className="text-center text-3xl font-bold leading-snug text-[var(--staff-ink)] sm:text-left sm:text-4xl">
          Live wellness data at {currentName}
        </h1>

        <StaffInsightsDashboard
          key={`${selectedId}-${term}-${range}-${longRange}`}
          term={term}
          range={range}
          longRange={longRange}
          shelterId={selectedId}
          snapshot={shortData?.snapshot ?? null}
          longSnapshot={longData ?? null}
          aiConfigured={aiConfigured}
        />
      </main>
    </div>
  );
}
