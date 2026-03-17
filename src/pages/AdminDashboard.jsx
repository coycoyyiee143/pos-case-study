import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const loadData = useCallback(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    setTotalUsers(users.length);
    setTotalProducts(products.length);
    setTotalTransactions(transactions.length);

    const sales = transactions
      .filter((t) => t.status === "Completed")
      .reduce((sum, t) => sum + t.total, 0);
    setTotalSales(sales);

    const sorted = [...transactions].sort((a, b) => b.id - a.id);
    setRecentTransactions(sorted.slice(0, 5));
  }, []);

  useEffect(() => {
    loadData();
    // Listen for updates dispatched by the cashier pay button
    window.addEventListener("pos-data-update", loadData);
    return () => window.removeEventListener("pos-data-update", loadData);
  }, [loadData]);

  const statusBadge = (status) => {
    const map = {
      Completed: "bg-success",
      Cancelled: "bg-danger",
      PostVoid: "bg-warning text-dark",
    };
    return (
      <span className={`badge ${map[status] || "bg-secondary"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <AdminSidebar />

      <div
        className="flex-grow-1 p-4"
        style={{ background: "#f0f2f5", minHeight: "100vh" }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-0 fw-bold">Administrator Dashboard</h4>
            <small className="text-muted">Overview of your POS system</small>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={loadData}>
            ↻ Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: 56, height: 56, background: "#4361ee", fontSize: 24, flexShrink: 0 }}
                >
                  🙍
                </div>
                <div>
                  <div className="text-muted small">Total Users</div>
                  <div className="fw-bold fs-3 lh-1">{totalUsers}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: 56, height: 56, background: "#3a86ff", fontSize: 24, flexShrink: 0 }}
                >
                  📦
                </div>
                <div>
                  <div className="text-muted small">Total Products</div>
                  <div className="fw-bold fs-3 lh-1">{totalProducts}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: 56, height: 56, background: "#2ec4b6", fontSize: 24, flexShrink: 0 }}
                >
                  💰
                </div>
                <div>
                  <div className="text-muted small">Total Sales</div>
                  <div className="fw-bold fs-3 lh-1">₱{totalSales.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: 56, height: 56, background: "#e76f51", fontSize: 24, flexShrink: 0 }}
                >
                  🧾
                </div>
                <div>
                  <div className="text-muted small">Transactions</div>
                  <div className="fw-bold fs-3 lh-1">{totalTransactions}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 pt-3 pb-2 px-4">
            <h6 className="fw-bold mb-0">Recent Transactions</h6>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Cashier</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="pe-4 text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((t) => (
                    <tr key={t.id}>
                      <td className="ps-4 text-muted">#{t.id}</td>
                      <td>{t.cashier}</td>
                      <td>{statusBadge(t.status)}</td>
                      <td className="text-muted">{t.date}</td>
                      <td className="pe-4 text-end fw-semibold">
                        ₱{t.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-muted py-4"
                    >
                      No transactions recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;