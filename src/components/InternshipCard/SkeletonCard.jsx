// Placeholder card shown while the internship data is loading. Mirrors the real
// card's layout so the page doesn't jump when content arrives.
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-card p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-2/5 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-14 w-14 rounded-md bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-5 flex gap-6">
        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-4 h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export default SkeletonCard;
