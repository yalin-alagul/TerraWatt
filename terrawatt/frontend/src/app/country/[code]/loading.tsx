export default function CountryLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-slate-800 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
            <div className="h-5 w-24 bg-slate-800 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="h-4 w-64 bg-slate-800 rounded animate-pulse mt-4" />
        <div className="h-4 w-96 bg-slate-800 rounded animate-pulse mt-2" />
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse mx-auto mb-4" />
          <div className="h-full bg-slate-800/50 rounded animate-pulse" />
        </div>
        <div className="h-[400px] bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="h-6 w-40 bg-slate-800 rounded animate-pulse mx-auto mb-4" />
          <div className="h-full bg-slate-800/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Insights skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
