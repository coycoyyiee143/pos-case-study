import transactions from "../data/transactions";
import AdminSidebar from "../components/AdminSidebar";

function AuditLogs() {
  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        <h3 className="mb-4">Audit Logs</h3>

        <div className="card shadow-sm">
          <table className="table table-striped mb-0">

            <thead className="table-dark">
              <tr>
                <th>Transaction ID</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.status}</td>
                  <td>{t.date}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default AuditLogs;