import { useNavigate } from "react-router-dom";

function TopBar() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-between align-items-center border-bottom px-4 py-3">
      <h5 className="m-0">POS System</h5>

      <button className="btn btn-outline-dark btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default TopBar;