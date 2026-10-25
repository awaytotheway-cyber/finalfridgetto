/** Skeleton shown while the shop page streams in. */
export default function ShopLoading() {
  return (
    <div className="container-page pb-8 pt-10 md:pt-16" aria-busy="true" aria-label="Loading products">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton mt-5 h-14 w-80 max-w-full rounded-xl" />
      <div className="skeleton mt-5 h-5 w-[28rem] max-w-full rounded-full" />
      <div className="mt-10 flex gap-2 border-b border-line pb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-11 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-14 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5] rounded-[var(--radius-card)]" />
            <div className="skeleton mt-5 h-3 w-32 rounded-full" />
            <div className="skeleton mt-3 h-5 w-48 rounded-full" />
            <div className="skeleton mt-3 h-4 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
