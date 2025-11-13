import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles.css";

// --- Sub-Component for a single Task Card ---
// Defined OUTSIDE the main component to avoid syntax issues and for better performance.
const TaskCard = ({ task, handleDelete, handleStatusChange }) => (
    <div key={task.id} className={`flowchart-task-card status-card-${task.status.toLowerCase().replace(" ", "-")}`}>
        <h4>{task.title}</h4>
        <p>Status: <span className={`status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span></p>
        <p>Assigned To: {task.assigned_to ? task.assigned_to.username : "Unassigned"}</p>
        <p>Start: {task.start_date ? task.start_date.split("T")[0] : "Not set"}</p>
        <p>Due: {task.due_date ? task.due_date.split("T")[0] : "Not set"}</p>
        <div className="task-card-buttons">
            <button onClick={() => handleDelete(task.id)} className="delete-btn">🗑️</button>
            
            {/* Conditional Status Buttons */}
            {task.status.toLowerCase() === 'pending' && (
                <button 
                    onClick={() => handleStatusChange(task.id, "In Progress")} 
                    className="status-btn"
                >Start Progress</button>
            )}
            {task.status.toLowerCase() === 'in progress' && (
                <button 
                    onClick={() => handleStatusChange(task.id, "Completed")} 
                    className="status-btn completed"
                >Mark Complete</button>
            )}
            {task.status.toLowerCase() === 'completed' && (
                <button className="status-btn completed" disabled>Completed</button>
            )}
        </div>
    </div>
);


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
    }, [workflowId]);

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
            alert("Failed to create task.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`tasks/${id}/`);
            fetchTasks(); 
        } catch (err) {
            console.error("Error deleting task:", err);
            alert("Failed to delete task.");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`tasks/${id}/`, { status: newStatus.toLowerCase() });
            fetchTasks(); 
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status.");
        }
    };

    if (!workflow) return <p className="loading-state">Loading Workflow Details...</p>;

    // Helper function to filter and sort tasks for each column
    const getTasksByStatus = (statusFilter) => {
        return tasks
            .filter(task => task.status.toLowerCase() === statusFilter.toLowerCase())
            .sort((a, b) => {
                const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
                const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
                return dateA - dateB;
            });
    };

    // --- Component Return ---
    return (
        <div className="workflow-detail-container">
            <button className="back-btn" onClick={onBack}>⬅ Back</button>

            {/* 1. Workflow Header Card */}
            <div className="workflow-header-card">
                <h2 className="workflow-title">{workflow.name}</h2>
                <p className="workflow-desc">{workflow.description || "Active project workflow management."}</p>
            </div>

            {/* 2. Main Content Area (Form Sidebar + Kanban Board) */}
            <div className="workflow-content-area">

                {/* Task Creation Form - Fixed-width side panel */}
                <div className="task-create-card">
                    <h3>+ Create New Task</h3>
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

                {/* Kanban Board (3 Columns) */}
                <div className="workflow-flowchart">
                    
                    {/* Pending Column */}
                    <div className="kanban-column">
                        <h3>Pending</h3>
                        {getTasksByStatus("Pending").length === 0 ? (
                            <p className="empty-state">No pending tasks yet.</p>
                        ) : (
                            getTasksByStatus("Pending").map(task => (
                                <TaskCard task={task} handleDelete={handleDelete} handleStatusChange={handleStatusChange} key={task.id} />
                            ))
                        )}
                    </div>

                    {/* In Progress Column */}
                    <div className="kanban-column">
                        <h3>In Progress</h3>
                        {getTasksByStatus("In Progress").length === 0 ? (
                            <p className="empty-state">No tasks in progress.</p>
                        ) : (
                            getTasksByStatus("In Progress").map(task => (
                                <TaskCard task={task} handleDelete={handleDelete} handleStatusChange={handleStatusChange} key={task.id} />
                            ))
                        )}
                    </div>

                    {/* Completed Column */}
                    <div className="kanban-column">
                        <h3>Completed</h3>
                        {getTasksByStatus("Completed").length === 0 ? (
                            <p className="empty-state">No completed tasks yet. Great job!</p>
                        ) : (
                            getTasksByStatus("Completed").map(task => (
                                <TaskCard task={task} handleDelete={handleDelete} handleStatusChange={handleStatusChange} key={task.id} />
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default WorkflowDetail;