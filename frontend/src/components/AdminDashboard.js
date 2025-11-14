import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles.css";

function AdminDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workflowName, setWorkflowName] = useState("");

  useEffect(() => {
    fetchWorkflowList();
    fetchTasks();
  }, []);

  const fetchWorkflowList = async () => {
    try {
      const res = await api.get("workflows/");
      setWorkflows(res.data);
    } catch (err) {
      console.error("Error fetching workflows", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workflowName.trim()) return alert("Enter workflow title");
    try {
      await api.post("workflows/", { name: workflowName });
      setWorkflowName("");
      fetchWorkflowList();
    } catch (err) {
      alert("Failed to create workflow");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`workflows/${id}/`);
      fetchWorkflowList();
      fetchTasks();
    } catch (err) {
      alert("Failed to delete workflow");
    }
  };

  const colors = ["#FF6B6B", "#4D96FF", "#FFD93D", "#6BCB77", "#FF6EC7"];

  return (
    <div>
      <h2 className="manager-dashboard-container">All Workflows</h2>

      <div className="workflow-grid">
        {workflows.map((wf, index) => {
          // Filter tasks for this workflow
          const wfTasks = tasks.filter(t => t.workflow?.id === wf.id);
          const total = wfTasks.length;
          const pending = wfTasks.filter(t => t.status.toLowerCase() === "pending").length;
          const inProgress = wfTasks.filter(t => t.status.toLowerCase() === "in progress").length;
          const done = wfTasks.filter(t => t.status.toLowerCase() === "completed").length;

          // Completed badge if all done
          const allCompleted = total > 0 && done === total;

          return (
            <div key={wf.id} className="workflow-card" style={{ borderColor: colors[index % colors.length] }}>
              <h3>{wf.name}</h3>
              {allCompleted && <span className="completed-badge">Completed ✅</span>}
              <p>Total Tasks: {total}</p>
              <p>
                Pending: <span className="status pending">{pending}</span> |{" "}
                In Progress: <span className="status inprogress">{inProgress}</span> |{" "}
                Done: <span className="status done">{done}</span>
              </p>
              <div className="card-buttons">
                <button className="access-btn">Access</button>
                <button className="delete-btn" onClick={() => handleDelete(wf.id)}>🗑</button>
              </div>
            </div>
          );
        })}

        {/* Create New Workflow Card */}
        <div className="workflow-card create-card">
          <h3>Create New</h3>
          <input
            type="text"
            placeholder="Workflow Title"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
          <button className="create-btn" onClick={handleSubmit}>+ Create Workflow</button>
        </div>
      </div>

      {/* Inline CSS for Completed Badge */}
      <style>{`
        .completed-badge {
          display: inline-block;
          background-color: #6BCB77;
          color: white;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 12px;
          margin-bottom: 5px;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
