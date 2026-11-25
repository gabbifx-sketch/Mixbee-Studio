import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("setup", "1");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));

  const { data: isAdmin, error } = await supabase.rpc("is_studio_admin");
  if (error || !isAdmin) return NextResponse.redirect(new URL("/admin/login?denied=1", request.url));

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
