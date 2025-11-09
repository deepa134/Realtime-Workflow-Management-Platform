import { useState, useEffect } from "react";
import api from "../api/api";

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [workflowId, setWorkflowId] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchWorkflows();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const res = await api.get("workflows/");
      setWorkflows(res.data);
    } catch (error) {
      console.error("Error fetching workflows", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("users/");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("tasks/", {
        title: title,
        status: status.toLowerCase(),          // match Django choices
        workflow: Number(workflowId),          // ensure ID is a number
        assigned_to: assignedTo ? Number(assignedTo) : null,
        start_date: startDate,
        due_date: dueDate,
      });

      // Reset form
      setTitle("");
      setStatus("Pending");
      setWorkflowId("");
      setAssignedTo("");
      setStartDate("");
      setDueDate("");
      fetchTasks();
    } catch (error) {
      console.error("Error creating task", error);
      alert("Failed to create task. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`tasks/${id}/`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`tasks/${id}/`, { status: newStatus.toLowerCase() });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // Group tasks by workflow
  const groupedTasks = workflows.map((wf) => ({
    workflow: wf,
    tasks: tasks.filter((task) => task.workflow && task.workflow.id === wf.id),
  }));

  return (
    <div>
      <h2>Manager Dashboard</h2>

      {/* Task creation form */}
      <h3>Create Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          value={workflowId}
          onChange={(e) => setWorkflowId(e.target.value)}
          required
        >
          <option value="">Select Workflow</option>
          {workflows.map((wf) => (
            <option key={wf.id} value={wf.id}>
              {wf.name}
            </option>
          ))}
        </select>

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign To (optional)</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">Create Task</button>
      </form>

      {/* Tasks grouped by workflow */}
      <h3>All Tasks</h3>
      {groupedTasks.map((group) => (
        <div key={group.workflow.id} style={{ marginBottom: "20px" }}>
          <h4>{group.workflow.name}</h4>
          {group.tasks.length > 0 ? (
            <ul>
              {group.tasks.map((task) => (
                <li key={task.id}>
                  <b>{task.title}</b> — {task.status}
                  <br />
                  Assigned To: {task.assigned_to ? task.assigned_to.username : "None"}
                  <br />
                  Start: {task.start_date ? task.start_date.split("T")[0] : "Not set"}
                  <br />
                  Due: {task.due_date ? task.due_date.split("T")[0] : "Not set"}
                  <br />
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                  <button onClick={() => handleStatusChange(task.id, "In Progress")}>
                    Mark In Progress
                  </button>
                  <button onClick={() => handleStatusChange(task.id, "Completed")}>
                    Mark Completed
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks under this workflow.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManagerDashboard;
