import { useState } from "react";
import axios from "axios";

function AddMember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddMember = async () => {
    if (!name || !email || !phone || !address) {
      setMessage("❌ All fields are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/members",
        { name, email, phone, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Member added successfully");
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
    } catch (err) {
      setMessage(err.response?.data?.message ? `❌ ${err.response.data.message}` : "❌ Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>👤 Add Member</h1>
      <div style={{ background: "#1e1e1e", padding: "20px", borderRadius: "10px", border: "1px solid #2f2f2f" }}>
        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
        />

        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Email Address</label>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
        />

        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Phone Number</label>
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "12px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
        />

        <label style={{ color: "#fff", display: "block", marginBottom: "6px" }}>Address</label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "16px", background: "#2d2d2d", color: "#fff", border: "1px solid #404040", borderRadius: "6px" }}
        />

        <button onClick={handleAddMember} disabled={loading}
          style={{ width: "100%", padding: "12px", background: loading ? "#6b7280" : "#1e40af", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold" }}>
          {loading ? "Adding..." : "Add Member"}
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

export default AddMember;
