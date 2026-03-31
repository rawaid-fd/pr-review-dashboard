"use client";

import { useState, useEffect, useCallback } from "react";
import type { Pillar, PillarPrsResponse } from "@/types";
import { PrCard } from "./PrCard";
import { PrCardSkeleton } from "./PrCardSkeleton";
import { RefreshIndicator } from "./RefreshIndicator";

const REFRESH_INTERVAL_MS = 60_000;

const ACCENT_COLORS: Record<string, string> = {
  blue:   "border-blue-500",
  green:  "border-green-500",
  purple: "border-purple-500",
  orange: "border-orange-500",
  pink:   "border-pink-500",
  red:    "border-red-500",
};

interface PillarColumnProps {
  pillar: Pillar;
}

export function PillarColumn({ pillar }: PillarColumnProps) {
  const [response, setResponse] = useState<PillarPrsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pillars/${pillar.slug}`);
      const json: PillarPrsResponse = await res.json();
      setResponse(json);
    } finally {
      setLoading(false);
    }
  }, [pillar.slug]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const accentClass = ACCENT_COLORS[pillar.color] ?? "border-gray-500";

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className={`flex items-center justify-between border-b-2 ${accentClass} pb-2`}>
        <h2 className="text-base font-semibold text-white">{pillar.displayName}</h2>
        <span className="text-xs text-gray-400 tabular-nums">
          {response ? `${response.data.length} PR${response.data.length !== 1 ? "s" : ""}` : "—"}
        </span>
      </div>

      <RefreshIndicator cachedAt={response?.cachedAt} onRefresh={refresh} />

      <div className="flex flex-col gap-2">
        {loading && !response ? (
          <>
            <PrCardSkeleton />
            <PrCardSkeleton />
            <PrCardSkeleton />
          </>
        ) : response?.error ? (
          <p className="text-xs text-red-400 rounded bg-red-950 px-3 py-2">
            {response.error}
          </p>
        ) : response?.data.length === 0 ? (
          <p className="text-xs text-gray-500 px-1">No pending reviews</p>
        ) : (
          response?.data.map((pr) => <PrCard key={pr.id} pr={pr} />)
        )}
      </div>
    </div>
  );
}
