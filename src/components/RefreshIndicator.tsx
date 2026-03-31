"use client";

interface RefreshIndicatorProps {
  cachedAt: string | undefined;
  onRefresh: () => void;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export function RefreshIndicator({ cachedAt, onRefresh }: RefreshIndicatorProps) {
  return (
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>{cachedAt ? `Updated ${timeAgo(cachedAt)}` : ""}</span>
      <button
        onClick={onRefresh}
        className="hover:text-gray-300 transition-colors"
        aria-label="Refresh"
      >
        ↻
      </button>
    </div>
  );
}
