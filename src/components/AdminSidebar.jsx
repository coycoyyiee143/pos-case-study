import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{ width: "220px", height: "100vh" }}
    >
      <h5 className="mb-4">Admin Panel</h5>

      <button
        className="btn btn-dark text-start mb-2"
        onClick={() => navigate("/admin")}
      >
        Dashboard
      </button>

      <button
        className="btn btn-dark text-start mb-2"
        onClick={() => navigate("/products")}
      >
        Products
      </button>

      <button
        className="btn btn-dark text-start mb-2"
        onClick={() => navigate("/users")}
      >
        Users
      </button>

      <button
        className="btn btn-dark text-start mb-2"
        onClick={() => navigate("/logs")}
      >
        Audit Logs
      </button>

      <button
        className="btn btn-dark text-start mb-2"
        onClick={() => navigate("/reports")}
      >
        Reports
      </button>

      <div className="mt-auto">
        <button
          className="btn btn-outline-light w-100"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;