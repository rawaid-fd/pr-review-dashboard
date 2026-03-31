import type { PullRequest } from "@/types";
import { StatusBadge } from "./StatusBadge";

interface PrCardProps {
  pr: PullRequest;
}

const REVIEW_STATUS_STYLES = {
  approved:           { dot: "bg-green-400",  label: "Approved",           text: "text-green-400"  },
  changes_requested:  { dot: "bg-red-400",    label: "Changes requested",  text: "text-red-400"    },
  commented:          { dot: "bg-yellow-400", label: "Commented",          text: "text-yellow-400" },
  pending:            { dot: "bg-gray-600",   label: "Awaiting review",    text: "text-gray-500"   },
};

export function PrCard({ pr }: PrCardProps) {
  const repoName = pr.repo.split("/").pop() ?? pr.repo;
  const status = REVIEW_STATUS_STYLES[pr.reviewStatus];
  const { approved, changesRequested } = pr.reviewCounts;

  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg bg-gray-800 p-3 transition-colors border border-gray-700 hover:border-gray-500"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-gray-400 font-mono shrink-0">
          #{pr.number}
        </span>
        <div className="flex gap-1 shrink-0 flex-wrap justify-end">
          {pr.isDraft && <StatusBadge label="Draft" variant="draft" />}
          <StatusBadge label={String(pr.ageInDays)} variant="age" />
        </div>
      </div>

      <p className="mt-1 text-sm text-white leading-snug line-clamp-2">
        {pr.title}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {pr.author.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pr.author.avatarUrl}
            alt={pr.author.login}
            className="w-4 h-4 rounded-full"
          />
        )}
        <span className="text-xs text-gray-400">{pr.author.login}</span>
        <span className="text-xs text-gray-600">·</span>
        <span className="text-xs text-gray-500 truncate">{repoName}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
          <span className={`text-xs ${status.text}`}>{status.label}</span>
          {(approved > 0 || changesRequested > 0) && (
            <span className="text-xs text-gray-600">
              ({approved > 0 && <span className="text-green-500">+{approved}</span>}
              {changesRequested > 0 && <span className="text-red-500"> -{changesRequested}</span>})
            </span>
          )}
        </div>
        {pr.commentCount > 0 && (
          <span className="text-xs text-gray-500">
            💬 {pr.commentCount}
          </span>
        )}
      </div>

      {pr.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {pr.labels.slice(0, 3).map((label) => (
            <StatusBadge key={label} label={label} />
          ))}
          {pr.labels.length > 3 && (
            <span className="text-xs text-gray-500">+{pr.labels.length - 3}</span>
          )}
        </div>
      )}
    </a>
  );
}
