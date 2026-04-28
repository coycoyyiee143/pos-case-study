import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Later: replace with fetch("/api/audit-logs")
    const stored = JSON.parse(localStorage.getItem("auditLogs") || "[]");
    setLogs(stored);
  }, []);

  const filtered = logs.filter((l) =>
    filter === "" ||
    l.action?.toLowerCase().includes(filter.toLowerCase()) ||
    l.description?.toLowerCase().includes(filter.toLowerCase())
  );

  const badgeColor = (action) => {
    if (action?.includes("cancel")) return "bg-danger";
    if (action?.includes("void"))   return "bg-warning text-dark";
    if (action?.includes("login"))  return "bg-primary";
    return "bg-secondary";
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <main className="flex-grow-1 p-4 bg-light min-vh-100">
        <h4 className="fw-bold mb-4">Audit Logs</h4>

        <div className="mb-3" style={{ maxWidth: 320 }}>
          <input
            className="form-control"
            placeholder="Filter by action or description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      No logs recorded yet
                    </td>
                  </tr>
                ) : (
                  filtered.map((log, i) => (
                    <tr key={i}>
                      <td className="text-muted small">
                        {new Date(log.created_at || log.timestamp).toLocaleString()}
                      </td>
                      <td>{log.user || log.username || "—"}</td>
                      <td>
                        <span className={`badge ${badgeColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="small">{log.description || "—"}</td>
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

export default AuditLogs;