export default function PageSkeleton() {
  return (
    <div className="space-y-4 p-1">
      <div className="h-10 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="hidden h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 xl:block" />
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 md:block">
        <div className="h-11 animate-pulse bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-2 p-3">
          <div className="h-9 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-9 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-9 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-9 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        <div className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
