import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles.css";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      // Filter tasks assigned to the current employee (userId)
      const myTasks = res.data.filter(
        (t) => t.assigned_to && t.assigned_to.id === userId
      );
      setTasks(myTasks);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const markDone = async (id) => {
    try {
      // Note: Using "done" as the status; ensure this matches your backend enum/choices.
      await api.patch(`tasks/${id}/`, { status: "done" });
      fetchTasks(); // Refresh list to show updated status
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  // --- START: Inline Styles for Card Layout ---

  const dashboardContainerStyle = {
    padding: '20px',
    backgroundColor: '#f9f9f9', // Light background for the overall dashboard
    minHeight: '100vh',
  };
  
  const titleStyle = {
    marginBottom: '25px',
    color: '#333',
    paddingLeft: '20px',
  };

  const taskGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '0 20px',
  };

  const taskCardStyle = (status) => ({
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    borderLeft: `5px solid ${getStatusColor(status)}`, // Color bar based on status
    transition: 'transform 0.2s',
  });
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'done':
      case 'completed':
        return '#6BCB77'; // Green
      case 'in progress':
        return '#FFA500'; // Orange
      case 'pending':
      default:
        return '#FF6B6B'; // Red/Pink
    }
  };

  const badgeStyle = (status) => ({
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: getStatusColor(status),
  });

  const buttonStyle = {
    marginTop: '15px',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4D96FF', // Blue color for action
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  };

  // --- END: Inline Styles for Card Layout ---

  return (
    <div className="dashboard-container" style={dashboardContainerStyle}>
      
      {/* Updated title with added style */}
      <h2 className="manager-dashboard-container" style={titleStyle}>My Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <p style={{paddingLeft: '20px'}}>No tasks assigned.</p>
      ) : (
        <div className="task-grid" style={taskGridStyle}>
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="task-card" 
              style={taskCardStyle(task.status)}
            >
              <b style={{fontSize: '1.1em', display: 'block', marginBottom: '10px'}}>{task.title}</b>
              
              <p>Status: <span style={badgeStyle(task.status)}>{task.status}</span></p>
              
              <p>Assigned: {task.assigned_to?.username || 'You'}</p> 
              <p>Start: {task.start_date ? task.start_date.split("T")[0] : "Not set"}</p>
              <p>Due: {task.due_date ? task.due_date.split("T")[0] : "Not set"}</p>
              
              {/* Only show Mark Done button if status is not 'done' */}
              {task.status !== "done" && (
                <button 
                  className="completed" 
                  onClick={() => markDone(task.id)}
                  style={buttonStyle}
                >
                  Mark Done
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;