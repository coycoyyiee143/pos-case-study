import transactions from "../data/transactions";
import AdminSidebar from "../components/AdminSidebar";

function Reports() {
  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        <h3 className="mb-4">Sales Reports</h3>

        <div className="card shadow-sm">
          <table className="table table-striped mb-0">

            <thead className="table-dark">
              <tr>
                <th>Transaction ID</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>₱{t.total}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default Reports;