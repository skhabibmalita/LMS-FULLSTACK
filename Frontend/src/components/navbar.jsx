import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav style={{ padding: "15px", background: "#222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "15px" }}>
        <a href="/add-book" style={linkStyle}>Add Book</a>
        <a href="/add-member" style={linkStyle}>Add Member</a>
        <a href="/issue-book" style={linkStyle}>Issue Book</a>
        <a href="/return" style={linkStyle}>Return Book</a>
        <a href="/issues" style={linkStyle}>Issued Books</a>
        <a href="/books" style={linkStyle}>All Books</a>
      </div>
      <button 
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600"
        }}
      >
        🚪 Logout
      </button>
    </nav>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "14px"
};

export default Navbar;
