import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear the token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to login
      navigate("/login");
    }
  };

  return (
    <div className="layout">
      {/* Top Header with Logout */}
      <div className="top-header">
        <div className="header-left cursor-pointer">
          <h1 onClick={() => navigate("/dashboard")} className="system-title">📚 Library Management System</h1>
        </div>
        <div className="header-right">
          <button 
            onClick={handleLogout}
            className="logout-btn"
            title="Click to logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-container">
        <Sidebar />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
