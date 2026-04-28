import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import transactions from "../data/transactions";

function Reports() {
  const [period, setPeriod] = useState("daily");
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    // For now, compute from localStorage/dummy data
    // Later: replace with fetch("/api/reports/sales-summary?period=" + period)
    const stored = JSON.parse(localStorage.getItem("transactions") || "[]");
    const completed = stored.filter((t) => t.status === "completed");

    const grouped = {};
    completed.forEach((t) => {
      const key =
        period === "monthly"
          ? t.date?.slice(0, 7)
          : t.date?.slice(0, 10);
      if (!key) return;
      if (!grouped[key]) grouped[key] = { label: key, total_transactions: 0, total_sales: 0 };
      grouped[key].total_transactions += 1;
      grouped[key].total_sales += Number(t.total_amount) || 0;
    });

    setSummary(Object.values(grouped).reverse());
  }, [period]);

  return (
    <div className="d-flex">
      <AdminSidebar />
      <main className="flex-grow-1 p-4 bg-light min-vh-100">
        <h4 className="fw-bold mb-4">Sales Reports</h4>

        {/* Period toggle */}
        <div className="mb-4">
          <div className="btn-group">
            <button
              className={`btn btn-sm ${period === "daily" ? "btn-dark" : "btn-outline-secondary"}`}
              onClick={() => setPeriod("daily")}
            >
              Daily
            </button>
            <button
              className={`btn btn-sm ${period === "monthly" ? "btn-dark" : "btn-outline-secondary"}`}
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Summary table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>{period === "monthly" ? "Month" : "Date"}</th>
                  <th className="text-end">Transactions</th>
                  <th className="text-end">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {summary.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">
                      No data available
                    </td>
                  </tr>
                ) : (
                  summary.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td className="text-end">{row.total_transactions}</td>
                      <td className="text-end fw-semibold text-success">
                        ₱{Number(row.total_sales).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reports;