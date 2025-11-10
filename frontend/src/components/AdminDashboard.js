import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles.css"; // include your CSS

function AdminDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState("");

  useEffect(() => { fetchWorkflowList(); }, []);

  const fetchWorkflowList = async () => {
    try {
      const res = await api.get("workflows/");
      setWorkflows(res.data);
    } catch (err) { console.error("Error fetching workflows", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("workflows/", { name: workflowName });
      setWorkflowName("");
      fetchWorkflowList();
    } catch (error) { alert("Failed to create workflow"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`workflows/${id}/`);
      fetchWorkflowList();
    } catch (error) { alert("Failed to delete workflow"); }
  };

  const colors = ["#FF6B6B", "#4D96FF", "#FFD93D", "#6BCB77", "#FF6EC7"];

  return (
    <div>
      {/* Header */}
      <header className="dashboard-header">
        <h1>Workflow Dashboard</h1>
        <div>
          <span>Welcome, Admin</span>
          <button className="logout-btn" onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>Logout</button>
        </div>
      </header>

      {/* Workflow Grid */}
      <div className="workflow-grid">
        {workflows.map((wf, index) => (
          <div key={wf.id} className="workflow-card" style={{ borderColor: colors[index % colors.length] }}>
            <h3>{wf.name}</h3>
            <p>Total Tasks: {wf.total_tasks || 0}</p>
            <p>
              Pending: <span className="status pending">{wf.pending || 0}</span> |{" "}
              In Progress: <span className="status inprogress">{wf.in_progress || 0}</span> |{" "}
              Done: <span className="status done">{wf.done || 0}</span>
            </p>
            <div className="card-buttons">
              <button className="access-btn">Access</button>
              <button className="delete-btn" onClick={() => handleDelete(wf.id)}>🗑</button>
            </div>
          </div>
        ))}

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
    </div>
  );
}

export default AdminDashboard;
