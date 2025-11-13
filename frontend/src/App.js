import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Header from "./components/Header"; 

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  
  // Robustly retrieve userName from localStorage, defaulting to 'User' 
  // if the stored value is null, missing, or the string 'undefined'.
  const storedUserName = localStorage.getItem("userName");
  const [userName, setUserName] = useState(
    (storedUserName && storedUserName !== 'undefined') ? storedUserName : 'User'
  ); 
  
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  useEffect(() => {
    console.log("Current role:", role);
  }, [role]);

  // handleLogin now expects all three arguments from the LoginForm
  const handleLogin = (userRole, currentUserId, currentUserName) => {
    // Save all values to localStorage
    localStorage.setItem("role", userRole);
    localStorage.setItem("userId", currentUserId); 
    localStorage.setItem("userName", currentUserName); 
    
    // Update component state
    setRole(userRole);
    setUserId(currentUserId);
    setUserName(currentUserName); 
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName"); 
    setRole(null);
    setUserId(null);
    setUserName('User'); // Reset userName state on logout
  };

  return (
    <div>
      {role ? (
        <>
          {/* Use the dynamic Header component */}
          <Header 
            userRole={role} 
            userName={userName} 
            onLogout={handleLogout} 
          />
          
          {/* Conditional Dashboard Rendering */}
          {role === "admin" && <AdminDashboard />}
          {role === "manager" && <ManagerDashboard />}
          {role === "employee" && <EmployeeDashboard />}
        </>
      ) : (
        // Render the LoginForm if not logged in
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;