export interface PullRequest {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  isDraft: boolean;
  labels: string[];
  reviewStatus: "pending" | "changes_requested" | "approved" | "commented";
  reviewCounts: { approved: number; changesRequested: number; commented: number };
  commentCount: number;
  createdAt: string;
  ageInDays: number;
  requestedTeams: string[];
}

export interface Pillar {
  slug: string;
  displayName: string;
  teamSlug: string;
  color: string;
}

export interface ApiResponse<T> {
  data: T;
  cachedAt: string;
  error?: string;
}

export type PillarPrsResponse = ApiResponse<PullRequest[]>;
