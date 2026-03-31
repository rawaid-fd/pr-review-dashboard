import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchMyReviewQueue } from "@/lib/github/search";
import type { PillarPrsResponse } from "@/types";

export async function GET(_req: NextRequest) {
  try {
    const getCached = unstable_cache(
      () => fetchMyReviewQueue(),
      ["my-review-queue"],
      { revalidate: 300 }
    );

    const data = await getCached();
    const response: PillarPrsResponse = {
      data,
      cachedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[review-queue]", message);
    return NextResponse.json(
      { data: [], cachedAt: new Date().toISOString(), error: message },
      { status: 500 }
    );
  }
}
