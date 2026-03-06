import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function SunIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

export default function AuthLayout() {
  const { dark, toggle } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-800/20" />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute right-4 top-4 rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-white dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="relative w-full max-w-sm animate-slide-up">
        <Outlet />
      </div>
    </div>
  );
}
