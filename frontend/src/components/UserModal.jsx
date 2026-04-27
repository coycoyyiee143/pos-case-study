import { useState, useEffect } from "react";

function UserModal({ show, onClose, setUsers, editingUser }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Cashier");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username);
      setRole(editingUser.role);
      setPassword(editingUser.password);
    } else {
      setUsername("");
      setRole("Cashier");
      setPassword("");
    }
  }, [editingUser]);

  const handleSave = () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    const existingUsers = localStorage.getItem("users");
    const usersList = existingUsers ? JSON.parse(existingUsers) : [];

    if (editingUser) {
      const updatedUsers = usersList.map((u) =>
        u.id === editingUser.id ? { ...u, username, role, password } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    } else {
      const newUser = {
        id: Date.now(),
        username,
        role,
        password,
      };
      const updatedUsers = [...usersList, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }

    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content overflow-hidden">

          <div
            className="modal-header border-0 text-white"
            style={{ background: "#198754" }}
          >
            <div>
              <h5 className="modal-title fw-bold mb-0">
                {editingUser ? "Edit User" : "Add User"}
              </h5>
              <small style={{ opacity: 0.85 }}>Fill in the details below</small>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Administrator">Administrator</option>
                <option value="Cashier">Cashier</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-success" onClick={handleSave}>
              {editingUser ? "Update User" : "Add User"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserModal;
