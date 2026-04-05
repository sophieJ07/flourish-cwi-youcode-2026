import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const STAFF_LOGIN = "/staff/login";

/** Staff laptop UI routes (no auth yet) — remove from this list when wiring Supabase. */
function isStaffPublicUiPath(pathname: string): boolean {
  return (
    pathname === STAFF_LOGIN ||
    pathname === "/staff/access-code" ||
    pathname === "/staff/dashboard"
  );
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/staff") && !isStaffPublicUiPath(pathname)) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = STAFF_LOGIN;
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // While staff laptop UI is public, do not skip /staff/login when a Supabase
  // session exists (otherwise login always looks like "the dashboard").
  // When wiring auth, restore: if (pathname === STAFF_LOGIN && user) redirect
  // to /staff/access-code or /staff/dashboard per your flow.

  return supabaseResponse;
}

export const config = {
  matcher: ["/staff/:path*"],
};
