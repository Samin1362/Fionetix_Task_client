export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-500 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <td key={i} className="px-4 py-3">
          <div className={`h-3.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-skeleton ${i === 1 ? 'w-6' : i === 2 ? 'w-32' : i === 6 ? 'w-20 ml-auto' : 'w-24'}`} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 h-4 w-36 rounded-full bg-gray-200 dark:bg-gray-700 animate-skeleton" />
      <div className="mb-2 h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-skeleton" />
      <div className="h-3 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-skeleton" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-950/80">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-gray-700" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Authenticating...</p>
      </div>
    </div>
  );
}
