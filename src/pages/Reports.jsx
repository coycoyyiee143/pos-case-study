import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

function Reports() {
  const [period, setPeriod]       = useState("daily");
  const [transactions, setTrans]  = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  // Fetch ALL transactions from the existing TransactionController
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    // per_page=1000 to get all; adjust if you have pagination needs
    fetch(`${API_BASE}/transactions?per_page=1000`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // Laravel paginate() wraps rows in { data: [...] }
        setTrans(json.data ?? json ?? []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // ── Derive everything from the fetched transactions ──────────────────────

  // Only count non-voided
  const completed = transactions.filter((t) => t.status !== "voided");

  // Group by day or month
  const grouped = {};
  completed.forEach((t) => {
    const date = t.created_at?.slice(0, 10) ?? t.date?.slice(0, 10);
    if (!date) return;
    const key = period === "monthly" ? date.slice(0, 7) : date;
    if (!grouped[key]) grouped[key] = { label: key, total_transactions: 0, total_sales: 0 };
    grouped[key].total_transactions += 1;
    grouped[key].total_sales += Number(t.total_amount) || 0;
  });
  const summary = Object.values(grouped).sort((a, b) => b.label.localeCompare(a.label));

  // KPI totals (scoped to current day or month)
  const todayKey   = new Date().toISOString().slice(0, 10);
  const monthKey   = todayKey.slice(0, 7);
  const scopeKey   = period === "daily" ? todayKey : monthKey;
  const scoped     = completed.filter((t) => {
    const date = t.created_at?.slice(0, 10) ?? t.date?.slice(0, 10) ?? "";
    return period === "monthly" ? date.startsWith(monthKey) : date === todayKey;
  });
  const totalSales        = scoped.reduce((s, t) => s + (Number(t.total_amount) || 0), 0);
  const totalTransactions = scoped.length;

  // Top 5 products (scoped to same period)
  const productMap = {};
  scoped.forEach((t) => {
    (t.items ?? []).forEach((item) => {
      const name = item.product?.name ?? `Product #${item.product_id}`;
      if (!productMap[name]) productMap[name] = { name, total_quantity: 0, total_revenue: 0 };
      productMap[name].total_quantity += Number(item.quantity) || 0;
      productMap[name].total_revenue  += Number(item.subtotal)  || 0;
    });
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 5);

  return (
    <div className="d-flex">
      <AdminSidebar />
      <main className="flex-grow-1 p-4 bg-light min-vh-100">
        <h4 className="fw-bold mb-4">Sales Reports</h4>

        {/* Period toggle */}
        <div className="mb-4">
          <div className="btn-group">
            {["daily", "monthly"].map((p) => (
              <button
                key={p}
                className={`btn btn-sm ${period === p ? "btn-dark" : "btn-outline-secondary"}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {/* KPI cards — scoped to today or this month */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted small mb-1">
                  Total Sales ({period === "daily" ? "Today" : "This Month"})
                </p>
                <h5 className="fw-bold text-success mb-0">₱{totalSales.toFixed(2)}</h5>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted small mb-1">
                  Transactions ({period === "daily" ? "Today" : "This Month"})
                </p>
                <h5 className="fw-bold mb-0">{totalTransactions}</h5>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted small mb-1">Avg per Transaction</p>
                <h5 className="fw-bold mb-0">
                  ₱{totalTransactions ? (totalSales / totalTransactions).toFixed(2) : "0.00"}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {/* Sales breakdown table — all time, grouped */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-0">
                <h6 className="fw-semibold">
                  {period === "monthly" ? "Monthly" : "Daily"} Breakdown
                </h6>
              </div>
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
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4">
                          <span className="spinner-border spinner-border-sm me-2" />
                          Loading…
                        </td>
                      </tr>
                    ) : summary.length === 0 ? (
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
                            ₱{row.total_sales.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top products */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-0">
                <h6 className="fw-semibold">
                  Top Products&nbsp;
                  <span className="text-muted fw-normal small">
                    ({period === "daily" ? "Today" : "This Month"})
                  </span>
                </h6>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th className="text-end">Qty Sold</th>
                      <th className="text-end">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-4">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      topProducts.map((p, i) => (
                        <tr key={p.name}>
                          <td className="text-muted">{i + 1}</td>
                          <td>{p.name}</td>
                          <td className="text-end">{p.total_quantity}</td>
                          <td className="text-end fw-semibold text-success">
                            ₱{p.total_revenue.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reports;