import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="p-4 flex-grow-1">
        <h3>Administrator Dashboard</h3>
        <p>Manage products, users, and system settings.</p>
      </div>

    </div>
  );
}

export default AdminDashboard;