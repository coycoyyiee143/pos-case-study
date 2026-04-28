import { useState, useEffect } from "react";

function UserModal({ show, onClose, fetchUsers, editingUser }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Cashier");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username);
      setRole(editingUser.role);
      setPassword(""); // 🔥 don't preload password
    } else {
      setUsername("");
      setRole("Cashier");
      setPassword("");
    }
  }, [editingUser]);

  const handleSave = async () => {
    if (!username || (!editingUser && !password)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingUser) {
        // ================= UPDATE =================
        await fetch(
          `http://127.0.0.1:8000/api/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              role,
              password, // optional (backend handles if empty)
            }),
          }
        );
      } else {
        // ================= CREATE =================
        await fetch("http://127.0.0.1:8000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            role,
            password,
          }),
        });
      }

      fetchUsers(); // 🔥 reload from backend
      onClose();
    } catch (error) {
      console.error("Save error:", error);
    }
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
                placeholder={editingUser ? "Leave blank to keep current password" : ""}
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