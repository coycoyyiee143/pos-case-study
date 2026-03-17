import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [urgentLowStockCount, setUrgentLowStockCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [salesDeltaPct, setSalesDeltaPct] = useState(null);
  const [transactionsDeltaPct, setTransactionsDeltaPct] = useState(null);
  const [activeCashiers, setActiveCashiers] = useState(0);
  const [activeCashiersDeltaPct, setActiveCashiersDeltaPct] = useState(null);

  const loadData = useCallback(() => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    setTotalTransactions(transactions.length);
    const low = products.filter((p) => Number(p.stock) <= 10).length;
    const urgent = products.filter((p) => Number(p.stock) <= 5).length;
    setLowStockCount(low);
    setUrgentLowStockCount(urgent);

    const sales = transactions
      .filter((t) => t.status === "Completed")
      .reduce((sum, t) => sum + t.total, 0);
    setTotalSales(sales);

    const sorted = [...transactions].sort((a, b) => b.id - a.id);
    setRecentTransactions(sorted.slice(0, 5));

    const toDate = (tx) => {
      const raw = tx?.date;
      if (!raw) return null;
      const d = new Date(raw);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const now = new Date();
    const DAY_MS = 24 * 60 * 60 * 1000;
    const window30Start = new Date(now.getTime() - 30 * DAY_MS);
    const window60Start = new Date(now.getTime() - 60 * DAY_MS);
    const window7Start = new Date(now.getTime() - 7 * DAY_MS);
    const window14Start = new Date(now.getTime() - 14 * DAY_MS);

    const completed = transactions.filter((t) => t.status === "Completed");

    const sumSales = (list) => list.reduce((sum, t) => sum + (Number(t.total) || 0), 0);
    const pctChange = (curr, prev) => {
      const c = Number(curr) || 0;
      const p = Number(prev) || 0;
      if (p === 0 && c === 0) return 0;
      if (p === 0) return null;
      return ((c - p) / p) * 100;
    };

    const salesCurr30 = sumSales(
      completed.filter((t) => {
        const d = toDate(t);
        return d && d >= window30Start && d <= now;
      })
    );
    const salesPrev30 = sumSales(
      completed.filter((t) => {
        const d = toDate(t);
        return d && d >= window60Start && d < window30Start;
      })
    );
    setSalesDeltaPct(pctChange(salesCurr30, salesPrev30));

    const txCurr30 = transactions.filter((t) => {
      const d = toDate(t);
      return d && d >= window30Start && d <= now;
    }).length;
    const txPrev30 = transactions.filter((t) => {
      const d = toDate(t);
      return d && d >= window60Start && d < window30Start;
    }).length;
    setTransactionsDeltaPct(pctChange(txCurr30, txPrev30));

    const uniqCashiers = (list) =>
      new Set(
        list
          .map((t) => String(t.cashier ?? "").trim().toLowerCase())
          .filter(Boolean)
      ).size;

    const active7 = uniqCashiers(
      completed.filter((t) => {
        const d = toDate(t);
        return d && d >= window7Start && d <= now;
      })
    );
    const prev7 = uniqCashiers(
      completed.filter((t) => {
        const d = toDate(t);
        return d && d >= window14Start && d < window7Start;
      })
    );

    setActiveCashiers(active7);
    setActiveCashiersDeltaPct(pctChange(active7, prev7));
  }, []);

  useEffect(() => {
    loadData();
    // Listen for updates dispatched by the cashier pay button
    window.addEventListener("pos-data-update", loadData);
    return () => window.removeEventListener("pos-data-update", loadData);
  }, [loadData]);

  const formatAmount = (value) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
      Number(value) || 0
    );

  const formatPct = (value) => {
    if (value === null || value === undefined) return "—";
    const v = Number(value);
    if (Number.isNaN(v)) return "—";
    const sign = v > 0 ? "+" : "";
    return `${sign}${v.toFixed(1)}%`;
  };

  const getInitials = (name) =>
    String(name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "JD";

  const statusPill = (status) => {
    const normalized =
      status === "Cancelled" ? "Refunded" : status === "PostVoid" ? "Pending" : status;

    const className =
      normalized === "Completed"
        ? "admin-pill admin-pill--success"
        : normalized === "Pending"
          ? "admin-pill admin-pill--warning"
          : normalized === "Refunded"
            ? "admin-pill admin-pill--danger"
            : "admin-pill admin-pill--muted";

    return <span className={className}>{normalized}</span>;
  };

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return recentTransactions;
    return recentTransactions.filter((t) => {
      const id = String(t.id ?? "").toLowerCase();
      const cashier = String(t.cashier ?? "").toLowerCase();
      const status = String(t.status ?? "").toLowerCase();
      const amount = String(t.total ?? "").toLowerCase();
      return (
        id.includes(q) ||
        cashier.includes(q) ||
        status.includes(q) ||
        amount.includes(q)
      );
    });
  }, [recentTransactions, searchQuery]);

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__title">
            <div className="admin-page-title">Dashboard Overview</div>
          </div>

          <div className="admin-topbar__actions">
            <div className="admin-search">
              <span className="admin-search__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                className="admin-search__input"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button type="button" className="admin-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22a2.4 2.4 0 0 0 2.4-2.4H9.6A2.4 2.4 0 0 0 12 22Z"
                  fill="currentColor"
                  opacity="0.25"
                />
                <path
                  d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" className="admin-icon-btn" aria-label="Help">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Refresh"
              title="Refresh"
              onClick={loadData}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 12a8 8 0 1 1-2.3-5.7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M20 4v6h-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="admin-kpis">
          <div className="admin-kpi">
            <div className="admin-kpi__meta">
              <div className="admin-kpi__label">Total Sales</div>
              <div className="admin-kpi__value">{formatAmount(totalSales)}</div>
              <div
                className={`admin-kpi__delta ${
                  salesDeltaPct !== null && salesDeltaPct < 0
                    ? "admin-kpi__delta--down"
                    : "admin-kpi__delta--up"
                }`}
              >
                <span aria-hidden="true">
                  {salesDeltaPct !== null && salesDeltaPct < 0 ? "↘" : "↗"}
                </span>{" "}
                {formatPct(salesDeltaPct)}{" "}
                <span className="admin-kpi__delta-sub">vs previous 30 days</span>
              </div>
            </div>
            <div className="admin-kpi__icon admin-kpi__icon--blue" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 10h10v10H7V10Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 10V7a3 3 0 0 1 6 0v3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="admin-kpi">
            <div className="admin-kpi__meta">
              <div className="admin-kpi__label">Total Transactions</div>
              <div className="admin-kpi__value">{totalTransactions.toLocaleString()}</div>
              <div
                className={`admin-kpi__delta ${
                  transactionsDeltaPct !== null && transactionsDeltaPct < 0
                    ? "admin-kpi__delta--down"
                    : "admin-kpi__delta--up"
                }`}
              >
                <span aria-hidden="true">
                  {transactionsDeltaPct !== null && transactionsDeltaPct < 0 ? "↘" : "↗"}
                </span>{" "}
                {formatPct(transactionsDeltaPct)}{" "}
                <span className="admin-kpi__delta-sub">vs previous 30 days</span>
              </div>
            </div>
            <div className="admin-kpi__icon admin-kpi__icon--slate" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 4h10v16H7V4Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8h6M9 12h6M9 16h6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="admin-kpi">
            <div className="admin-kpi__meta">
              <div className="admin-kpi__label">Active Cashiers</div>
              <div className="admin-kpi__value">{activeCashiers.toLocaleString()}</div>
              <div
                className={`admin-kpi__delta ${
                  activeCashiersDeltaPct !== null && activeCashiersDeltaPct < 0
                    ? "admin-kpi__delta--down"
                    : "admin-kpi__delta--up"
                }`}
              >
                <span aria-hidden="true">
                  {activeCashiersDeltaPct !== null && activeCashiersDeltaPct < 0 ? "↘" : "↗"}
                </span>{" "}
                {formatPct(activeCashiersDeltaPct)}{" "}
                <span className="admin-kpi__delta-sub">unique cashiers (last 7 days)</span>
              </div>
            </div>
            <div className="admin-kpi__icon admin-kpi__icon--gray" aria-hidden="true">
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
            </div>
          </div>

          <div className="admin-kpi">
            <div className="admin-kpi__meta">
              <div className="admin-kpi__label">Low Stock Alerts</div>
              <div className="admin-kpi__value">{lowStockCount.toLocaleString()}</div>
              <div className="admin-kpi__delta admin-kpi__delta--warn">
                <span className="admin-kpi__warn-badge">Action Required</span>{" "}
                <span className="admin-kpi__delta-sub">{urgentLowStockCount} urgent</span>
              </div>
            </div>
            <div className="admin-kpi__icon admin-kpi__icon--orange" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3 2.5 20h19L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9v5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <div className="admin-card__title">Recent Sales Activity</div>
              <div className="admin-card__subtitle">
                Latest 5 transactions processed across all branches.
              </div>
            </div>
            <button type="button" className="admin-link-btn" onClick={() => navigate("/reports")}>
              View All Activity
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>TRANSACTION ID</th>
                  <th>CASHIER</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t.id}>
                      <td className="admin-muted">#{String(t.id).slice(-8)}</td>
                      <td>
                        <div className="admin-cashier">
                          <div className="admin-cashier__avatar" aria-hidden="true">
                            {getInitials(t.cashier)}
                          </div>
                          <div className="admin-cashier__name">{t.cashier}</div>
                        </div>
                      </td>
                      <td className="admin-amount">{formatAmount(t.total)}</td>
                      <td>{statusPill(t.status)}</td>
                      <td className="text-end">
                        <button type="button" className="admin-ellipsis" aria-label="More actions">
                          …
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      {recentTransactions.length === 0
                        ? "No transactions recorded yet"
                        : "No matches for your search"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;