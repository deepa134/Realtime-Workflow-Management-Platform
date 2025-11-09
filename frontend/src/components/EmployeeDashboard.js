import { useState, useEffect } from "react";
import api from "../api/api";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      // filter only tasks assigned to this employee
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
    <div>
      <h2>Employee Dashboard</h2>
      {tasks.length === 0 && <p>No tasks assigned.</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.status}
            {task.status !== "done" && (
              <button onClick={() => markDone(task.id)}>Mark Done</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeDashboard;
