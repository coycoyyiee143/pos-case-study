import { useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/users";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    if (user.role === "Cashier") {
      navigate("/cashier");
    }

    if (user.role === "Administrator") {
      navigate("/admin");
    }

    if (user.role === "Supervisor") {
      navigate("/logs");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <div className="text-center mb-4">
          <h3>POS System</h3>
          <p className="text-muted">Login to continue</p>
        </div>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <div className="text-center mt-3 small text-muted">
          Demo: cashier1 / 1234
        </div>
      </div>
    </div>
  );
}

export default Login;