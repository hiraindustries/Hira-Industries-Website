import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { refreshSupabaseSession } from "@/lib/supabase/proxy";

const canonicalHostname = "www.hiraindustrieskhurja.com";
const nonWwwProductionHostname = "hiraindustrieskhurja.com";

function getRequestHostname(request: NextRequest) {
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  return (forwardedHost ?? request.nextUrl.hostname)
    .split(":", 1)[0]
    .toLowerCase();
}

export async function proxy(request: NextRequest) {
  if (getRequestHostname(request) === nonWwwProductionHostname) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = canonicalHostname;
    canonicalUrl.port = "";

    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return refreshSupabaseSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)",
  ],
};
