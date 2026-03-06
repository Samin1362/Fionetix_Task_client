import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

/* ── Icons ─────────────────────────────────────── */
const SunIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);
const MoonIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);
const MenuIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

function UserAvatar({ user, size = 'sm' }) {
  const [imgError, setImgError] = useState(false);
  const dim = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm';
  const initials = (user?.displayName ?? user?.email ?? '?').charAt(0).toUpperCase();

  if (user?.photoURL && !imgError) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName ?? user.email}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setImgError(true)}
        className={`${dim} shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-gray-700`}
      />
    );
  }
  return (
    <div className={`${dim} shrink-0 flex items-center justify-center rounded-full bg-blue-600 font-bold text-white`}>
      {initials}
    </div>
  );
}

/* ── Desktop sidebar content ────────────────────── */
function DesktopSidebar({ collapsed }) {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 ${collapsed ? 'justify-center px-3 py-5' : 'gap-3 px-5 py-5'}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow">
          F
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-gray-900 dark:text-white">Fionetix</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Employee Registry</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Menu
          </p>
        )}
        <NavLink
          to="/dashboard/employees"
          title={collapsed ? 'Employees' : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${collapsed ? 'justify-center' : 'gap-3'} ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
            }`
          }
        >
          <UsersIcon />
          {!collapsed && <span>Employees</span>}
        </NavLink>
      </nav>

      {/* User + Logout */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div title={user?.email}>
              <UserAvatar user={user} size="sm" />
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <LogoutIcon />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg p-2">
              <UserAvatar user={user} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                  {user?.displayName ?? user?.email}
                </p>
                <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  userRole === 'Admin'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {userRole}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Mobile sidebar content ─────────────────────── */
function MobileSidebarContent({ onClose }) {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5 dark:border-gray-700">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow">F</div>
        <div className="min-w-0">
          <h1 className="text-base font-bold leading-tight text-gray-900 dark:text-white">Fionetix</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">Employee Registry</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Menu</p>
        <NavLink
          to="/dashboard/employees"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
            }`
          }
        >
          <UsersIcon />
          Employees
        </NavLink>
      </nav>
      <div className="border-t border-gray-200 p-3 dark:border-gray-700 space-y-2">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <UserAvatar user={user} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">
              {user?.displayName ?? user?.email}
            </p>
            <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              userRole === 'Admin'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}>{userRole}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
  );
}

/* ── Main layout ────────────────────────────────── */
export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Desktop sidebar ────────────────────────── */}
      <aside
        className={`relative hidden shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900 lg:flex ${
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        <DesktopSidebar collapsed={collapsed} />

        {/* Collapse toggle button on the sidebar edge */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </aside>

      {/* ── Mobile overlay ─────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 animate-fade-in lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ──────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-900 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-700">
          <span className="font-bold text-gray-900 dark:text-white">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MobileSidebarContent onClose={() => setMobileOpen(false)} />
        </div>
      </aside>

      {/* ── Main content area ──────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ── Top bar (always visible) ───────────────── */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            {/* Desktop: sidebar collapse toggle */}
            <button
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:flex"
            >
              <MenuIcon />
            </button>

            {/* Mobile: open drawer */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
            >
              <MenuIcon />
            </button>

            {/* Mobile brand */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">F</div>
              <span className="font-semibold text-gray-900 dark:text-white">Fionetix</span>
            </div>
          </div>

          {/* Right side: dark mode toggle + user avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <div title={user?.displayName ?? user?.email}>
              <UserAvatar user={user} size="sm" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
