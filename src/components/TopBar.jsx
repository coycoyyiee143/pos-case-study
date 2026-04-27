import { useNavigate } from "react-router-dom";

function TopBar({ search, onSearchChange, cashierName }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-3 border-bottom px-4 py-3 bg-white">
      <div className="d-flex align-items-center gap-3">
        <h5 className="m-0 fw-bold">POS System</h5>
      </div>

      <div className="flex-grow-1" style={{ maxWidth: 560 }}>
        <input
          className="form-control"
          placeholder="Scan barcode or search products..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-md-block">
          <div className="text-muted small">CASHIER</div>
          <div className="fw-semibold">{cashierName || "-"}</div>
        </div>
        <button className="btn btn-outline-dark btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default TopBar;