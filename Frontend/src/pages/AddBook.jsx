import { useState } from "react";
import axios from "axios";


function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddBook = async () => {
    if (!title || !author || !isbn || !quantity) {
      setMessage("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/books",
        { title, author, isbn, totalQuantity: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessage("✅ Book added successfully");
      setTitle("");
      setAuthor("");
      setIsbn("");
      setQuantity("");
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      setMessage("Failed to add book: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

 return (
  <div style={{ maxWidth: "520px", margin: "0 auto", padding: "20px" }}>
    <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>📘 Add Book</h1>
    <div style={{ background: "#1e1e1e", padding: "20px", borderRadius: "10px", border: "1px solid #2f2f2f" }}>
      <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book Title"
        style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
      />

      <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Author</label>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author Name"
        style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
      />

      <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>ISBN</label>
      <input
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        placeholder="ISBN Number"
        style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
      />

      <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Quantity</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        style={{ width: "100%", padding: "10px", marginBottom: "16px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
      />

      <button onClick={handleAddBook} disabled={submitting}
        style={{ width: "100%", padding: "12px", background: submitting ? "#6b7280" : "#1e40af", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold" }}>
        {submitting ? "Adding..." : "Add Book"}
      </button>

      {message && (
        <div style={{ marginTop: "12px", padding: "12px", background: message.startsWith("✅") ? "#d1fae5" : "#fee2e2", color: message.startsWith("✅") ? "#065f46" : "#991b1b", borderRadius: "6px" }}>
          {message}
        </div>
      )}
    </div>
  </div>
);


}

export default AddBook;
