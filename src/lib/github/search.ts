import { createOctokitClient } from "./auth";
import { mapSearchItemToPr } from "./mappers";
import type { PullRequest } from "@/types";

const ORG = "fanduel";

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

  return data.items.map(mapSearchItemToPr);
}
