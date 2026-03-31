import { NextRequest, NextResponse } from "next/server";
import { createOctokitClient } from "@/lib/github/auth";
import type { PullRequest } from "@/types";

type ReviewState = "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING";

interface PrRef {
  repo: string;   // "fanduel/sportsbook-web"
  number: number;
}

export interface ReviewData {
  reviewStatus: PullRequest["reviewStatus"];
  reviewCounts: PullRequest["reviewCounts"];
}

function aggregateReviews(
  reviews: Array<{ state: string; user: { login: string } | null }>
): ReviewData {
  const latest = new Map<string, ReviewState>();
  for (const review of reviews) {
    const state = review.state as ReviewState;
    if (state !== "PENDING" && state !== "DISMISSED" && review.user) {
      latest.set(review.user.login, state);
    }
  }
  const states = [...latest.values()];
  const approved = states.filter((s) => s === "APPROVED").length;
  const changesRequested = states.filter((s) => s === "CHANGES_REQUESTED").length;
  const commented = states.filter((s) => s === "COMMENTED").length;

  let reviewStatus: PullRequest["reviewStatus"] = "pending";
  if (changesRequested > 0) reviewStatus = "changes_requested";
  else if (approved > 0) reviewStatus = "approved";
  else if (commented > 0) reviewStatus = "commented";

  return { reviewStatus, reviewCounts: { approved, changesRequested, commented } };
}

// POST /api/reviews
// Body: PrRef[]
// Returns: Record<"repo/number", ReviewData>
export async function POST(req: NextRequest) {
  let prs: PrRef[];
  try {
    prs = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const octokit = createOctokitClient();

  const results = await Promise.allSettled(
    prs.map(async ({ repo, number }) => {
      const [owner, repoName] = repo.split("/");
      const { data } = await octokit.rest.pulls.listReviews({
        owner,
        repo: repoName,
        pull_number: number,
        per_page: 100,
      });
      return { key: `${repo}/${number}`, data: aggregateReviews(data) };
    })
  );

  const reviewMap: Record<string, ReviewData> = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      reviewMap[result.value.key] = result.value.data;
    }
  }

  return NextResponse.json(reviewMap);
}
