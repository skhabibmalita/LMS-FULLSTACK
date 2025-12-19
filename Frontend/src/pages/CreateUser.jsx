import { useState } from "react";
import axios from "axios";

function CreateUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ User created: ${res.data.user?.email || form.email}`);
      setForm({ name: "", email: "", password: "", role: "student" });
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>👤 Create User</h1>
      <form onSubmit={onSubmit} style={{ background: "#1e1e1e", padding: "20px", borderRadius: "10px", border: "1px solid #2f2f2f" }}>
        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Name</label>
        <input name="name" value={form.name} onChange={onChange} required style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }} />

        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }} />

        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }} />

        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Role</label>
        <select name="role" value={form.role} onChange={onChange} style={{ width: "100%", padding: "10px", marginBottom: "16px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}>
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#6b7280" : "#1e40af", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold" }}>
          {loading ? "Creating..." : "Create User"}
        </button>

        {message && (
          <div style={{ marginTop: "12px", padding: "12px", background: message.startsWith("✅") ? "#d1fae5" : "#fee2e2", color: message.startsWith("✅") ? "#065f46" : "#991b1b", borderRadius: "6px" }}>{message}</div>
        )}
      </form>
    </div>
  );
}

export default CreateUser;
