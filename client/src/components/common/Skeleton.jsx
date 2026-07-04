const Skeleton = ({ className = '', variant = 'rect', lines = 1 }) => {
  if (variant === 'circle') {
    return <div className={`skeleton rounded-full ${className}`} />;
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`}
          />
        ))}
      </div>
    );
  }

  return <div className={`skeleton ${className}`} />;
};

/**
 * Pre-built skeleton for vehicle cards.
 */
export const VehicleCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

/**
 * Pre-built skeleton for stat cards.
 */
export const StatCardSkeleton = () => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-12 w-12 rounded-xl" variant="rect" />
    </div>
  </div>
);

export default Skeleton;
