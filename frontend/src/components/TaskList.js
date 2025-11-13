import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles.css";

// --- Sub-Component for a single Task Card ---
const TaskCard = ({ task, handleDelete, handleStatusChange }) => {
    // Determine the border-left color based on task status
    const statusClass = task.status.toLowerCase().replace(" ", "-");
    
    // Get assigned user's name or a default string
    const assignedUserName = task.assigned_to ? task.assigned_to.username : "Unassigned";

    return (
        <div className={`task-card status-card-${statusClass}`}>
            <h4 className="task-card-title">{task.title}</h4>
            
            <p className="task-card-detail">
                <span className="icon">🟢</span> Status: <strong className={`status-text-${statusClass}`}>{task.status}</strong>
            </p>
            <p className="task-card-detail">
                <span className="icon">👤</span> Assigned To: <strong>{assignedUserName}</strong>
            </p>
            <p className="task-card-detail">
                <span className="icon">🗓️</span> Start Date: <strong>{task.start_date ? task.start_date.split("T")[0] : "Not set"}</strong>
            </p>
            <p className="task-card-detail">
                <span className="icon">📅</span> Due Date: <strong>{task.due_date ? task.due_date.split("T")[0] : "Not set"}</strong>
            </p>

            <div className="task-actions">
                <button 
                    onClick={() => handleDelete(task.id)} 
                    className="btn btn-delete"
                    title="Delete Task"
                >🗑️</button>
                
                {/* Conditional Status Buttons */}
                {task.status.toLowerCase() === 'pending' && (
                    <button 
                        onClick={() => handleStatusChange(task.id, "In Progress")} 
                        className="btn btn-status-progress"
                    >Start Progress</button>
                )}
                {task.status.toLowerCase() === 'in progress' && (
                    <button 
                        onClick={() => handleStatusChange(task.id, "Completed")} 
                        className="btn btn-status-complete"
                    >Mark Complete</button>
                )}
                {task.status.toLowerCase() === 'completed' && (
                    <button className="btn btn-status-complete" disabled>Completed</button>
                )}
            </div>
        </div>
    );
};


