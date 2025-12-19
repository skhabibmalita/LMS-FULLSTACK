import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const role = (user && user.role) ? String(user.role).toLowerCase() : "librarian";
  return (
    <div className="sidebar">
      <h2 className="logo">📚 LMS</h2>

      <nav>
        {/* Admin-only links */}
        {role === "admin" && (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/add-book">➕ Add Book</Link>
            <Link to="/books">📖 Book List</Link>
            <Link to="/add-member">👤 Add Member</Link>
            <Link to="/members">👥 Member List</Link>
            <Link to="/issue-book">📤 Issue Book</Link>
            <Link to="/return">📥 Return Book</Link>
            <Link to="/issues">📋 View Issues</Link>
            <Link to="/create-user">🧩 Create User</Link>
          </>
        )}

        {/* Student-only links */}
        {role === "student" && (
          <>
            <Link to="/student">🎓 My Dashboard</Link>
          </>
        )}

        {/* Public links (visible to all) */}
        <Link to="/catalog">🗂️ Catalog</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
