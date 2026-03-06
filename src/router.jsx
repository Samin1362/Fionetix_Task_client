import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Auth/Login';
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import EmployeeForm from './pages/Employees/EmployeeForm';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard/employees" replace />,
      },
      {
        path: '/login',
        element: <AuthLayout />,
        children: [{ index: true, element: <Login /> }],
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="employees" replace /> },
          { path: 'employees', element: <EmployeeList /> },
          { path: 'employees/add', element: <AdminRoute><EmployeeForm /></AdminRoute> },
          { path: 'employees/:id', element: <EmployeeDetail /> },
          { path: 'employees/:id/edit', element: <AdminRoute><EmployeeForm /></AdminRoute> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
