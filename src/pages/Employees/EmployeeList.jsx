import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, deleteEmployee, exportTablePdf } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import ConfirmDialog from '../../components/ConfirmDialog';
import { SkeletonRow, SkeletonCard } from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

function DeptBadge({ dept }) {
  const colors = {
    Engineering: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    HR:          'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    Finance:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Operations:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Sales:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };
  const cls = colors[dept] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {dept}
    </span>
  );
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [exporting, setExporting] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 400);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployees(debouncedSearch);
      setEmployees(res.data);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmployee(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      fetchEmployees();
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportTablePdf(debouncedSearch);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {loading ? 'Loading…' : `${employees.length} record${employees.length !== 1 ? 's' : ''}${debouncedSearch ? ` matching "${debouncedSearch}"` : ''}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportPdf}
            disabled={exporting || loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {exporting ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            {exporting ? 'Exporting…' : 'Export PDF'}
          </button>
          {isAdmin && (
            <Link
              to="/dashboard/employees/add"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Employee
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 relative max-w-md">
        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, NID, or department…"
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Desktop table ─────────────────────────── */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80">
            <tr>
              {['#', 'Name', 'NID', 'Department', 'Phone', 'Salary', 'Family', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              : employees.length === 0
              ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <svg className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                      No employees found{debouncedSearch ? ` matching "${debouncedSearch}"` : ''}
                    </p>
                  </td>
                </tr>
              )
              : employees.map((emp, idx) => (
                <tr key={emp.id} className="transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                  <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <Link to={`/dashboard/employees/${emp.id}`} className="font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                      {emp.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{emp.nid}</td>
                  <td className="px-4 py-3"><DeptBadge dept={emp.department} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{emp.phone}</td>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
                    ৳{Number(emp.basicSalary).toLocaleString('en-BD')}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {emp.hasSpouse && <span className="rounded-full bg-pink-50 px-1.5 py-0.5 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400">Spouse</span>}
                      {emp.childrenCount > 0 && <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">{emp.childrenCount} child{emp.childrenCount > 1 ? 'ren' : ''}</span>}
                      {!emp.hasSpouse && emp.childrenCount === 0 && <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/dashboard/employees/${emp.id}`)} className="rounded-md px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30">View</button>
                      {isAdmin && (
                        <>
                          <button onClick={() => navigate(`/dashboard/employees/${emp.id}/edit`)} className="rounded-md px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30">Edit</button>
                          <button onClick={() => setDeleteTarget(emp)} className="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30">Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden stagger">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : employees.length === 0
          ? (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 py-14 text-center dark:border-gray-700">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No employees found{debouncedSearch ? ` matching "${debouncedSearch}"` : ''}
              </p>
            </div>
          )
          : employees.map((emp) => (
            <div
              key={emp.id}
              className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/dashboard/employees/${emp.id}`} className="block font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 truncate">
                    {emp.name}
                  </Link>
                  <p className="mt-0.5 font-mono text-xs text-gray-400 dark:text-gray-500">{emp.nid}</p>
                </div>
                <DeptBadge dept={emp.department} />
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <span className="block font-medium text-gray-400 dark:text-gray-500">Phone</span>
                  <span className="text-gray-700 dark:text-gray-200">{emp.phone}</span>
                </div>
                <div>
                  <span className="block font-medium text-gray-400 dark:text-gray-500">Salary</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">৳{Number(emp.basicSalary).toLocaleString('en-BD')}</span>
                </div>
              </div>

              {(emp.hasSpouse || emp.childrenCount > 0) && (
                <div className="mb-3 flex gap-1.5">
                  {emp.hasSpouse && <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs text-pink-600 dark:bg-pink-900/20 dark:text-pink-400">Spouse</span>}
                  {emp.childrenCount > 0 && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">{emp.childrenCount} child{emp.childrenCount > 1 ? 'ren' : ''}</span>}
                </div>
              )}

              <div className="flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                <Link to={`/dashboard/employees/${emp.id}`} className="flex-1 rounded-lg border border-blue-200 py-1.5 text-center text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30">
                  View
                </Link>
                {isAdmin && (
                  <>
                    <Link to={`/dashboard/employees/${emp.id}/edit`} className="flex-1 rounded-lg border border-amber-200 py-1.5 text-center text-xs font-medium text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30">
                      Edit
                    </Link>
                    <button onClick={() => setDeleteTarget(emp)} className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        }
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove their spouse and children records.`}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
