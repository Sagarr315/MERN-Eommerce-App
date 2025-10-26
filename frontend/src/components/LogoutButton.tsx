import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/"); // Redirect to home page
    }
  };

  return (
    <li className="text-danger dropdown-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
      <i className="bi bi-box-arrow-right me-2"></i> Log Out
    </li>
  );
};

export default LogoutButton;