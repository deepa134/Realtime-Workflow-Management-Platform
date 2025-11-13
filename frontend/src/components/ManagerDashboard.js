import { useState, useEffect } from "react";
import api from "../api/api";
import WorkflowDetail from "./WorkflowDetail";
import "../styles.css";

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

  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null); // NEW: for workflow detail page

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
        title,
        status: status.toLowerCase(),
        workflow: Number(workflowId),
        assigned_to: assignedTo ? Number(assignedTo) : null,
        start_date: startDate,
        due_date: dueDate,
      });
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
      // Note: This delete handles tasks, but the button below handles workflows.
      await api.delete(`tasks/${id}/`); 
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };
  
  // NOTE: This function is for changing task status, not used in the current ManagerDashboard render
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`tasks/${id}/`, { status: newStatus.toLowerCase() });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };
  
  // New function to delete a workflow (used by the delete button in the workflow card)
  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workflow and all its associated tasks?")) return;
    try {
        await api.delete(`workflows/${id}/`);
        fetchWorkflows();
        fetchTasks(); // Refresh tasks as they might have been deleted/orphaned
    } catch (error) {
        console.error("Error deleting workflow", error);
        alert("Failed to delete workflow. Ensure no related objects prevent deletion.");
    }
  };
  
  // Group tasks by workflow (kept for completeness, though not used in the current render)
  const groupedTasks = workflows.map((wf) => ({
    workflow: wf,
    tasks: tasks.filter((task) => task.workflow && task.workflow.id === wf.id),
  }));

  // --- New: render WorkflowDetail if a workflow is selected ---
  if (selectedWorkflowId) {
    return (
      <WorkflowDetail
        workflowId={selectedWorkflowId}
        onBack={() => setSelectedWorkflowId(null)}
      />
    );
  }

  // --- Manager dashboard cards layout ---
  return (
    <div className="manager-dashboard-container">
      {/* ❌ REMOVED: The redundant local title <h2>Manager Dashboard</h2> is deleted. 
           The title is handled by the Header component in App.jsx. */}
      
      {/* Added content-specific title for context */}
      <h2 className="manager-dashboard-container">Active Workflows Overview</h2>

      {/* Workflow Cards Grid */}
      <div className="workflow-cards-grid">
        {workflows.map((wf, index) => {
          // Generate different top border color for each card
          const colors = ["#FF6B6B", "#4D96FF", "#FFA500", "#6BCB77"];
          const color = colors[index % colors.length];

          const wfTasks = tasks.filter(t => t.workflow?.id === wf.id);
          const total = wfTasks.length;
          const pending = wfTasks.filter(t => t.status.toLowerCase() === "pending").length;
          const inProgress = wfTasks.filter(t => t.status.toLowerCase() === "in progress").length;
          const done = wfTasks.filter(t => t.status.toLowerCase() === "completed").length;

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
                {/* Updated delete button to use workflow delete logic */}
                <button className="delete-btn" onClick={() => handleDeleteWorkflow(wf.id)}>🗑️</button> 
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
    </div>
  );
}

export default ManagerDashboard;