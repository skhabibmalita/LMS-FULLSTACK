import { useEffect, useState } from "react";
import axios from "axios";

function ReturnBook() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [returning, setReturning] = useState(false);

  // Fetch all issued books
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("❌ No authentication token found");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/issues/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // show only issued (not returned)
      const issuedOnly = res.data.filter(
        (item) => item.status === "issued" && item.bookId && item.memberId
      );

      setIssues(issuedOnly);
      if (issuedOnly.length === 0) {
        setError("⚠️ No issued books available to return");
      }
    } catch (err) {
      console.error("❌ Error loading issued books:", err.message);
      setError(
        err.response?.data?.message || "❌ Failed to load issued books"
      );
    } finally {
      setLoading(false);
    }
  };

  // Return book
  const returnBook = async () => {
    if (!selectedIssue) {
      setMessage("❌ Please select an issued book");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setReturning(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/issues/return",
        { issueId: selectedIssue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Book returned successfully!");
      setSelectedIssue("");
      setTimeout(() => {
        fetchIssues();
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error("❌ Error returning book:", err.message);
      setMessage(
        err.response?.data?.message || "❌ Error returning book"
      );
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setReturning(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#fff" }}>
        📚 Return Book
      </h1>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "10px",
            }}
          >
            ⏳ Loading issued books...
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Select Issued Book:
          </label>

          <select
            value={selectedIssue}
            onChange={(e) => setSelectedIssue(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              backgroundColor: "#2d2d2d",
              color: "#fff",
              border: "1px solid #404040",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            <option value="">-- Select Issued Book --</option>
            {issues.map((issue) => (
              <option key={issue._id} value={issue._id}>
                📖 {issue.bookId?.title || "Unknown Book"} → 👤{" "}
                {issue.memberId?.name || "Unknown Member"} (Issued:{" "}
                {new Date(issue.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>

          {issues.length === 0 && !error && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#999",
              }}
            >
              No issued books available to return
            </div>
          )}

          <button
            onClick={returnBook}
            disabled={!selectedIssue || returning}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: selectedIssue && !returning ? "#10b981" : "#6b7280",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: selectedIssue && !returning ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              opacity: selectedIssue && !returning ? 1 : 0.6,
            }}
          >
            {returning ? "🔄 Processing..." : "✅ Return Book"}
          </button>

          {/* Success/Error Message */}
          {message && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: message.includes("✅") ? "#d1fae5" : "#fee2e2",
                color: message.includes("✅") ? "#065f46" : "#991b1b",
                borderRadius: "6px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReturnBook;
