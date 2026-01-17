export default function ProductPageSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10 pt-24 p-6">
      <div className="h-[450px] bg-gray-200 rounded-xl"></div>

      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>

        <div className="h-24 bg-gray-200 rounded"></div>

        <div className="h-12 bg-gray-300 rounded w-1/2"></div>
        <div className="h-12 bg-gray-300 rounded w-3/5"></div>
      </div>
    </div>
  );
}