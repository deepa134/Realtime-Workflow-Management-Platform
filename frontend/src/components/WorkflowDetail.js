import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles.css";

function WorkflowDetail({ workflowId, onBack }) {
  const [workflow, setWorkflow] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // Task form states
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchWorkflow();
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchWorkflow = async () => {
    try {
      const res = await api.get(`workflows/${workflowId}/`);
      setWorkflow(res.data);
    } catch (err) {
      console.error("Error fetching workflow:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      const wfTasks = res.data.filter(t => t.workflow?.id === workflowId);
      setTasks(wfTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("tasks/", {
        title,
        status: status.toLowerCase(),
        workflow: workflowId,
        assigned_to: assignedTo ? Number(assignedTo) : null,
        start_date: startDate,
        due_date: dueDate,
      });
      setTitle("");
      setStatus("Pending");
      setAssignedTo("");
      setStartDate("");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`tasks/${id}/`, { status: newStatus.toLowerCase() });
      fetchTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (!workflow) return <p>Loading...</p>;

  return (
    <div className="workflow-detail-container">
      <button className="back-btn" onClick={onBack}>⬅ Back</button>

      {/* Workflow Header Card */}
      <div className="workflow-header-card">
        <h2 className="workflow-title">{workflow.name}</h2>
        <p className="workflow-desc">{workflow.description || "No description available."}</p>
      </div>

      {/* Horizontal Flowchart Section */}
      <div className="workflow-flowchart">
        {tasks.map(task => (
          <div key={task.id} className="flowchart-task-card">
            <h4>{task.title}</h4>
            <p>Status: <span className={`status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span></p>
            <p>Assigned To: {task.assigned_to ? task.assigned_to.username : "None"}</p>
            <p>Start: {task.start_date ? task.start_date.split("T")[0] : "Not set"}</p>
            <p>Due: {task.due_date ? task.due_date.split("T")[0] : "Not set"}</p>
            <div className="task-card-buttons">
              <button onClick={() => handleDelete(task.id)} className="delete-btn">🗑️</button>
              <button onClick={() => handleStatusChange(task.id, "In Progress")} className="status-btn">In Progress</button>
              <button onClick={() => handleStatusChange(task.id, "Completed")} className="status-btn completed">Completed</button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Form */}
      <div className="task-create-card">
        <h3>Create New Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Assign To (optional)</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>Due Date:</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button type="submit" className="create-btn">+ Add Task</button>
        </form>
      </div>
    </div>
  );
}

export default WorkflowDetail;
