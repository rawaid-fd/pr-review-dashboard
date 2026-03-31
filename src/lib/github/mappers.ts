import type { PullRequest } from "@/types";

interface SearchItem {
  id: number;
  number: number;
  title: string;
  html_url: string;
  repository_url?: string;
  user: { login: string; avatar_url: string } | null;
  draft?: boolean;
  labels: Array<{ name?: string }>;
  comments: number;
  created_at: string;
  requested_teams?: Array<{ slug: string }>;
}

export function mapSearchItemToPr(item: SearchItem): PullRequest {
  // repository_url: "https://api.github.com/repos/fanduel/sportsbook-web"
  // html_url fallback: "https://github.com/fanduel/sportsbook-web/pull/123"
  const repo = item.repository_url
    ? item.repository_url.replace("https://api.github.com/repos/", "")
    : item.html_url.split("/").slice(3, 5).join("/");

  const ageInDays = Math.floor(
    (Date.now() - new Date(item.created_at).getTime()) / 86_400_000
  );

  return {
    id: item.id,
    number: item.number,
    title: item.title,
    url: item.html_url,
    repo,
    author: {
      login: item.user?.login ?? "unknown",
      avatarUrl: item.user?.avatar_url ?? "",
    },
    isDraft: item.draft ?? false,
    labels: item.labels.map((l) => l.name ?? "").filter(Boolean),
    reviewStatus: "pending",
    reviewCounts: { approved: 0, changesRequested: 0, commented: 0 },
    commentCount: item.comments,
    createdAt: item.created_at,
    ageInDays,
    requestedTeams: (item.requested_teams ?? []).map((t) => t.slug),
  };
}
