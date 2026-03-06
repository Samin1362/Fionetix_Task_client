import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase.init';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const getMe = () => api.get('/api/auth/me');

// --- Employees ---
export const getEmployees = (search = '') =>
  api.get('/api/employees', { params: search ? { search } : {} });

export const getEmployee = (id) => api.get(`/api/employees/${id}`);

export const createEmployee = (data) => api.post('/api/employees', data);

export const updateEmployee = (id, data) => api.put(`/api/employees/${id}`, data);

export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`);

// --- Spouse ---
export const upsertSpouse = (employeeId, data) =>
  api.put(`/api/employees/${employeeId}/spouse`, data);

export const deleteSpouse = (employeeId) =>
  api.delete(`/api/employees/${employeeId}/spouse`);

// --- Children ---
export const addChild = (employeeId, data) =>
  api.post(`/api/employees/${employeeId}/children`, data);

export const updateChild = (employeeId, childId, data) =>
  api.put(`/api/employees/${employeeId}/children/${childId}`, data);

export const deleteChild = (employeeId, childId) =>
  api.delete(`/api/employees/${employeeId}/children/${childId}`);

// --- PDF Export ---
export const exportTablePdf = async (search = '') => {
  const response = await api.get('/api/export/pdf-list', {
    params: search ? { search } : {},
    responseType: 'blob',
  });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employees.pdf';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportCvPdf = async (id) => {
  const response = await api.get(`/api/export/cv/${id}`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `employee_cv_${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

export default api;
