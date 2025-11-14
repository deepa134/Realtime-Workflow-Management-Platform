import { useState, useEffect } from "react";
import api from "../api/api";
import WorkflowDetail from "./WorkflowDetail";
import "../styles.css";

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [workflowId, setWorkflowId] = useState("");

  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchWorkflows();
    fetchUsers();
    fetchNotifications();
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

  const fetchNotifications = async () => {
    try {
      const res = await api.get("notifications/");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workflow and all its associated tasks?")) return;
    try {
      await api.delete(`workflows/${id}/`);
      fetchWorkflows();
      fetchTasks();
    } catch (error) {
      console.error("Error deleting workflow", error);
      alert("Failed to delete workflow. Ensure no related objects prevent deletion.");
    }
  };

  if (selectedWorkflowId) {
    return (
      <WorkflowDetail
        workflowId={selectedWorkflowId}
        onBack={() => setSelectedWorkflowId(null)}
      />
    );
  }

  // Top summary cards
  const totalCompleted = tasks.filter(t => t.status.toLowerCase() === "completed").length;
  const totalPending = tasks.filter(t => t.status.toLowerCase() === "pending").length;
  const totalInProgress = tasks.filter(t => t.status.toLowerCase() === "in progress").length;

  return (
    <div className="manager-dashboard-container">

      <h2>Manager Dashboard</h2>

      {/* Top Summary Cards */}
      <div className="top-cards">
        <div className="top-card completed">Completed: {totalCompleted}</div>
        <div className="top-card in-progress">In Progress: {totalInProgress}</div>
        <div className="top-card pending">Pending: {totalPending}</div>
      </div>

      {/* Employee Performance Overview */}
      <h3>Employee Performance Overview</h3>
      <div className="employee-cards-grid">
        {users.map(user => {
          const userTasks = tasks.filter(t => t.assigned_to?.id === user.id);
          const completed = userTasks.filter(t => t.status.toLowerCase() === "completed").length;
          const inProgress = userTasks.filter(t => t.status.toLowerCase() === "in progress").length;
          const pending = userTasks.filter(t => t.status.toLowerCase() === "pending").length;
          const total = userTasks.length;

          return (
            <div key={user.id} className="employee-card">
              <h4>{user.username}</h4>
              <p>Total: {total}</p>
              <p>Completed: {completed} | In Progress: {inProgress} | Pending: {pending}</p>
              <div className="progress-bar">
                <div
                  className="progress-completed"
                  style={{ width: total ? `${(completed / total) * 100}%` : 0 }}
                />
                <div
                  className="progress-inprogress"
                  style={{ width: total ? `${(inProgress / total) * 100}%` : 0 }}
                />
                <div
                  className="progress-pending"
                  style={{ width: total ? `${(pending / total) * 100}%` : 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Cards */}
      <h3>Active Workflows</h3>
      <div className="workflow-cards-grid">
        {workflows.map((wf, index) => {
          const colors = ["#FF6B6B", "#4D96FF", "#FFA500", "#6BCB77"];
          const color = colors[index % colors.length];

          const wfTasks = tasks.filter((t) => t.workflow?.id === wf.id);
          const total = wfTasks.length;
          const pending = wfTasks.filter((t) => t.status.toLowerCase() === "pending").length;
          const inProgress = wfTasks.filter((t) => t.status.toLowerCase() === "in progress").length;
          const done = wfTasks.filter((t) => t.status.toLowerCase() === "completed").length;

          return (
            <div key={wf.id} className="workflow-card" style={{ borderTop: `4px solid ${color}` }}>
              <h3>{wf.name}</h3>
              <p>Total Tasks: {total}</p>
              <p>
                Pending: <span style={{ color: "#FF6B6B" }}>{pending}</span> | 
                In Progress: <span style={{ color: "#FFA500" }}>{inProgress}</span> | 
                Done: <span style={{ color: "#6BCB77" }}>{done}</span>
              </p>
              <div className="card-buttons">
                <button className="access-btn" onClick={() => setSelectedWorkflowId(wf.id)}>Access</button>
                <button className="delete-btn" onClick={() => handleDeleteWorkflow(wf.id)}>🗑️</button> 
              </div>
            </div>
          );
        })}

        <div className="workflow-card create-card">
          <h3>Create New</h3>
          <input
            type="text"
            placeholder="Workflow Title"
            value={workflowId}
            onChange={(e) => setWorkflowId(e.target.value)}
          />
          <button className="create-btn" onClick={() => {
            if (!workflowId.trim()) return alert("Enter workflow title");
            api.post("workflows/", { name: workflowId, description: "" })
              .then(() => {
                setWorkflowId("");
                fetchWorkflows();
              })
              .catch(err => alert("Failed to create workflow"));
          }}>+ Create Workflow</button>
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        .manager-dashboard-container { padding: 20px; }
        .top-cards { display: flex; gap: 15px; margin-bottom: 20px; }
        .top-card { flex: 1; padding: 15px; border-radius: 10px; color: white; font-weight: bold; text-align: center; }
        .top-card.completed { background-color: #6BCB77; }
        .top-card.in-progress { background-color: #FFA500; }
        .top-card.pending { background-color: #FF6B6B; }

        .employee-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .employee-card { padding: 15px; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
        .progress-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; margin-top: 10px; }
        .progress-completed { background-color: #6BCB77; }
        .progress-inprogress { background-color: #FFA500; }
        .progress-pending { background-color: #FF6B6B; }

        .workflow-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
        .workflow-card { padding: 15px; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.05); position: relative; }
        .workflow-card.create-card { display: flex; flex-direction: column; gap: 10px; }
        .delete-btn { margin-top: 10px; background-color: #FF6B6B; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
        .access-btn { margin-top: 10px; margin-right: 5px; background-color: #4D96FF; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
        .create-btn { margin-top: 10px; background-color: #6BCB77; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
      `}</style>
    </div>
  );
}

export default ManagerDashboard;
