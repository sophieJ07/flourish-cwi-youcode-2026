import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** `/staff` has no UI; send people to the dashboard flow (same guards as dashboard). */
export default async function StaffIndexPage() {
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

  redirect("/staff/dashboard");
}
