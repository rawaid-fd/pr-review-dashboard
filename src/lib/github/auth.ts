import { Octokit } from "@octokit/rest";

/**
 * Returns an authenticated Octokit instance.
 *
 * Currently uses a PAT from GITHUB_PAT env var.
 * To add GitHub OAuth later: pass the user's session token as `userToken`
 * (e.g. from NextAuth). Everything else in the codebase calls this function
 * and is unaware of which auth strategy is in use.
 */
export function createOctokitClient(userToken?: string): Octokit {
  const token = userToken ?? process.env.GITHUB_PAT;

  if (!token) {
    throw new Error(
      "No GitHub token found. Copy .env.local.example to .env.local and set GITHUB_PAT."
    );
  }

  return new Octokit({ auth: token });
}
