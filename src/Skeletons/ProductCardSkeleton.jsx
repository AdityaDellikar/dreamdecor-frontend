export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded mt-3"></div>
      </div>
    </div>
  );
}