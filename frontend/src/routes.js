import Login from "./pages/Login";
import CashierDashboard from "./pages/CashierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import Reports from "./pages/Reports";

const routes = [
  { path: "/", element: <Login /> },
  { path: "/cashier", element: <CashierDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/products", element: <ProductManagement /> },
  { path: "/users", element: <UserManagement /> },
  { path: "/logs", element: <AuditLogs /> },
  { path: "/reports", element: <Reports /> }
];

export default routes;