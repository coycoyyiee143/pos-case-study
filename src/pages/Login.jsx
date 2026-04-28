import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  const navigate = useNavigate();

  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.trim().length > 0;
  }, [username, password]);

  const handleLogin = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Invalid credentials");
      return;
    }

    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        rememberDevice,
      })
    );

    if (data.user.role === "Cashier") navigate("/cashier");
    else if (data.user.role === "Administrator") navigate("/admin");
    else navigate("/logs");

  } catch (err) {
    console.error(err);
    alert("Cannot connect to server");
  }
};

  return (
    <div className="login-page">
      <header className="login-topbar">
        <div className="login-brand">
          <div className="login-brand-mark" aria-hidden="true">
            ◢
          </div>
          <div className="login-brand-title">POS System</div>
        </div>

        <div className="login-status">
          <span className="login-status-label">System Status:</span>
          <span className="badge rounded-pill text-bg-primary-subtle border border-primary-subtle text-primary-emphasis">
            Secure
          </span>
        </div>
      </header>

      <main className="login-main">
        <div className="login-card card border-0 shadow-sm">
          <div className="login-card-hero">
            <div className="login-hero-icon" aria-hidden="true">
              🔒
            </div>
            <h4 className="mb-0 fw-bold">Welcome Back</h4>
          </div>

          <div className="card-body p-4">
            <div className="mb-3">
              <label className="form-label">Employee ID or Username</label>
              <div className="input-group">
                <span className="input-group-text bg-white" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 21a8 8 0 0 0-16 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter your unique ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 10V8a5 5 0 0 1 10 0v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6a3 3 0 0 0 4.24 4.24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a18.2 18.2 0 0 1-3.3 4.4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.2 6.2C3.7 8.2 2 12 2 12s4 7 10 7c1 0 2-.2 3-.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3">
              <label className="form-check d-flex align-items-center gap-2 m-0">
                <input
                  className="form-check-input mt-0"
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                />
                <span className="small text-muted">Remember device</span>
              </label>

              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none"
                onClick={() => alert("Password reset is not enabled in this demo.")}
              >
                Forgot password?
              </button>
            </div>

            <button
              className="btn btn-primary w-100 mt-3 py-2 fw-semibold"
              onClick={handleLogin}
              disabled={!canSubmit}
            >
              Sign In
            </button>

            <div className="text-center mt-3 small text-muted">
              Demo: cashier1 / 1234
            </div>

            <div className="login-legal text-center mt-3 small text-muted">
              By logging in, you agree to our{" "}
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none"
                onClick={() => alert("Terms are not available in this demo.")}
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none"
                onClick={() => alert("Security policy is not available in this demo.")}
              >
                Security Policy
              </button>
              .
            </div>
          </div>
        </div>

        <footer className="login-footer text-center text-muted small mt-4">
          <div className="d-flex justify-content-center gap-4">
            <span>English (US)</span>
            <span>Support</span>
          </div>
          <div className="mt-2">© {new Date().getFullYear()} POS System. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
}

export default Login;