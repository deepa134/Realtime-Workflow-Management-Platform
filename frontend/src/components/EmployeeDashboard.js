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
      await api.patch(`tasks/${id}/`, { status: "done" });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Employee Dashboard</h2>
      {tasks.length === 0 ? <p>No tasks assigned.</p> : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <b>{task.title}</b>
              <p>Status: <span className={`badge ${task.status}`}>{task.status}</span></p>
              <p>Start: {task.start_date ? task.start_date.split("T")[0] : "Not set"}</p>
              <p>Due: {task.due_date ? task.due_date.split("T")[0] : "Not set"}</p>
              {task.status !== "done" && (
                <button className="completed" onClick={() => markDone(task.id)}>Mark Done</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
