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
      const myTasks = res.data.filter(t => t.assigned_to && t.assigned_to.id === userId);
      setTasks(myTasks);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const startWork = async (id) => {
    try {
      await api.post(`tasks/${id}/start/`);
      fetchTasks();
    } catch (err) {
      console.error("Error starting work", err);
    }
  };

  const markDone = async (id) => {
    try {
      await api.post(`tasks/${id}/complete/`);
      fetchTasks();
    } catch (err) {
      console.error("Error completing task", err);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <h2>My Tasks</h2>
      {tasks.length === 0 ? <p>No tasks assigned.</p> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px' }}>
          {tasks.map(task => (
            <div key={task.id} style={{ padding:'20px', background:'#fff', borderRadius:'10px', boxShadow:'0 4px 8px rgba(0,0,0,0.05)', borderLeft: `5px solid ${task.status==="completed"?"#6BCB77": task.status==="in_progress"?"#FFA500":"#FF6B6B"}` }}>
              <b>{task.title}</b>
              <p>Status: {task.status}</p>
              <p>Start: {task.start_date ? task.start_date.split("T")[0] : "Not set"}</p>
              <p>Due: {task.due_date ? task.due_date.split("T")[0] : "Not set"}</p>
              {task.status === "pending" && <button onClick={() => startWork(task.id)}>Start Work</button>}
              {task.status === "in_progress" && <button onClick={() => markDone(task.id)}>Mark Done</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
