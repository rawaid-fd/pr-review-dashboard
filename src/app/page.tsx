import { ReviewQueue } from "@/components/ReviewQueue";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Review Queue</h1>
          <p className="text-sm text-gray-400 mt-1">
            Open PRs across fanduel org requesting your review
          </p>
        </div>
        <span className="text-xs text-gray-600">auto-refreshes every 5 min</span>
      </header>
      <ReviewQueue />
    </main>
  );
}
