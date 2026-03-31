interface StatusBadgeProps {
  label: string;
  variant?: "label" | "draft" | "age";
}

const ageColor = (label: string) => {
  const days = parseInt(label);
  if (days >= 7) return "bg-red-900 text-red-300";
  if (days >= 3) return "bg-yellow-900 text-yellow-300";
  return "bg-gray-700 text-gray-300";
};

export function StatusBadge({ label, variant = "label" }: StatusBadgeProps) {
  const base = "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium";

  if (variant === "draft") {
    return <span className={`${base} bg-gray-700 text-gray-400`}>Draft</span>;
  }

  if (variant === "age") {
    return <span className={`${base} ${ageColor(label)}`}>{label}d old</span>;
  }

  return <span className={`${base} bg-gray-700 text-gray-300`}>{label}</span>;
}
