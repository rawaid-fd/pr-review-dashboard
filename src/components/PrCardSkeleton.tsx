export function PrCardSkeleton() {
  return (
    <div className="rounded-lg bg-gray-800 p-3 border border-gray-700 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 w-8 bg-gray-700 rounded" />
        <div className="h-3 w-12 bg-gray-700 rounded" />
      </div>
      <div className="mt-2 h-4 w-full bg-gray-700 rounded" />
      <div className="mt-1 h-4 w-3/4 bg-gray-700 rounded" />
      <div className="mt-2 flex gap-2 items-center">
        <div className="h-4 w-4 bg-gray-700 rounded-full" />
        <div className="h-3 w-16 bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-700 rounded" />
      </div>
    </div>
  );
}
