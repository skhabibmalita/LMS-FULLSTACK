import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function StudentDashboard() {
  const [issues, setIssues] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        const res = await axios.get("http://localhost:5000/api/issues/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIssues(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your books");
      } finally {
        setLoading(false);
      }
    };
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/reservations/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
      } catch (err) {
        // silent fail for reservations; primary content is issues
      }
    };

    fetchMyIssues();
    fetchReservations();
  }, []);

  const handleReturnBook = async (issueId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/issues/self-return",
        { issueId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + response.data.message);
      // Refresh issues list
      const res = await axios.get("http://localhost:5000/api/issues/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Failed to return book"));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1 
      
      className="  text-green-500  text-center text-5xl  font-bold mb-10"
      >Welcome to your Dashboard</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", justifyContent: "center" }}>
        <Link to="/catalog" style={{ background: "#1e40af", color: "#fff", padding: "10px 14px", borderRadius: "8px", textDecoration: "none" }}>Browse Catalog</Link>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg mb-3 bg-red-500/20 text-red-300 border border-red-600">{error}</div>
      )}

      {message && (
        <div className={"px-4 py-3 rounded-lg mb-3 " + (message.startsWith('✅') ? 'bg-green-500/20 text-green-300 border border-green-600' : 'bg-red-500/20 text-red-300 border border-red-600')}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ color: "#fff", textAlign: "center", padding: "30px" }}>⏳ Loading your recent books...</div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ background: "#1e1e1e", border: "1px solid #2f2f2f", borderRadius: "10px", padding: "14px" }}>
            <h2 style={{ color: "#fff", marginBottom: "10px" }}>Recent Transactions</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ color: "#ccc", textAlign: "left" }}>
                    <th style={{ padding: "8px" }}>Book</th>
                    <th style={{ padding: "8px" }}>Status</th>
                    <th style={{ padding: "8px" }}>Issued</th>
                    <th style={{ padding: "8px" }}>Due</th>
                    <th style={{ padding: "8px" }}>Returned</th>
                    <th style={{ padding: "8px" }}>Fine</th>
                    <th style={{ padding: "8px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((it) => (
                    <tr key={it._id} style={{ borderTop: "1px solid #2f2f2f" }}>
                      <td style={{ padding: "8px", color: "#fff" }}>{it.bookId?.title || "Unknown"}</td>
                      <td style={{ padding: "8px" }}>
                        <span style={{
                          background: it.status === "issued" ? "#064e3b" : "#1f2937",
                          color: it.status === "issued" ? "#a7f3d0" : "#e5e7eb",
                          padding: "4px 8px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}>
                          {it.status}
                        </span>
                      </td>
                      <td style={{ padding: "8px", color: "#bbb" }}>{it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "-"}</td>
                      <td style={{ padding: "8px", color: "#bbb" }}>{it.dueDate ? new Date(it.dueDate).toLocaleDateString() : "-"}</td>
                      <td style={{ padding: "8px", color: "#bbb" }}>{it.returnDate ? new Date(it.returnDate).toLocaleDateString() : "-"}</td>
                      <td style={{ padding: "8px", color: it.fineAmount > 0 ? "#fecaca" : "#bbb" }}>{it.fineAmount || 0}</td>
                      <td style={{ padding: "8px" }}>
                        {it.status === "issued" && (
                          <button
                            onClick={() => handleReturnBook(it._id)}
                            style={{
                              background: "#059669",
                              color: "#fff",
                              padding: "4px 8px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "bold"
                            }}
                          >
                            Return
                          </button>
                        )}
                        {it.status === "returned" && (
                          <span style={{ color: "#a7f3d0", fontSize: "12px" }}>✓ Returned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {issues.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "12px", color: "#999", textAlign: "center" }}>No recent activity.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: "#1e1e1e", border: "1px solid #2f2f2f", borderRadius: "10px", padding: "14px" }}>
            <h2 style={{ color: "#fff", marginBottom: "10px" }}>My Reservations</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ color: "#ccc", textAlign: "left" }}>
                    <th style={{ padding: "8px" }}>Book</th>
                    <th style={{ padding: "8px" }}>Status</th>
                    <th style={{ padding: "8px" }}>Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r._id} style={{ borderTop: "1px solid #2f2f2f" }}>
                      <td style={{ padding: "8px", color: "#fff" }}>{r.bookId?.title || "Unknown"}</td>
                      <td style={{ padding: "8px" }}>
                        <span style={{
                          background: r.status === 'pending' ? '#7c3aed' : r.status === 'fulfilled' ? '#065f46' : '#7f1d1d',
                          color: r.status === 'pending' ? '#ede9fe' : r.status === 'fulfilled' ? '#d1fae5' : '#fecaca',
                          padding: "4px 8px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: "8px", color: "#bbb" }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "12px", color: "#999", textAlign: "center" }}>No reservations placed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
