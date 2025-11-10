import { useState } from "react";
import api from "../api/api";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("login/", { username, password });

      if (res.data.success) {
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.user_id);
        onLogin(res.data.role);
        setError("");
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError("Login failed");
      console.error(err);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Login</button>
          {error && <p style={errorStyle}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  backgroundColor: "#F3F4F6", // light grey background
};

const cardStyle = {
  backgroundColor: "#FFFFFF",
  padding: "40px 30px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  width: "350px",
  textAlign: "center",
};

const titleStyle = {
  marginBottom: "25px",
  color: "#1F2937",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: "12px 15px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #D1D5DB",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "12px 15px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#4D96FF",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const errorStyle = {
  color: "red",
  marginTop: "10px",
  fontSize: "14px",
};

export default LoginForm;
