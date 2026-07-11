import { NextResponse } from "next/server";
import { getIndexNowKeyFileContent } from "@/lib/seo/indexnow";

export function GET() {
  const key = getIndexNowKeyFileContent();

  if (!key) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(key, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