function WorkflowDetail({ workflowId, onBack }) {
    const [workflow, setWorkflow] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    // Task form states
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("Pending"); // Default to Pending
    const [assignedTo, setAssignedTo] = useState(""); // Stores user ID
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        fetchWorkflow();
        fetchTasks();
        fetchUsers();
    }, [workflowId]); // Re-fetch when workflowId changes

    const fetchWorkflow = async () => {
        try {
            const res = await api.get(`workflows/${workflowId}/`);
            setWorkflow(res.data);
        } catch (err) {
            console.error("Error fetching workflow:", err);
            // Optionally, handle error state or redirect
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
            // Pre-select first user if available, or set to empty
            if (res.data.length > 0) {
                setAssignedTo(String(res.data[0].id));
            } else {
                setAssignedTo("");
            }
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
                assigned_to: assignedTo ? Number(assignedTo) : null, // Send ID as number or null
                start_date: startDate || null, // Send null if empty
                due_date: dueDate || null,     // Send null if empty
            });
            // Reset form fields
            setTitle("");
            setStatus("Pending");
            // Keep assignedTo as first user or empty if no users
            setAssignedTo(users.length > 0 ? String(users[0].id) : ""); 
            setStartDate("");
            setDueDate("");
            fetchTasks(); // Refresh tasks after creation
        } catch (err) {
            console.error("Error creating task:", err);
            alert("Failed to create task: " + (err.response?.data?.detail || "Please check your input."));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) return;
        try {
            await api.delete(`tasks/${id}/`);
            fetchTasks(); // Refresh tasks after deletion
        } catch (err) {
            console.error("Error deleting task:", err);
            alert("Failed to delete task.");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`tasks/${id}/`, { status: newStatus.toLowerCase() });
            fetchTasks(); // Refresh tasks after status change
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status.");
        }
    };

    // Show loading state if workflow is not yet fetched
    if (!workflow) return <p className="loading-state">Loading workflow details...</p>;

    // Helper function to filter and sort tasks for each Kanban column
    const getTasksByStatus = (statusFilter) => {
        return tasks
            .filter(task => task.status.toLowerCase() === statusFilter.toLowerCase())
            .sort((a, b) => {
                // Sort tasks by due date, pushing 'Not set' dates to the end
                const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
                const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
                return dateA - dateB;
            });
    };

    // Calculate total tasks for the overview card
    const totalTasks = tasks.length;

    // --- Component Return ---
    return (
        <div className="workflow-detail-page">
            <button className="btn btn-back" onClick={onBack}>⬅ Back to Workflows</button>

            {/* Workflow Overview Card */}
            <div className="workflow-overview-card">
                <div className="info">
                    <h1>{workflow.name}</h1>
                    <p>{workflow.description || "No detailed description available. Add tasks to manage your workflow effectively!"}</p>
                </div>
                <div className="stats">
                    <h4>Total Tasks</h4>
                    <div className="count">{totalTasks}</div>
                    <div className="label">Across all statuses</div>
                </div>
            </div>

            {/* Main Content Area: Task Form + Kanban Board */}
            <div className="workflow-main-content">

                {/* Task Creation Form Sidebar */}
                <div className="task-form-card">
                    <h3>Create New Task</h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="taskTitle">Task Title</label>
                            <input
                                id="taskTitle"
                                type="text"
                                placeholder="e.g., Design UI Mockups"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="assignedTo">Assign To</label>
                            <select 
                                id="assignedTo"
                                value={assignedTo} 
                                onChange={(e) => setAssignedTo(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.username}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="startDate">Start Date</label>
                            <input 
                                id="startDate"
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="dueDate">Due Date</label>
                            <input 
                                id="dueDate"
                                type="date" 
                                value={dueDate} 
                                onChange={(e) => setDueDate(e.target.value)} 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="taskStatus">Initial Status</label>
                            <select 
                                id="taskStatus"
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)} 
                                required
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        
                        <button type="submit" className="btn btn-create-task">
                            <span className="icon">➕</span> Add Task
                        </button>
                    </form>
                </div>

                {/* Kanban Board (3 Columns) */}
                <div className="kanban-board">
                    
                    {/* Pending Column */}
                    <div className="kanban-column">
                        <h3 className="kanban-column-header">Pending</h3>
                        {getTasksByStatus("Pending").length === 0 ? (
                            <p className="empty-column-message">No pending tasks. Start adding some!</p>
                        ) : (
                            getTasksByStatus("Pending").map(task => (
                                <TaskCard 
                                    task={task} 
                                    handleDelete={handleDelete} 
                                    handleStatusChange={handleStatusChange} 
                                    key={task.id} 
                                />
                            ))
                        )}
                    </div>

                    {/* In Progress Column */}
                    <div className="kanban-column">
                        <h3 className="kanban-column-header">In Progress</h3>
                        {getTasksByStatus("In Progress").length === 0 ? (
                            <p className="empty-column-message">No tasks in progress. Keep up the good work!</p>
                        ) : (
                            getTasksByStatus("In Progress").map(task => (
                                <TaskCard 
                                    task={task} 
                                    handleDelete={handleDelete} 
                                    handleStatusChange={handleStatusChange} 
                                    key={task.id} 
                                />
                            ))
                        )}
                    </div>

                    {/* Completed Column */}
                    <div className="kanban-column">
                        <h3 className="kanban-column-header">Completed</h3>
                        {getTasksByStatus("Completed").length === 0 ? (
                            <p className="empty-column-message">No completed tasks yet. Time to mark some done!</p>
                        ) : (
                            getTasksByStatus("Completed").map(task => (
                                <TaskCard 
                                    task={task} 
                                    handleDelete={handleDelete} 
                                    handleStatusChange={handleStatusChange} 
                                    key={task.id} 
                                />
                            ))
                        )}
                    </div>

                </div> {/* End Kanban Board */}
            </div> {/* End Main Content Area */}
        </div> // End Workflow Detail Page
    );
}

export default WorkflowDetail;