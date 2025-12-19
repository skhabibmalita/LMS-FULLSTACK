import { useEffect, useState } from "react";
import axios from "axios";
import "./form.css";

function IssueBook() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  // Auto-set today's date for display
  const todayDate = new Date().toISOString().split('T')[0];

  // 🔹 Fetch books & members
  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Books fetched:", res.data);
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/members", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Members fetched:", res.data);
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  // 🔹 Issue book
  const handleIssue = async () => {
    if (!bookId || !memberId || !dueDate) {
      alert("❌ All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/issues/issue", {
        bookId,
        memberId,
        dueDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Book issued successfully");

      setBookId("");
      setMemberId("");
      setDueDate("");
    } catch (err) {
      console.error("Error issuing book:", err);
      alert("❌ Failed to issue book: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">📕 Issue Book</div>

      <div className="form-group">
        <label>Select Book</label>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b._id} value={b._id}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Member</label>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Issue Date (Today)</label>
        <input
          type="date"
          value={todayDate}
          disabled
          style={{ opacity: 0.7, cursor: 'not-allowed' }}
        />
      </div>

      <div className="form-group">
        <label>Due Date (Return By)</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={todayDate}
        />
      </div>

      <button className="form-btn" onClick={handleIssue}>
        Issue Book
      </button>
    </div>
  );
}

export default IssueBook;
