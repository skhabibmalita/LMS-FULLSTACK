import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Login successful ✅");
      
      // Role-based redirect after 500ms
      setTimeout(() => {
        const role = (data.user && (data.user.role || data.user.usertype)) || "admin";
        if (String(role).toLowerCase() === "student" || String(role).toLowerCase() === "user") {
          navigate("/student");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        color: "#ffffff",
        gap: "20px"
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "30px",
          borderRadius: "10px",
          background: "#1e1e1e",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}>🔐 Login</h2>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", color: "#d1d5db", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #404040",
              background: "#2a2a2a",
              color: "#fff",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#d1d5db", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #404040",
              background: "#2a2a2a",
              color: "#fff",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#1e40af",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "6px",
            fontWeight: "600",
            fontSize: "14px",
            transition: "background 0.2s"
          }}
          onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.background = "#1e40af")}
        >
          Login
        </button>

        
      </div>

      <p className="text-2xl text-green-500 font-bold">{message}</p>
    </div>
  );
}

export default Login;
