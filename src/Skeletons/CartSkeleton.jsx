export default function CartSkeleton() {
  return (
    <div className="pt-24 animate-pulse p-6">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}