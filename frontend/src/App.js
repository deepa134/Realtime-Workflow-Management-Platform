import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";

function App() {
  // Get role from localStorage on page load
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  useEffect(() => {
    console.log("Current role:", role);
  }, [role]);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setRole(null);
  };

  return (
    <div>
      <h1>Django Workflow App</h1>
      {role ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          {role === "admin" && <AdminDashboard />}
          {role === "manager" && <ManagerDashboard />}
          {role === "employee" && <EmployeeDashboard />}
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
