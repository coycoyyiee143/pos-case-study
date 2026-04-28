import Login from "./pages/Login";
import CashierDashboard from "./pages/CashierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import Reports from "./pages/Reports";

import ProtectedRoute from "./ProtectedRoute";

const routes = [
  { path: "/", element: <Login /> },

  {
    path: "/cashier",
    element: (
      <ProtectedRoute role="cashier">
        <CashierDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/products",
    element: (
      <ProtectedRoute role="admin">
        <ProductManagement />
      </ProtectedRoute>
    ),
  },

  {
    path: "/users",
    element: (
      <ProtectedRoute role="admin">
        <UserManagement />
      </ProtectedRoute>
    ),
  },

  {
    path: "/logs",
    element: (
      <ProtectedRoute role="supervisor">
        <AuditLogs />
      </ProtectedRoute>
    ),
  },

  {
    path: "/reports",
    element: (
      <ProtectedRoute role="admin">
        <Reports />
      </ProtectedRoute>
    ),
  },
];

export default routes;