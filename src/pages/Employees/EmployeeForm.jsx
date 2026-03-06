import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getEmployee, createEmployee, updateEmployee,
  upsertSpouse, deleteSpouse,
  addChild, updateChild, deleteChild,
} from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const NID_REGEX = /^(\d{10}|\d{17})$/;
const PHONE_REGEX = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;

function validateEmployee(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!NID_REGEX.test(data.nid)) errors.nid = 'NID must be 10 or 17 digits';
  if (!PHONE_REGEX.test(data.phone)) errors.phone = 'Invalid Bangladesh phone number';
  if (!data.department?.trim()) errors.department = 'Department is required';
  if (!data.basicSalary || Number(data.basicSalary) <= 0) errors.basicSalary = 'Salary must be greater than 0';
  return errors;
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {hint && <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError) {
  return `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700/50 dark:text-white ${
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20 dark:border-red-500'
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:focus:border-blue-400'
  }`;
}

function SectionCard({ title, icon, action, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {icon}
          </span>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({ name: '', nid: '', phone: '', department: '', basicSalary: '' });
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouse, setSpouse] = useState({ name: '', nid: '' });
  const [originalSpouseId, setOriginalSpouseId] = useState(null);
  const [children, setChildren] = useState([]);
  const [originalChildIds, setOriginalChildIds] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getEmployee(id);
        const emp = res.data;
        setForm({ name: emp.name, nid: emp.nid, phone: emp.phone, department: emp.department, basicSalary: emp.basicSalary });
        if (emp.spouse) {
          setHasSpouse(true);
          setSpouse({ name: emp.spouse.name, nid: emp.spouse.nid || '' });
          setOriginalSpouseId(emp.spouse.id);
        }
        if (emp.children?.length) {
          setChildren(emp.children.map(c => ({ id: c.id, name: c.name, dateOfBirth: c.dateOfBirth })));
          setOriginalChildIds(emp.children.map(c => c.id));
        }
      } catch {
        toast.error('Failed to load employee');
        navigate('/dashboard/employees');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmployee(form);
    if (hasSpouse && !spouse.name.trim()) validationErrors.spouseName = 'Spouse name is required';
    if (hasSpouse && spouse.nid && !NID_REGEX.test(spouse.nid)) validationErrors.spouseNid = 'Spouse NID must be 10 or 17 digits';
    children.forEach((c, i) => {
      if (!c.name.trim()) validationErrors[`child_${i}_name`] = `Child ${i + 1} name is required`;
      if (!c.dateOfBirth) validationErrors[`child_${i}_dob`] = `Child ${i + 1} date of birth is required`;
      else if (new Date(c.dateOfBirth) > new Date()) validationErrors[`child_${i}_dob`] = `Child ${i + 1} DoB cannot be in the future`;
    });

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name: form.name.trim(), nid: form.nid.trim(), phone: form.phone.trim(), department: form.department.trim(), basicSalary: Number(form.basicSalary) };
      let empId = id;

      if (isEdit) {
        await updateEmployee(id, payload);
      } else {
        const res = await createEmployee(payload);
        empId = res.data.id;
      }

      if (hasSpouse) {
        await upsertSpouse(empId, { name: spouse.name.trim(), nid: spouse.nid.trim() || null });
      } else if (isEdit && originalSpouseId) {
        await deleteSpouse(empId);
      }

      if (isEdit) {
        const currentChildIds = children.filter(c => c.id).map(c => c.id);
        for (const cid of originalChildIds.filter(oid => !currentChildIds.includes(oid))) {
          await deleteChild(empId, cid);
        }
        for (const child of children) {
          if (child.id) await updateChild(empId, child.id, { name: child.name.trim(), dateOfBirth: child.dateOfBirth });
          else await addChild(empId, { name: child.name.trim(), dateOfBirth: child.dateOfBirth });
        }
      } else {
        for (const child of children) {
          await addChild(empId, { name: child.name.trim(), dateOfBirth: child.dateOfBirth });
        }
      }

      toast.success(isEdit ? 'Employee updated!' : 'Employee created!');
      navigate(`/dashboard/employees/${empId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.title || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const personIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
  const heartIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
  const kidsIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );

  return (
    <div className="mx-auto max-w-2xl animate-slide-up">
      <Link to="/dashboard/employees" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Employees
      </Link>

      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Employee Details */}
        <SectionCard title="Employee Details" icon={personIcon}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name" error={errors.name}>
              <input type="text" value={form.name} onChange={e => handleFormChange('name', e.target.value)} className={inputCls(errors.name)} placeholder="e.g. Md. Hasan Ali" />
            </Field>
            <Field label="NID" hint="10 or 17 digits" error={errors.nid}>
              <input type="text" value={form.nid} onChange={e => handleFormChange('nid', e.target.value)} className={inputCls(errors.nid)} placeholder="1234567890" />
            </Field>
            <Field label="Phone" hint="BD format" error={errors.phone}>
              <input type="text" value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} className={inputCls(errors.phone)} placeholder="01712345678" />
            </Field>
            <Field label="Department" error={errors.department}>
              <input type="text" value={form.department} onChange={e => handleFormChange('department', e.target.value)} className={inputCls(errors.department)} placeholder="e.g. Engineering" />
            </Field>
            <Field label="Basic Salary" hint="BDT" error={errors.basicSalary}>
              <input type="number" min="1" step="any" value={form.basicSalary} onChange={e => handleFormChange('basicSalary', e.target.value)} className={inputCls(errors.basicSalary)} placeholder="45000" />
            </Field>
          </div>
        </SectionCard>

        {/* Spouse */}
        <SectionCard title="Spouse" icon={heartIcon} action={
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{hasSpouse ? 'Added' : 'Add'}</span>
            <div
              onClick={() => setHasSpouse(v => !v)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${hasSpouse ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${hasSpouse ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </label>
        }>
          {hasSpouse ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Spouse Name" error={errors.spouseName}>
                <input type="text" value={spouse.name} onChange={e => setSpouse(s => ({ ...s, name: e.target.value }))} className={inputCls(errors.spouseName)} />
              </Field>
              <Field label="Spouse NID" hint="optional" error={errors.spouseNid}>
                <input type="text" value={spouse.nid} onChange={e => setSpouse(s => ({ ...s, nid: e.target.value }))} className={inputCls(errors.spouseNid)} />
              </Field>
            </div>
          ) : (
            <p className="text-sm italic text-gray-400 dark:text-gray-500">Toggle to add spouse information</p>
          )}
        </SectionCard>

        {/* Children */}
        <SectionCard title={`Children${children.length > 0 ? ` (${children.length})` : ''}`} icon={kidsIcon} action={
          <button type="button" onClick={() => setChildren(prev => [...prev, { name: '', dateOfBirth: '' }])} className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Child
          </button>
        }>
          {children.length === 0 ? (
            <p className="text-sm italic text-gray-400 dark:text-gray-500">No children added yet</p>
          ) : (
            <div className="space-y-3">
              {children.map((child, idx) => (
                <div key={idx} className="group relative rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/30">
                  <button
                    type="button"
                    onClick={() => setChildren(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute right-3 top-3 rounded-md p-1 text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-gray-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <p className="mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500">Child {idx + 1}</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Name" error={errors[`child_${idx}_name`]}>
                      <input type="text" value={child.name} onChange={e => setChildren(prev => prev.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))} className={inputCls(errors[`child_${idx}_name`])} />
                    </Field>
                    <Field label="Date of Birth" error={errors[`child_${idx}_dob`]}>
                      <input type="date" value={child.dateOfBirth} onChange={e => setChildren(prev => prev.map((c, i) => i === idx ? { ...c, dateOfBirth: e.target.value } : c))} className={inputCls(errors[`child_${idx}_dob`])} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-4">
          <Link to="/dashboard/employees" className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {submitting ? 'Saving…' : isEdit ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
