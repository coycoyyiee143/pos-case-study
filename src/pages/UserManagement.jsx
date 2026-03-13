import { useState } from "react";
import usersData from "../data/users";
import AdminSidebar from "../components/AdminSidebar";

function UserManagement() {
  const [users] = useState(usersData);

  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>User Management</h3>

          <button className="btn btn-dark">
            Add User
          </button>
        </div>

        <div className="card shadow-sm">
          <table className="table table-hover mb-0">

            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default UserManagement;