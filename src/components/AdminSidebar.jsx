import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const currentUser = (() => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();

  const displayName = currentUser?.username || "John Doe";
  const role = currentUser?.role || "Administrator";
  const initials = String(displayName)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "JD";

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6.5 10.5h11a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V12.5a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M8 10V7.8A3.8 3.8 0 0 1 11.8 4h.4A3.8 3.8 0 0 1 16 7.8V10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M9 16h6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div className="admin-sidebar__brand-title">POS Admin</div>
          <div className="admin-sidebar__brand-subtitle">Management System</div>
        </div>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        <NavLink to="/admin" className="admin-nav-link">
          <span className="admin-nav-link__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 13.2V21h6v-5h4v5h6v-7.8a2 2 0 0 0-.7-1.5l-7-6a2 2 0 0 0-2.6 0l-7 6A2 2 0 0 0 4 13.2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/products" className="admin-nav-link">
          <span className="admin-nav-link__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 7h10v14H7V7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9 3h6v4H9V3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Products</span>
        </NavLink>

        <NavLink to="/users" className="admin-nav-link">
          <span className="admin-nav-link__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M4 21a8 8 0 0 1 16 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>Users</span>
        </NavLink>

        <NavLink to="/reports" className="admin-nav-link">
          <span className="admin-nav-link__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M8 17v-6M12 17V7M16 17v-3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-user">
          <div className="admin-user__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="admin-user__meta">
            <div className="admin-user__name">{displayName}</div>
            <div className="admin-user__role">{role}</div>
          </div>
          <button
            type="button"
            className="admin-user__logout"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 7V6a2 2 0 0 1 2-2h7v16h-7a2 2 0 0 1-2-2v-1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M13 12H3m0 0 3-3m-3 3 3 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;