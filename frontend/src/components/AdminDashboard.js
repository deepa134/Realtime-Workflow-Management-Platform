import { useState, useEffect } from "react";
import api from "../api/api";

function AdminDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchWorkflowList();
  }, []);

  const fetchWorkflowList = async () => {
    try {
      const res = await api.get("workflows/");
      setWorkflows(res.data);
    } catch (err) {
      console.error("Error fetching workflows", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("workflows/", { name: workflowName, description });
      setWorkflowName("");
      setDescription("");
      fetchWorkflowList();
    } catch (error) {
      console.error("Error creating workflow", error);
      alert("Failed to create workflow");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workflow?")) return;
    try {
      await api.delete(`workflows/${id}/`);
      fetchWorkflowList();
    } catch (error) {
      console.error("Error deleting workflow", error);
      alert("Failed to delete workflow");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Workflow creation form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter workflow name"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Enter workflow description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button type="submit">Create Workflow</button>
      </form>

      {/* Workflow list */}
      <h3>All Workflows</h3>
      {workflows.length === 0 ? (
        <p>No workflows available.</p>
      ) : (
        <ul>
          {workflows.map((wf) => (
            <li key={wf.id}>
              <b>{wf.name}</b>
              <p>{wf.description}</p>
              <button onClick={() => handleDelete(wf.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
