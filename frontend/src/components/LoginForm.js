import { useState } from "react";
import api from "../api/api"; // use your Axios instance

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("login/", {
        username,
        password,
      });

      if (res.data.success) {
        // Store role and user ID in localStorage
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.user_id);

        // Pass role to App.js
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoginForm;
