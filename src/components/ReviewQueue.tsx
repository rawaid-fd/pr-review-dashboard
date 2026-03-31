"use client";

import { useState, useEffect, useCallback } from "react";
import type { PullRequest, PillarPrsResponse } from "@/types";
import type { ReviewData } from "@/app/api/reviews/route";
import { PrCard } from "./PrCard";
import { PrCardSkeleton } from "./PrCardSkeleton";
import { RefreshIndicator } from "./RefreshIndicator";

const REFRESH_INTERVAL_MS = 5 * 60_000;
const PINNED_KEY = "pr-dashboard-pinned-repos";

function groupByRepo(prs: PullRequest[]): Record<string, PullRequest[]> {
  return prs.reduce<Record<string, PullRequest[]>>((acc, pr) => {
    if (!acc[pr.repo]) acc[pr.repo] = [];
    acc[pr.repo].push(pr);
    return acc;
  }, {});
}

function usePinnedRepos() {
  const [pinned, setPinned] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PINNED_KEY);
      if (stored) setPinned(new Set(JSON.parse(stored) as string[]));
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback((repo: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(repo)) next.delete(repo);
      else next.add(repo);
      try {
        localStorage.setItem(PINNED_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { pinned, toggle };
}

export function ReviewQueue() {
  const [response, setResponse] = useState<PillarPrsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const { pinned, toggle } = usePinnedRepos();

  const fetchReviews = useCallback(async (prs: PullRequest[]) => {
    if (prs.length === 0) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prs.map((pr) => ({ repo: pr.repo, number: pr.number }))),
      });
      const data: Record<string, ReviewData> = await res.json();
      setReviews(data);
    } catch {
      // reviews are non-critical — fail silently
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/queue");
      const json: PillarPrsResponse = await res.json();
      setResponse(json);
      // Fetch review data as a second non-blocking pass
      fetchReviews(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [fetchReviews]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading && !response) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <PrCardSkeleton key={i} />)}
      </div>
    );
  }

  if (response?.error) {
    return (
      <p className="text-sm text-red-400 rounded bg-red-950 px-4 py-3">
        {response.error}
      </p>
    );
  }

  const grouped = groupByRepo(response?.data ?? []);
  const repos = Object.keys(grouped).sort((a, b) => {
    const aPinned = pinned.has(a);
    const bPinned = pinned.has(b);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-col gap-8">
      <RefreshIndicator cachedAt={response?.cachedAt} onRefresh={refresh} />

      {repos.length === 0 ? (
        <p className="text-gray-500 text-sm">No pending reviews — you&apos;re all caught up.</p>
      ) : (
        repos.map((repo) => (
          <section key={repo}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(repo)}
                  className="text-base leading-none transition-opacity"
                  title={pinned.has(repo) ? "Unpin repo" : "Pin repo to top"}
                >
                  {pinned.has(repo) ? "★" : "☆"}
                </button>
                <h2 className="text-sm font-mono text-gray-400">{repo}</h2>
              </div>
              <span className="text-xs text-gray-600">
                {grouped[repo].length} PR{grouped[repo].length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {grouped[repo].map((pr) => (
                <PrCard
                  key={pr.id}
                  pr={pr}
                  reviewData={reviews[`${pr.repo}/${pr.number}`]}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
