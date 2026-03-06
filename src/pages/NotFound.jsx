import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="text-center animate-slide-up">
        <p className="text-8xl font-black text-gray-100 dark:text-gray-800">404</p>
        <div className="-mt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist.</p>
          <Link
            to="/dashboard/employees"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
