import { useEffect, useState } from "react";
import axios from "axios";

function Catalog() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:5000/api/books");
        setBooks(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const categories = Array.from(
    new Set(books.map((b) => (b.category || "").trim()).filter(Boolean))
  );

  const filtered = books.filter((b) => {
    const matchesQuery = (b.title || "").toLowerCase().includes(query.toLowerCase()) ||
      (b.author || "").toLowerCase().includes(query.toLowerCase()) ||
      (b.isbn || "").toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || (b.category || "") === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>📚 Book Catalog</h1>
      {message && (
        <div className={"px-4 py-3 rounded-lg mb-3 " + (message.startsWith('✅') ? 'bg-green-500/20 text-green-300 border border-green-600' : 'bg-red-500/20 text-red-300 border border-red-600')}>
          {message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title, author, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg mb-3 bg-red-500/20 text-red-300 border border-red-600">{error}</div>
      )}

      {loading ? (
        <div style={{ color: "#fff", textAlign: "center", padding: "30px" }}>⏳ Loading books...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {filtered.map((b) => (
            <div key={b._id} style={{ background: "#1e1e1e", border: "1px solid #2f2f2f", borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>{b.title}</div>
              <div style={{ color: "#bbb" }}>by {b.author}</div>
              <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {b.category && (
                  <span style={{ background: "#312e81", color: "#ddd6fe", padding: "4px 8px", borderRadius: "999px", fontSize: "12px" }}>{b.category}</span>
                )}
                {b.isbn && (
                  <span style={{ background: "#052e16", color: "#86efac", padding: "4px 8px", borderRadius: "999px", fontSize: "12px" }}>ISBN: {b.isbn}</span>
                )}
              </div>
              <div style={{ marginTop: "10px" }}>
                <span style={{
                  background: (b.availableQuantity ?? 0) > 0 ? "#064e3b" : "#7f1d1d",
                  color: (b.availableQuantity ?? 0) > 0 ? "#a7f3d0" : "#fecaca",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}>
                  {(b.availableQuantity ?? 0) > 0 ? `Available: ${b.availableQuantity}` : "Out of Stock"}
                </span>
                {(b.availableQuantity ?? 0) > 0 && (
                  <CheckOutButton book={b} onResult={(msg) => { setMessage(msg); setTimeout(() => setMessage(''), 2500); }} />
                )}
                {(b.availableQuantity ?? 0) === 0 && (
                  <ReserveButton book={b} onResult={(msg) => { setMessage(msg); setTimeout(() => setMessage(''), 2500); }} />
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ color: "#999", gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>No books match your search.</div>
          )}
        </div>
      )}
    </div>
  );
}

function ReserveButton({ book, onResult }) {
  const handleReserve = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!token || !user) {
        onResult('❌ Please log in as a student to reserve');
        return;
      }
      const memberId = user.memberId; // set during registration
      if (!memberId) {
        onResult('❌ Your account is not linked to a member');
        return;
      }
      const res = await axios.post('http://localhost:5000/api/reservations', { bookId: book._id, memberId }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      onResult('✅ Reservation placed');
    } catch (err) {
      onResult(err.response?.data?.message || '❌ Failed to reserve');
    }
  };
  return (
    <button onClick={handleReserve} style={{ marginLeft: '10px', padding: '6px 10px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
      Reserve
    </button>
  );
}

function CheckOutButton({ book, onResult }) {
  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!token || !user) {
        onResult('❌ Please log in to check out');
        return;
      }
      if (user.role !== 'student') {
        onResult('❌ Only students can check out books');
        return;
      }
      const res = await axios.post('http://localhost:5000/api/issues/self-checkout', { bookId: book._id }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      onResult('✅ Book checked out! Due date: ' + new Date(res.data.dueDate).toLocaleDateString());
    } catch (err) {
      onResult(err.response?.data?.message || '❌ Failed to check out');
    }
  };
  return (
    <button onClick={handleCheckOut} style={{ marginLeft: '10px', padding: '6px 10px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
      Check Out
    </button>
  );
}

export default Catalog;
