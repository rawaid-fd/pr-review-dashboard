import { createOctokitClient } from "./auth";
import { mapSearchItemToPr } from "./mappers";
import type { PullRequest } from "@/types";

const ORG = "fanduel";

type ReviewState = "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING";

function aggregateReviewStatus(
  reviews: Array<{ state: string; user: { login: string } | null }>
): PullRequest["reviewStatus"] {
  // Latest review per reviewer wins (excluding DISMISSED/PENDING)
  const latestByReviewer = new Map<string, ReviewState>();
  for (const review of reviews) {
    const state = review.state as ReviewState;
    if (state !== "PENDING" && state !== "DISMISSED" && review.user) {
      latestByReviewer.set(review.user.login, state);
    }
  }
  const states = [...latestByReviewer.values()];
  if (states.includes("CHANGES_REQUESTED")) return "changes_requested";
  if (states.includes("APPROVED")) return "approved";
  if (states.includes("COMMENTED")) return "commented";
  return "pending";
}

function countReviews(
  reviews: Array<{ state: string; user: { login: string } | null }>
): PullRequest["reviewCounts"] {
  const latestByReviewer = new Map<string, ReviewState>();
  for (const review of reviews) {
    const state = review.state as ReviewState;
    if (state !== "PENDING" && state !== "DISMISSED" && review.user) {
      latestByReviewer.set(review.user.login, state);
    }
  }
  const states = [...latestByReviewer.values()];
  return {
    approved: states.filter((s) => s === "APPROVED").length,
    changesRequested: states.filter((s) => s === "CHANGES_REQUESTED").length,
    commented: states.filter((s) => s === "COMMENTED").length,
  };
}

export async function fetchMyReviewQueue(
  userToken?: string
): Promise<PullRequest[]> {
  const octokit = createOctokitClient(userToken);

  // review-requested:@me includes:
  // - PRs where you are directly requested as a reviewer
  // - PRs where a team you belong to is requested
  const q = `is:pr is:open review-requested:@me org:${ORG} draft:false`;

  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q,
    per_page: 100,
  });

  const prs = data.items.map(mapSearchItemToPr);

  // Enrich each PR with review status in parallel
  const enriched = await Promise.allSettled(
    prs.map(async (pr) => {
      const [owner, repo] = pr.repo.split("/");
      const { data: reviews } = await octokit.rest.pulls.listReviews({
        owner,
        repo,
        pull_number: pr.number,
        per_page: 100,
      });
      return {
        ...pr,
        reviewStatus: aggregateReviewStatus(reviews),
        reviewCounts: countReviews(reviews),
      };
    })
  );

  return enriched.map((result, i) =>
    result.status === "fulfilled" ? result.value : prs[i]
  );
}
