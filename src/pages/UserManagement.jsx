import { useState, useEffect } from "react";
import usersData from "../data/users";
import AdminSidebar from "../components/AdminSidebar";
import UserModal from "../components/UserModal";

function UserManagement() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : usersData;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    window.dispatchEvent(new Event("pos-data-update"));
  }, [users]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((u) => u.id !== id);
      setUsers(updatedUsers);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>User Management</h3>

          <button
            className="btn btn-success"
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
          >
            Add User
          </button>
        </div>

        <div className="card shadow-sm">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <UserModal
          show={showModal}
          onClose={() => setShowModal(false)}
          setUsers={setUsers}
          editingUser={editingUser}
        />

      </div>
    </div>
  );
}

export default UserManagement;